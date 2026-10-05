import cloudbase from '@cloudbase/js-sdk/app';
import {registerAuth} from '@cloudbase/js-sdk/auth';
import {registerFunctions} from '@cloudbase/js-sdk/functions';
registerAuth(cloudbase);
registerFunctions(cloudbase);
export default cloudbase;
