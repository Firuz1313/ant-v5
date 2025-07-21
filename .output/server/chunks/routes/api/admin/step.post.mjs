import { d as defineEventHandler, r as readBody } from '../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const step_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const newStep = {
    id: Date.now(),
    // Simple ID generation for demo
    device_id: body.device_id,
    error_id: body.error_id,
    order_index: body.order_index || 1,
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
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  console.log("Created new step:", newStep);
  return {
    success: true,
    step: newStep,
    message: "\u0428\u0430\u0433 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0441\u043E\u0437\u0434\u0430\u043D"
  };
});

export { step_post as default };
//# sourceMappingURL=step.post.mjs.map
