import { d as defineEventHandler, r as readBody, c as createError } from '../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const settings_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    if (!body || typeof body !== "object") {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid settings data"
      });
    }
    const settings = {
      defaultDeviceIcon: body.defaultDeviceIcon || null,
      defaultRemote: body.defaultRemote || null,
      theme: body.theme || "light",
      language: body.language || "ru",
      notifications: body.notifications !== void 0 ? body.notifications : true,
      autoSync: body.autoSync !== void 0 ? body.autoSync : true,
      mediaPath: body.mediaPath || "/uploads",
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    console.log("Settings saved:", settings);
    return {
      success: true,
      message: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u044B",
      settings
    };
  } catch (error) {
    console.error("Settings save error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to save settings"
    });
  }
});

export { settings_post as default };
//# sourceMappingURL=settings.post.mjs.map
