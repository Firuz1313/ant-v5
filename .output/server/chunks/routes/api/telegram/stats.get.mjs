import { d as defineEventHandler, g as getQuery } from '../../../nitro/nitro.mjs';
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

const stats_get = defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const type = query.type || "status";
    const dataPath = path.join(process.cwd(), "data", "user_logs.json");
    let userData = [];
    if (fs.existsSync(dataPath)) {
      const fileContent = fs.readFileSync(dataPath, "utf-8");
      userData = JSON.parse(fileContent);
    }
    switch (type) {
      case "status":
        return await getSystemStatus(userData);
      case "daily":
        return await getDailyStats(userData);
      case "active_users":
        return await getActiveUsers(userData);
      case "stuck_users":
        return await getStuckUsers(userData);
      default:
        throw new Error(`\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u044B\u0439 \u0442\u0438\u043F \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0438: ${type}`);
    }
  } catch (error) {
    console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0438:", error);
    return {
      error: error.message
    };
  }
});
async function getSystemStatus(userData) {
  const now = /* @__PURE__ */ new Date();
  const activeSessions = userData.filter(
    (user) => user.sessionEnd === null && now.getTime() - new Date(user.sessionStart).getTime() < 30 * 60 * 1e3
  );
  const completedSessions = userData.filter((user) => user.sessionEnd !== null);
  const averageDuration = calculateAverageDuration(completedSessions);
  const successRate = calculateSuccessRate(completedSessions);
  const masterRequests = userData.filter(
    (user) => user.events && user.events.some((event) => event.type === "master_request")
  ).length;
  const recentEvents = getRecentEvents(userData, 5);
  return {
    activeSessions: activeSessions.length,
    averageDuration,
    successRate,
    masterRequests,
    recentEvents
  };
}
async function getDailyStats(userData) {
  const now = /* @__PURE__ */ new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayUsers = userData.filter(
    (user) => new Date(user.sessionStart) >= todayStart
  );
  const startedDiagnostics = todayUsers.length;
  const completedSuccessfully = todayUsers.filter(
    (user) => user.sessionEnd && user.completed === true
  ).length;
  const abandoned = todayUsers.filter(
    (user) => user.sessionEnd && user.completed !== true
  ).length;
  const masterRequests = todayUsers.filter(
    (user) => user.events && user.events.some((event) => event.type === "master_request")
  ).length;
  const deviceStats = getDeviceStats(todayUsers);
  const errorStats = getErrorStats(todayUsers);
  return {
    totalUsers: startedDiagnostics,
    startedDiagnostics,
    completedSuccessfully,
    abandoned,
    masterRequests,
    topDevices: deviceStats.slice(0, 5),
    topErrors: errorStats.slice(0, 5)
  };
}
async function getActiveUsers(userData) {
  const now = /* @__PURE__ */ new Date();
  const activeThreshold = 30 * 60 * 1e3;
  return userData.filter(
    (user) => user.sessionEnd === null && now.getTime() - new Date(user.sessionStart).getTime() < activeThreshold
  ).map((user) => {
    const timeOnStep = calculateTimeOnCurrentStep(user);
    const location = user.userAgent ? extractLocationFromUserAgent(user.userAgent) : "\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u043E";
    return {
      sessionId: user.sessionId,
      device: user.device,
      error: user.error,
      currentStep: user.currentStep || 1,
      timeOnStep: formatDuration(timeOnStep || 0),
      location
    };
  });
}
async function getStuckUsers(userData) {
  const stuckThreshold = 2 * 60 * 1e3;
  return userData.filter((user) => {
    if (user.sessionEnd !== null) return false;
    const timeOnStep = calculateTimeOnCurrentStep(user);
    return timeOnStep && timeOnStep > stuckThreshold;
  }).map((user) => {
    const stuckTime = formatDuration(calculateTimeOnCurrentStep(user));
    return {
      sessionId: user.sessionId,
      device: user.device,
      error: user.error,
      stepTitle: user.currentStepTitle || `\u0428\u0430\u0433 ${user.currentStep}`,
      stuckTime
    };
  });
}
function calculateAverageDuration(completedSessions) {
  if (completedSessions.length === 0) return "0 \u043C\u0438\u043D";
  const totalDuration = completedSessions.reduce((sum, user) => {
    const start = new Date(user.sessionStart);
    const end = new Date(user.sessionEnd);
    return sum + (end - start);
  }, 0);
  const avgMilliseconds = totalDuration / completedSessions.length;
  return formatDuration(avgMilliseconds);
}
function calculateSuccessRate(completedSessions) {
  if (completedSessions.length === 0) return 0;
  const successful = completedSessions.filter((user) => user.completed === true).length;
  return Math.round(successful / completedSessions.length * 100);
}
function getRecentEvents(userData, limit = 5) {
  const allEvents = [];
  userData.forEach((user) => {
    if (user.events) {
      user.events.forEach((event) => {
        allEvents.push({
          time: event.timestamp,
          type: event.type,
          description: formatEventDescription(event, user)
        });
      });
    }
  });
  return allEvents.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, limit).map((event) => {
    const time = new Date(event.time).toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit"
    });
    return `${time} - ${event.description}`;
  });
}
function getDeviceStats(users) {
  const deviceCounts = {};
  users.forEach((user) => {
    if (user.device) {
      deviceCounts[user.device] = (deviceCounts[user.device] || 0) + 1;
    }
  });
  return Object.entries(deviceCounts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
}
function getErrorStats(users) {
  const errorCounts = {};
  users.forEach((user) => {
    if (user.error) {
      errorCounts[user.error] = (errorCounts[user.error] || 0) + 1;
    }
  });
  return Object.entries(errorCounts).map(([title, count]) => ({ title, count })).sort((a, b) => b.count - a.count);
}
function calculateTimeOnCurrentStep(user) {
  if (!user.events || user.events.length === 0) return null;
  const stepEvents = user.events.filter((event) => event.type === "step_start");
  if (stepEvents.length === 0) return null;
  const lastStepEvent = stepEvents[stepEvents.length - 1];
  const lastStepTime = new Date(lastStepEvent.timestamp);
  return Date.now() - lastStepTime.getTime();
}
function formatDuration(milliseconds) {
  const minutes = Math.floor(milliseconds / (1e3 * 60));
  const seconds = Math.floor(milliseconds % (1e3 * 60) / 1e3);
  if (minutes > 0) {
    return `${minutes} \u043C\u0438\u043D ${seconds} \u0441\u0435\u043A`;
  } else {
    return `${seconds} \u0441\u0435\u043A`;
  }
}
function extractLocationFromUserAgent(userAgent) {
  if (userAgent.includes("Mobile")) return "\u041C\u043E\u0431\u0438\u043B\u044C\u043D\u043E\u0435 \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u043E";
  if (userAgent.includes("Windows")) return "Windows";
  if (userAgent.includes("Mac")) return "macOS";
  if (userAgent.includes("Linux")) return "Linux";
  return "\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u043E";
}
function formatEventDescription(event, user) {
  var _a;
  switch (event.type) {
    case "session_start":
      return `\u041D\u0430\u0447\u0430\u0442\u0430 \u0434\u0438\u0430\u0433\u043D\u043E\u0441\u0442\u0438\u043A\u0430 ${user.device} - ${user.error}`;
    case "session_end":
      return `\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0430 \u0434\u0438\u0430\u0433\u043D\u043E\u0441\u0442\u0438\u043A\u0430 ${user.device}`;
    case "step_start":
      return `\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u043F\u0435\u0440\u0435\u0448\u0435\u043B \u043A \u0448\u0430\u0433\u0443 ${((_a = event.data) == null ? void 0 : _a.stepNumber) || "\u043D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u043E"}`;
    case "step_complete":
      return `\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u0437\u0430\u0432\u0435\u0440\u0448\u0438\u043B \u0448\u0430\u0433 \u0434\u0438\u0430\u0433\u043D\u043E\u0441\u0442\u0438\u043A\u0438`;
    case "master_request":
      return `\u0421\u043E\u0437\u0434\u0430\u043D\u0430 \u0437\u0430\u044F\u0432\u043A\u0430 \u043D\u0430 \u043C\u0430\uFFFD\uFFFD\u0442\u0435\u0440\u0430 \u0434\u043B\u044F ${user.device}`;
    case "stuck_detected":
      return `\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u0437\u0430\u0441\u0442\u0440\u044F\u043B \u043D\u0430 \u0448\u0430\u0433\u0435 \u0434\u0438\u0430\u0433\u043D\u043E\u0441\u0442\u0438\u043A\u0438 ${user.device}`;
    default:
      return `\u0421\u043E\u0431\u044B\u0442\uFFFD\uFFFD\u0435: ${event.type}`;
  }
}

export { stats_get as default };
//# sourceMappingURL=stats.get.mjs.map
