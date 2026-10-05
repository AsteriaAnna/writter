// PostgreSQL repository over CloudBase rdb() (PostgREST). Replaces flexdb app.database().
const TABLE = 'projects';

const isDuplicate = err => {
  if (!err) return false;
  const code = err.code || '';
  const msg = `${err.message || ''} ${err.details || ''}`;
  return code === '23505' || /duplicate|already exists|unique/i.test(msg);
};

export function createPgRepo(rdb) {
  const t = () => rdb.from(TABLE);

  // Returns {ownerId, ...project} or null. `data` is the jsonb project document.
  async function get(id) {
    const { data, error } = await t().select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return { ownerId: data.owner_id, ...data.data };
  }

  return {
    TABLE,
    async list(uid, offset) {
      const { data, error } = await t()
        .select('id,stage,revision,updated_at,title')
        .eq('owner_id', uid)
        .order('updated_at', { ascending: false })
        .range(offset, offset + 99);
      if (error) throw error;
      const rows = Array.isArray(data) ? data : [];
      return {
        items: rows.map(r => ({
          id: r.id,
          stage: r.stage,
          revision: r.revision,
          updatedAt: r.updated_at,
          plan: { title: r.title },
          partial: true,
        })),
        nextOffset: rows.length === 100 ? offset + 100 : null,
      };
    },
    get,
    async create(uid, id, project) {
      const existing = await get(id);
      if (existing) return existing;
      const { error } = await t().insert({
        id,
        owner_id: uid,
        revision: project.revision,
        stage: project.stage,
        title: (project.plan && project.plan.title) || (project.candidate && project.candidate.title) || '',
        updated_at: project.updatedAt,
        data: project,
        schema_version: 1,
      });
      if (error) {
        if (isDuplicate(error)) {
          const again = await get(id);
          if (again) return again;
        }
        throw error;
      }
      const created = await get(id);
      if (!created) throw new Error('项目创建后无法读取');
      return created;
    },
    // Atomic conditional update: only succeeds if revision still matches.
    // Returns {ownerId, ...next} or null when the row was changed concurrently.
    async mutate(id, uid, expectedRevision, next) {
      const { data, error } = await t()
        .update({
          revision: next.revision,
          stage: next.stage,
          title: (next.plan && next.plan.title) || (next.candidate && next.candidate.title) || '',
          updated_at: next.updatedAt,
          data: next,
        })
        .eq('id', id)
        .eq('owner_id', uid)
        .eq('revision', expectedRevision)
        .select('*');
      if (error) throw error;
      const rows = Array.isArray(data) ? data : (data ? [data] : []);
      if (rows.length === 0) return null; // revision moved under us
      return { ownerId: rows[0].owner_id, ...rows[0].data };
    },
  };
}
