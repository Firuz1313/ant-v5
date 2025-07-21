import { d as defineEventHandler, a as getRouterParam } from '../../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const _id__delete = defineEventHandler(async (event) => {
  const deviceId = getRouterParam(event, "id");
  console.log(`Deleted device ${deviceId}`);
  return {
    success: true,
    message: "\u0423\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u043E \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0443\u0434\u0430\u043B\u0435\u043D\u043E",
    deviceId: parseInt(deviceId)
  };
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
