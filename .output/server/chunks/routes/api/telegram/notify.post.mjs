import { d as defineEventHandler, r as readBody } from '../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const notify_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { type, data } = body;
    if (!type || !data) {
      throw new Error("\u0422\u0440\u0435\u0431\u0443\u044E\u0442\u0441\u044F \u043F\u043E\u043B\u044F type \u0438 data");
    }
    console.log(`Telegram notification: ${type}`, data);
    return {
      success: true,
      message: "\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0435 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043E"
    };
  } catch (error) {
    console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043E\u0442\u043F\u0440\u0430\u0432\u043A\u0438 Telegram \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F:", error);
    return {
      success: false,
      error: error.message
    };
  }
});

export { notify_post as default };
//# sourceMappingURL=notify.post.mjs.map
