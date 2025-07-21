import { d as defineEventHandler, a as getRouterParam, c as createError } from '../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const _id__get = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  try {
    const devices = [
      {
        id: 1,
        name: "Openbox",
        description: "\u0421\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u043D\u0430\u044F \u043F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430 Openbox",
        icon: "\u{1F4FA}",
        errorCount: 4,
        image: null
      },
      {
        id: 2,
        name: "HDBOX",
        description: "HD \u043F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430 HDBOX",
        icon: "\u{1F4FA}",
        errorCount: 3,
        image: null
      },
      {
        id: 3,
        name: "UCLAN",
        description: "\u041F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430 UCLAN",
        icon: "\u{1F4FA}",
        errorCount: 2,
        image: null
      },
      {
        id: 4,
        name: "Openbox GOLD",
        description: "\u041F\u0440\u0435\u043C\u0438\u0443\u043C \u0432\u0435\u0440\u0441\u0438\u044F Openbox",
        icon: "\u{1F4FA}",
        errorCount: 5,
        image: null
      }
    ];
    const device = devices.find((d) => d.id === parseInt(id));
    if (!device) {
      throw createError({
        statusCode: 404,
        statusMessage: "Device not found"
      });
    }
    return device;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch device"
    });
  }
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
