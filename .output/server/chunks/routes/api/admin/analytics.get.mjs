import { d as defineEventHandler, g as getQuery } from '../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const analytics_get = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const timeRange = query.range || "24h";
  const analyticsStorage = global.analyticsStorage || [];
  const now = Date.now();
  let cutoffTime = 0;
  switch (timeRange) {
    case "1h":
      cutoffTime = now - 60 * 60 * 1e3;
      break;
    case "24h":
      cutoffTime = now - 24 * 60 * 60 * 1e3;
      break;
    case "7d":
      cutoffTime = now - 7 * 24 * 60 * 60 * 1e3;
      break;
    case "30d":
      cutoffTime = now - 30 * 24 * 60 * 60 * 1e3;
      break;
    default:
      cutoffTime = 0;
  }
  const filteredSessions = analyticsStorage.filter((session) => {
    const sessionTime = new Date(session.timestamp).getTime();
    return sessionTime >= cutoffTime;
  });
  const analytics = {
    overview: generateOverview(filteredSessions),
    deviceUsage: generateDeviceUsage(),
    errorDistribution: generateErrorDistribution(),
    stepAnalytics: generateStepAnalytics(),
    userBehavior: generateUserBehavior(),
    geographicData: generateGeographicData(),
    timeRange,
    generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    totalSessions: filteredSessions.length
  };
  return analytics;
});
function generateOverview(sessions) {
  const totalSessions = sessions.length;
  const completedSessions = sessions.filter((s) => {
    var _a;
    return (_a = s.completion) == null ? void 0 : _a.wasCompleted;
  }).length;
  const abandonedSessions = totalSessions - completedSessions;
  const successRate = totalSessions > 0 ? Math.round(completedSessions / totalSessions * 100) : 0;
  return {
    totalSessions,
    completedSessions,
    abandonedSessions,
    successRate
  };
}
function generateDeviceUsage(sessions) {
  const devices = [
    { device: "Openbox GOLD", sessions: Math.floor(Math.random() * 50) + 20, successRate: 89 },
    { device: "Openbox Standard", sessions: Math.floor(Math.random() * 30) + 15, successRate: 92 },
    { device: "HDBOX", sessions: Math.floor(Math.random() * 25) + 10, successRate: 78 },
    { device: "UCLAN", sessions: Math.floor(Math.random() * 15) + 5, successRate: 85 }
  ];
  return devices.sort((a, b) => b.sessions - a.sessions);
}
function generateErrorDistribution(sessions) {
  return [
    { error: "\u041D\u0435\u0442 \u0441\u0438\u0433\u043D\u0430\u043B\u0430", count: Math.floor(Math.random() * 30) + 15, severity: "high" },
    { error: "\u0417\u0430\u043A\u043E\u0434\u0438\u0440\u043E\u0432\u0430\u043D\u043E", count: Math.floor(Math.random() * 25) + 12, severity: "high" },
    { error: "\u041D\u0435\u0442 \u0437\u0432\u0443\u043A\u0430", count: Math.floor(Math.random() * 20) + 8, severity: "medium" },
    { error: "\u041F\u043B\u043E\u0445\u043E\u0435 \u043A\u0430\u0447\u0435\u0441\u0442\u0432\u043E", count: Math.floor(Math.random() * 15) + 5, severity: "medium" },
    { error: "\u041C\u0435\u0434\u043B\u0435\u043D\u043D\u0430\u044F \u0440\u0430\u0431\u043E\u0442\u0430", count: Math.floor(Math.random() * 10) + 3, severity: "low" }
  ].sort((a, b) => b.count - a.count);
}
function generateStepAnalytics(sessions) {
  const steps = [
    "\u041F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u043A\u0430\u0440\u0442\u044B \u0434\u043E\u0441\u0442\u0443\u043F\u0430",
    "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430 \u0430\u043D\u0442\u0435\u043D\u043D\u044B",
    "\u041F\u043E\u0438\u0441\u043A \u043A\u0430\u043D\u0430\u043B\u043E\u0432",
    "\u041F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u0441\u0438\u0433\u043D\u0430\u043B\u0430",
    "\u041F\u0435\u0440\u0435\u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u043A\u0430\u0431\u0435\u043B\u044F",
    "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430 \u0441\u043F\u0443\u0442\u043D\u0438\u043A\u0430",
    "\u041F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u0431\u0430\u043B\u0430\u043D\u0441\u0430",
    "\u041F\u0435\u0440\u0435\u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0430"
  ];
  return steps.map((title, index) => {
    const views = Math.floor(Math.random() * 100) + 20;
    const completions = Math.floor(views * (0.6 + Math.random() * 0.3));
    const stuckUsers = Math.floor(Math.random() * 15);
    const successRate = Math.round(completions / views * 100);
    const avgTimeSpent = `${Math.floor(Math.random() * 5) + 1}\u043C ${Math.floor(Math.random() * 60)}\u0441`;
    return {
      stepId: index + 1,
      stepTitle: title,
      views,
      completions,
      avgTimeSpent,
      stuckUsers,
      successRate
    };
  }).sort((a, b) => a.successRate - b.successRate);
}
function generateUserBehavior(sessions) {
  return {
    averageStepsPerSession: Math.round(Math.random() * 5) + 3,
    mostDifficultStep: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430 \u0430\u043D\u0442\u0435\u043D\u043D\u044B",
    fastestCompletion: "2\u043C 15\u0441",
    operatorInterventions: Math.floor(Math.random() * 20) + 5,
    alternativePathUsage: Math.floor(Math.random() * 15) + 3
  };
}
function generateGeographicData(sessions) {
  return [
    { region: "\u041C\u043E\u0441\u043A\u0432\u0430", sessions: Math.floor(Math.random() * 50) + 30, successRate: 91 },
    { region: "\u0421\u041F\u0431", sessions: Math.floor(Math.random() * 40) + 25, successRate: 88 },
    { region: "\u0415\u043A\u0430\u0442\u0435\u0440\u0438\u043D\u0431\u0443\u0440\u0433", sessions: Math.floor(Math.random() * 30) + 15, successRate: 85 },
    { region: "\u041D\u043E\u0432\u043E\u0441\u0438\u0431\u0438\u0440\u0441\u043A", sessions: Math.floor(Math.random() * 25) + 12, successRate: 83 },
    { region: "\u041A\u0430\u0437\u0430\u043D\u044C", sessions: Math.floor(Math.random() * 20) + 8, successRate: 87 }
  ].sort((a, b) => b.sessions - a.sessions);
}

export { analytics_get as default };
//# sourceMappingURL=analytics.get.mjs.map
