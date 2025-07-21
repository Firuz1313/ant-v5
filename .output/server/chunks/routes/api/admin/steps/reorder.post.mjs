import { d as defineEventHandler, r as readBody, c as createError } from '../../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const reorder_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { draggedStepId, targetStepId, draggedIndex, targetIndex } = body;
  try {
    const steps = [];
    if (draggedIndex > targetIndex) {
      console.log(`Moving step ${draggedStepId} up from ${draggedIndex} to ${targetIndex}`);
    } else {
      console.log(`Moving step ${draggedStepId} down from ${draggedIndex} to ${targetIndex}`);
    }
    console.log("Step reordering completed:", {
      draggedStepId,
      targetStepId,
      draggedIndex,
      targetIndex
    });
    return {
      success: true,
      message: "\u041F\u043E\u0440\u044F\u0434\u043E\u043A \u0448\u0430\u0433\u043E\u0432 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0438\u0437\u043C\u0435\u043D\u0435\u043D",
      reorderedSteps: {
        draggedStepId: parseInt(draggedStepId),
        newPosition: targetIndex
      }
    };
  } catch (error) {
    console.error("Error reordering steps:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0438 \u043F\u043E\u0440\u044F\u0434\u043A\u0430 \u0448\u0430\u0433\u043E\u0432"
    });
  }
});

export { reorder_post as default };
//# sourceMappingURL=reorder.post.mjs.map
