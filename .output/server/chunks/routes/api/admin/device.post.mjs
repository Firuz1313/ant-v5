import { d as defineEventHandler, r as readBody } from '../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const device_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const newDevice = {
    id: Date.now(),
    // Simple ID generation for demo
    name: body.name,
    description: body.description,
    remote_image: body.remote_image,
    icon: "\u{1F4F1}",
    // Default icon
    error_count: 0,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  console.log("Created new device:", newDevice);
  return {
    success: true,
    device: newDevice,
    message: "\u0423\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u043E \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0441\u043E\u0437\u0434\u0430\u043D\u043E"
  };
});

export { device_post as default };
//# sourceMappingURL=device.post.mjs.map
