import { d as defineEventHandler, c as createError } from '../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const settings_get = defineEventHandler(async (event) => {
  try {
    const settings = {
      defaultDeviceIcon: null,
      defaultRemote: null,
      theme: "light",
      language: "ru",
      notifications: true,
      autoSync: true,
      mediaPath: "/uploads",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    return settings;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to load settings"
    });
  }
});

export { settings_get as default };
//# sourceMappingURL=settings.get.mjs.map
