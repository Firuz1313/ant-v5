import { d as defineEventHandler, r as readBody, c as createError } from '../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const remote_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body.deviceId || !body.name || !body.image || !body.buttons) {
    throw createError({
      statusCode: 400,
      statusMessage: "\u041E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u044E\u0442 \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u0435 \u043F\u043E\u043B\u044F: deviceId, name, image, buttons"
    });
  }
  if (!Array.isArray(body.buttons) || body.buttons.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0434\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0445\u043E\u0442\u044F \u0431\u044B \u043E\u0434\u043D\u0443 \u043A\u043D\u043E\u043F\u043A\u0443"
    });
  }
  for (const button of body.buttons) {
    if (!button.type || !button.label || typeof button.x !== "number" || typeof button.y !== "number") {
      throw createError({
        statusCode: 400,
        statusMessage: "\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0430\u044F \u0441\u0442\u0440\u0443\u043A\u0442\u0443\u0440\u0430 \u043A\u043D\u043E\u043F\u043A\u0438. \u0422\u0440\u0435\u0431\u0443\u044E\u0442\u0441\u044F \u043F\u043E\u043B\u044F: type, label, x, y"
      });
    }
    if (button.x < 0 || button.x > 100 || button.y < 0 || button.y > 100) {
      throw createError({
        statusCode: 400,
        statusMessage: "\u041A\u043E\u043E\u0440\u0434\u0438\u043D\u0430\u0442\u044B \u043A\u043D\u043E\u043F\u043E\u043A \u0434\u043E\u043B\u0436\u043D\u044B \u0431\u044B\u0442\u044C \u0432 \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D\u0435 0-100%"
      });
    }
  }
  const newRemote = {
    id: Date.now(),
    // Simple ID generation for demo
    deviceId: body.deviceId,
    name: body.name,
    version: body.version || "1.0",
    image: body.image,
    buttons: body.buttons.map((button, index) => ({
      ...button,
      id: Date.now() + index
      // Ensure unique IDs
    })),
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  console.log("Created new remote control:", {
    id: newRemote.id,
    deviceId: newRemote.deviceId,
    name: newRemote.name,
    buttonCount: newRemote.buttons.length
  });
  return {
    success: true,
    remote: newRemote,
    message: "\u041F\u0443\u043B\u044C\u0442 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0441\u043E\u0437\u0434\u0430\u043D"
  };
});

export { remote_post as default };
//# sourceMappingURL=remote.post.mjs.map
