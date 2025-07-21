import { d as defineEventHandler, a as getRouterParam, r as readBody, c as createError } from '../../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const _id__put = defineEventHandler(async (event) => {
  const remoteId = getRouterParam(event, "id");
  const body = await readBody(event);
  if (!body.name || !body.image || !body.buttons) {
    throw createError({
      statusCode: 400,
      statusMessage: "\u041E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u044E\u0442 \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u0435 \u043F\u043E\u043B\u044F: name, image, buttons"
    });
  }
  if (!Array.isArray(body.buttons) || body.buttons.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0434\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0445\u043E\u0442\u044F \u0431\u044B \u043E\u0434\u043D\u0443 \u043A\u043D\u043E\u043F\u043A\u0443"
    });
  }
  const updatedRemote = {
    id: parseInt(remoteId),
    deviceId: body.deviceId,
    name: body.name,
    version: body.version || "1.0",
    image: body.image,
    buttons: body.buttons,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  console.log(`Updated remote control ${remoteId}:`, {
    name: updatedRemote.name,
    buttonCount: updatedRemote.buttons.length
  });
  return {
    success: true,
    remote: updatedRemote,
    message: "\u041F\u0443\u043B\u044C\u0442 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D"
  };
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
