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
  const errorId = getRouterParam(event, "id");
  const body = await readBody(event);
  if (!body.title || !body.description) {
    throw createError({
      statusCode: 400,
      statusMessage: "\u041E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u044E\u0442 \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u0435 \u043F\u043E\u043B\u044F: title, description"
    });
  }
  const validSeverities = ["low", "medium", "high"];
  if (body.severity && !validSeverities.includes(body.severity)) {
    throw createError({
      statusCode: 400,
      statusMessage: "\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 severity. \u0414\u043E\u043F\u0443\u0441\u0442\u0438\u043C\u044B\u0435: low, medium, high"
    });
  }
  const updatedError = {
    id: parseInt(errorId),
    device_id: body.device_id ? parseInt(body.device_id) : void 0,
    title: body.title,
    description: body.description,
    icon: body.icon || "\u26A0\uFE0F",
    severity: body.severity || "medium",
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  console.log(`Updated error ${errorId}:`, updatedError);
  return {
    success: true,
    error: updatedError,
    message: "\u041E\u0448\u0438\u0431\u043A\u0430 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0430"
  };
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
