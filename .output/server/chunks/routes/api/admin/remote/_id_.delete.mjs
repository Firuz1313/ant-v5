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
  const remoteId = getRouterParam(event, "id");
  console.log(`Deleted remote control ${remoteId}`);
  return {
    success: true,
    message: "\u041F\u0443\u043B\u044C\u0442 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0443\u0434\u0430\u043B\u0435\u043D",
    remoteId: parseInt(remoteId)
  };
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
