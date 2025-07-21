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
  const stepId = getRouterParam(event, "id");
  const body = await readBody(event);
  const updatedStep = {
    id: parseInt(stepId),
    device_id: body.device_id,
    error_id: body.error_id,
    order_index: body.order_index,
    title: body.title,
    instruction: body.instruction,
    tip: body.tip,
    screen_image: body.screen_image,
    highlighted_buttons: body.highlighted_buttons || [],
    actions: body.actions || [],
    audio_url: body.audio_url,
    onlyForOperator: body.onlyForOperator || false,
    media: body.media,
    userConfirmation: body.userConfirmation,
    validation: body.validation,
    ifNoResult: body.ifNoResult,
    progress: body.progress || false,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  console.log(`Updated step ${stepId}:`, updatedStep);
  return {
    success: true,
    step: updatedStep,
    message: "\u0428\u0430\u0433 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D"
  };
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
