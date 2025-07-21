import { d as defineEventHandler, a as getRouterParam, r as readBody } from '../../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const _id__put = defineEventHandler(async (event) => {
  const deviceId = getRouterParam(event, "id");
  const body = await readBody(event);
  const updatedDevice = {
    id: parseInt(deviceId),
    name: body.name,
    description: body.description,
    remote_image: body.remote_image,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  console.log(`Updated device ${deviceId}:`, updatedDevice);
  return {
    success: true,
    device: updatedDevice,
    message: "\u0423\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u043E \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u043E"
  };
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
