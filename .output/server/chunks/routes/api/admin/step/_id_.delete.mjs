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
  const stepId = getRouterParam(event, "id");
  console.log(`Deleted step ${stepId}`);
  return {
    success: true,
    message: "\u0428\u0430\u0433 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0443\u0434\u0430\u043B\u0435\u043D",
    stepId: parseInt(stepId)
  };
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
