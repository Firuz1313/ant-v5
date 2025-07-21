import { d as defineEventHandler, r as readBody, c as createError } from '../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const masterRequest_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  try {
    const requestId = `REQ_${Date.now()}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const masterRequest = {
      id: requestId,
      timestamp: Date.now(),
      deviceInfo: body.deviceInfo || {},
      errorInfo: body.errorInfo || {},
      diagnosticPath: body.diagnosticPath || [],
      userContact: body.userContact || {},
      priority: determinePriority(body),
      status: "pending",
      estimatedArrival: calculateEstimatedArrival()
    };
    console.log("Master request created:", masterRequest);
    await sendMasterNotification(masterRequest);
    return {
      success: true,
      requestId,
      message: "\u0417\u0430\u044F\u0432\u043A\u0430 \u043D\u0430 \u0432\u044B\u0437\u043E\u0432 \u043C\u0430\u0441\u0442\u0435\u0440\u0430 \u043F\u0440\u0438\u043D\u044F\u0442\u0430",
      estimatedArrival: masterRequest.estimatedArrival,
      trackingUrl: `/track/${requestId}`
    };
  } catch (error) {
    console.error("Master request error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u043E\u0437\u0434\u0430\u0442\u044C \u0437\u0430\u044F\u0432\u043A\u0443 \u043D\u0430 \u0432\u044B\u0437\u043E\u0432 \u043C\u0430\u0441\u0442\u0435\u0440\u0430"
    });
  }
});
function determinePriority(requestData) {
  const { errorInfo, diagnosticPath } = requestData;
  if (errorInfo.severity === "high") return "high";
  if (diagnosticPath.length > 5) return "medium";
  return "normal";
}
function calculateEstimatedArrival() {
  const now = /* @__PURE__ */ new Date();
  const businessHours = isBusinessHours(now);
  if (businessHours) {
    return new Date(now.getTime() + (2 + Math.random() * 2) * 60 * 60 * 1e3);
  } else {
    const nextDay = new Date(now);
    nextDay.setDate(nextDay.getDate() + 1);
    nextDay.setHours(9, 0, 0, 0);
    return nextDay;
  }
}
function isBusinessHours(date) {
  const hour = date.getHours();
  const day = date.getDay();
  return day >= 1 && day <= 5 && hour >= 8 && hour < 18;
}
async function sendMasterNotification(request) {
  console.log("Sending master notification:", {
    requestId: request.id,
    priority: request.priority,
    estimatedArrival: request.estimatedArrival
  });
}

export { masterRequest_post as default };
//# sourceMappingURL=master-request.post.mjs.map
