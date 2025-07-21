import { d as defineEventHandler, r as readBody, c as createError } from '../../nitro/nitro.mjs';
import fs from 'fs';
import path from 'path';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const analytics_post = defineEventHandler(async (event) => {
  var _a;
  const body = await readBody(event);
  try {
    console.log("Analytics received:", {
      sessionId: body.sessionId,
      eventsCount: ((_a = body.events) == null ? void 0 : _a.length) || 0,
      summary: body.summary
    });
    const analytics = processAnalytics(body);
    await saveAnalytics(analytics);
    return {
      success: true,
      sessionId: body.sessionId,
      processed: analytics
    };
  } catch (error) {
    console.error("Analytics processing error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to process analytics"
    });
  }
});
function processAnalytics(data) {
  const { events, summary } = data;
  const behaviorPatterns = {
    averageTimePerStep: calculateAverageTimePerStep(events),
    mostDifficultSteps: findDifficultSteps(events),
    buttonPressAccuracy: calculateButtonAccuracy(events),
    completionPath: extractCompletionPath(events),
    userStuckPoints: findStuckPoints(events)
  };
  const completionAnalysis = {
    completed: summary.stepsCompleted,
    total: summary.stepsViewed,
    completionRate: summary.stepsCompleted / summary.stepsViewed,
    abandonmentPoint: findAbandonmentPoint(events)
  };
  return {
    sessionId: data.sessionId,
    timestamp: Date.now(),
    behaviorPatterns,
    completionAnalysis,
    summary,
    flags: generateFlags(behaviorPatterns, completionAnalysis)
  };
}
function calculateAverageTimePerStep(events) {
  const stepTimes = events.filter((e) => e.type === "step_action" && e.timeOnStep).map((e) => e.timeOnStep);
  return stepTimes.length > 0 ? stepTimes.reduce((a, b) => a + b, 0) / stepTimes.length : 0;
}
function findDifficultSteps(events) {
  const stepData = {};
  events.forEach((event) => {
    if (event.type === "step_action" && event.stepId) {
      if (!stepData[event.stepId]) {
        stepData[event.stepId] = {
          stepId: event.stepId,
          stepTitle: event.stepTitle,
          views: 0,
          completions: 0,
          totalTime: 0,
          failures: 0
        };
      }
      const step = stepData[event.stepId];
      if (event.action === "viewed") step.views++;
      if (event.action === "completed") step.completions++;
      if (event.action === "failed") step.failures++;
      if (event.timeOnStep) step.totalTime += event.timeOnStep;
    }
  });
  return Object.values(stepData).map((step) => ({
    ...step,
    avgTime: step.views > 0 ? step.totalTime / step.views : 0,
    completionRate: step.views > 0 ? step.completions / step.views : 0,
    failureRate: step.views > 0 ? step.failures / step.views : 0
  })).sort((a, b) => a.completionRate - b.completionRate);
}
function calculateButtonAccuracy(events) {
  const buttonEvents = events.filter((e) => e.type === "button_press");
  const successful = buttonEvents.filter((e) => e.successful).length;
  return buttonEvents.length > 0 ? successful / buttonEvents.length : 1;
}
function extractCompletionPath(events) {
  return events.filter((e) => e.type === "step_action" && e.action === "viewed").map((e) => ({
    stepId: e.stepId,
    stepTitle: e.stepTitle,
    timestamp: e.timestamp
  }));
}
function findStuckPoints(events) {
  return events.filter((e) => e.type === "step_action" && e.timeOnStep > 12e4).map((e) => ({
    stepId: e.stepId,
    stepTitle: e.stepTitle,
    timeSpent: e.timeOnStep,
    timestamp: e.timestamp
  }));
}
function findAbandonmentPoint(events) {
  const stepEvents = events.filter((e) => e.type === "step_action" && e.action === "viewed");
  return stepEvents.length > 0 ? stepEvents[stepEvents.length - 1].stepId : null;
}
function generateFlags(behaviorPatterns, completionAnalysis) {
  const flags = [];
  if (completionAnalysis.completionRate < 0.5) {
    flags.push("low_completion_rate");
  }
  if (behaviorPatterns.buttonPressAccuracy < 0.7) {
    flags.push("high_button_error_rate");
  }
  if (behaviorPatterns.averageTimePerStep > 18e4) {
    flags.push("slow_progression");
  }
  if (behaviorPatterns.userStuckPoints.length > 2) {
    flags.push("multiple_stuck_points");
  }
  return flags;
}
async function saveAnalytics(analytics) {
  try {
    const dataPath = path.join(process.cwd(), "data", "user_logs.json");
    let userData = [];
    if (fs.existsSync(dataPath)) {
      const fileContent = fs.readFileSync(dataPath, "utf-8");
      userData = JSON.parse(fileContent);
    }
    const userLogEntry = {
      sessionId: analytics.sessionId,
      sessionStart: analytics.summary.startTime ? new Date(analytics.summary.startTime).toISOString() : (/* @__PURE__ */ new Date()).toISOString(),
      sessionEnd: analytics.summary.lastActivity ? new Date(analytics.summary.lastActivity).toISOString() : null,
      device: extractDeviceFromEvents(analytics.summary),
      error: extractErrorFromEvents(analytics.summary),
      completed: analytics.completionAnalysis.completionRate >= 1,
      currentStep: analytics.summary.stepsViewed,
      currentStepTitle: getLastStepTitle(analytics),
      events: analytics.summary.events || [],
      userAgent: analytics.summary.userAgent,
      flags: analytics.flags,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    const existingIndex = userData.findIndex((entry) => entry.sessionId === analytics.sessionId);
    if (existingIndex !== -1) {
      userData[existingIndex] = userLogEntry;
    } else {
      userData.push(userLogEntry);
    }
    fs.writeFileSync(dataPath, JSON.stringify(userData, null, 2), "utf-8");
    console.log(`Analytics saved for session ${analytics.sessionId}`);
  } catch (error) {
    console.error("Failed to save analytics:", error);
  }
}
function extractDeviceFromEvents(summary) {
  if (summary.deviceId) return summary.deviceId;
  return "\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u043E";
}
function extractErrorFromEvents(summary) {
  if (summary.errorId) return summary.errorId;
  return "\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u043E";
}
function getLastStepTitle(analytics) {
  var _a;
  const stepEvents = ((_a = analytics.summary.events) == null ? void 0 : _a.filter((e) => e.type === "step_action" && e.stepTitle)) || [];
  if (stepEvents.length > 0) {
    return stepEvents[stepEvents.length - 1].stepTitle;
  }
  return null;
}

export { analytics_post as default };
//# sourceMappingURL=analytics.post.mjs.map
