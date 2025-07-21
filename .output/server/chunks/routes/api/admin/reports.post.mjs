import { d as defineEventHandler, r as readBody, c as createError } from '../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const reports_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { type, format, filters, timeRange } = body;
  try {
    let reportData;
    switch (type) {
      case "user_actions":
        reportData = await generateUserActionsReport(filters, timeRange);
        break;
      case "step_performance":
        reportData = await generateStepPerformanceReport(filters, timeRange);
        break;
      case "device_analytics":
        reportData = await generateDeviceAnalyticsReport(filters, timeRange);
        break;
      case "error_analysis":
        reportData = await generateErrorAnalysisReport(filters, timeRange);
        break;
      case "operator_metrics":
        reportData = await generateOperatorMetricsReport(filters, timeRange);
        break;
      default:
        throw new Error("Invalid report type");
    }
    const formattedReport = formatReport(reportData, format);
    return {
      success: true,
      reportType: type,
      format,
      generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      timeRange,
      filters,
      data: formattedReport
    };
  } catch (error) {
    console.error("Report generation error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to generate ${type} report: ${error.message}`
    });
  }
});
async function generateUserActionsReport(filters, timeRange) {
  const userActions = [
    {
      sessionId: "sess_123456789",
      userId: "user_001",
      device: "Openbox GOLD",
      error: "\u0417\u0430\u043A\u043E\u0434\u0438\u0440\u043E\u0432\u0430\u043D\u043E",
      startTime: "2024-01-15T10:00:00Z",
      endTime: "2024-01-15T10:12:30Z",
      duration: "12 \u043C\u0438\u043D 30 \u0441\u0435\u043A",
      totalSteps: 5,
      completedSteps: 5,
      stepsDetails: [
        {
          stepId: 1,
          stepTitle: "\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u0431\u0430\u043B\u0430\u043D\u0441",
          startTime: "2024-01-15T10:00:00Z",
          endTime: "2024-01-15T10:01:30Z",
          duration: "1 \u043C\u0438\u043D 30 \u0441\u0435\u043A",
          buttonPresses: ["menu", "ok"],
          result: "completed"
        },
        {
          stepId: 2,
          stepTitle: "\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u043A\u0430\u0440\u0442\u0443 \u0434\u043E\u0441\u0442\u0443\u043F\u0430",
          startTime: "2024-01-15T10:01:30Z",
          endTime: "2024-01-15T10:05:45Z",
          duration: "4 \u043C\u0438\u043D 15 \u0441\u0435\u043A",
          buttonPresses: ["menu", "down", "down", "ok", "exit"],
          userChoice: "\u0414\u0430, \u043A\u0430\u0440\u0442\u0430 \u0432\u0438\u0434\u043D\u0430",
          result: "completed"
        },
        {
          stepId: 3,
          stepTitle: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430 \u0430\u043D\u0442\u0435\u043D\u043D\u044B",
          startTime: "2024-01-15T10:05:45Z",
          endTime: "2024-01-15T10:10:15Z",
          duration: "4 \u043C\u0438\u043D 30 \u0441\u0435\u043A",
          buttonPresses: ["exit", "menu", "down", "ok", "up", "ok"],
          validation: { satellite: "correct", frequency: "correct" },
          result: "completed"
        }
      ],
      totalButtonPresses: 12,
      userChoices: 3,
      alternativePathsUsed: 0,
      operatorAssistance: false,
      result: "success",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      ipAddress: "192.168.1.100",
      location: "\u041C\u043E\u0441\u043A\u0432\u0430"
    },
    {
      sessionId: "sess_987654321",
      userId: "user_002",
      device: "HDBOX",
      error: "\u041D\u0435\u0442 \u0441\u0438\u0433\u043D\u0430\u043B\u0430",
      startTime: "2024-01-15T14:30:00Z",
      endTime: "2024-01-15T14:35:20Z",
      duration: "5 \u043C\u0438\u043D 20 \u0441\u0435\u043A",
      totalSteps: 3,
      completedSteps: 2,
      stepsDetails: [
        {
          stepId: 5,
          stepTitle: "\u041F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u0438\u0441\u0442\u043E\u0447\u043D\u0438\u043A\u0430 \u0422\u0412",
          startTime: "2024-01-15T14:30:00Z",
          endTime: "2024-01-15T14:32:10Z",
          duration: "2 \u043C\u0438\u043D 10 \u0441\u0435\u043A",
          buttonPresses: [],
          userChoice: "\u041D\u0435\u0442, \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u043D\u0435 \u043F\u043E\u044F\u0432\u0438\u043B\u043E\u0441\u044C",
          result: "completed"
        },
        {
          stepId: 6,
          stepTitle: "\u041F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u043A\u0430\u0447\u0435\u0441\u0442\u0432\u0430 \u0441\u0438\u0433\u043D\u0430\u043B\u0430",
          startTime: "2024-01-15T14:32:10Z",
          endTime: "2024-01-15T14:35:20Z",
          duration: "3 \u043C\u0438\u043D 10 \u0441\u0435\u043A",
          buttonPresses: ["info", "info", "info"],
          result: "abandoned"
        }
      ],
      totalButtonPresses: 3,
      userChoices: 1,
      alternativePathsUsed: 1,
      operatorAssistance: false,
      result: "abandoned",
      abandonmentReason: "User stuck on signal check",
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)",
      ipAddress: "192.168.1.200",
      location: "\u0421\u041F\u0431"
    }
  ];
  return {
    totalSessions: userActions.length,
    successfulSessions: userActions.filter((s) => s.result === "success").length,
    abandonedSessions: userActions.filter((s) => s.result === "abandoned").length,
    averageDuration: "8 \u043C\u0438\u043D 55 \u0441\u0435\u043A",
    averageStepsCompleted: 3.5,
    sessions: userActions,
    summary: {
      totalButtonPresses: userActions.reduce((sum, s) => sum + s.totalButtonPresses, 0),
      totalUserChoices: userActions.reduce((sum, s) => sum + s.userChoices, 0),
      operatorAssistanceCases: userActions.filter((s) => s.operatorAssistance).length,
      alternativePathUsage: userActions.reduce((sum, s) => sum + s.alternativePathsUsed, 0)
    }
  };
}
async function generateStepPerformanceReport(filters, timeRange) {
  return {
    totalSteps: 10,
    stepsAnalyzed: 10,
    overallSuccessRate: 82.5,
    steps: [
      {
        stepId: 1,
        stepTitle: "\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u0431\u0430\u043B\u0430\u043D\u0441 \u0432 \u043B\u0438\u0447\u043D\u043E\u043C \u043A\u0430\u0431\u0438\u043D\u0435\u0442\u0435",
        device: "Openbox GOLD",
        error: "\u0417\u0430\u043A\u043E\u0434\u0438\u0440\u043E\u0432\u0430\u043D\u043E",
        totalViews: 150,
        completions: 140,
        abandonments: 10,
        averageTime: "1 \u043C\u0438\u043D 30 \u0441\u0435\u043A",
        successRate: 93.3,
        stuckUsers: 5,
        commonIssues: ["\u041D\u0435 \u043C\u043E\u0433\u0443\u0442 \u043D\u0430\u0439\u0442\u0438 \u0441\u0441\u044B\u043B\u043A\u0443 \u043D\u0430 \u043A\u0430\u0431\u0438\u043D\u0435\u0442"],
        buttonPressAccuracy: 95,
        userFeedback: 4.5
      },
      {
        stepId: 2,
        stepTitle: "\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u043A\u0430\u0440\u0442\u0443 \u0434\u043E\u0441\u0442\u0443\u043F\u0430",
        device: "Openbox GOLD",
        error: "\u0417\u0430\u043A\u043E\u0434\u0438\u0440\u043E\u0432\u0430\u043D\u043E",
        totalViews: 140,
        completions: 115,
        abandonments: 25,
        averageTime: "4 \u043C\u0438\u043D 15 \u0441\u0435\u043A",
        successRate: 82.1,
        stuckUsers: 18,
        commonIssues: ["\u041A\u0430\u0440\u0442\u0430 \u043D\u0435 \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u0435\u0442\u0441\u044F", "\u041D\u0435 \u043F\u043E\u043D\u0438\u043C\u0430\u044E\u0442 \u043A\u0430\u043A \u0432\u044B\u0442\u0430\u0449\u0438\u0442\u044C \u043A\u0430\u0440\u0442\u0443"],
        buttonPressAccuracy: 78,
        userFeedback: 3.8
      },
      {
        stepId: 3,
        stepTitle: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430 \u0430\u043D\u0442\u0435\u043D\u043D\u044B",
        device: "Openbox GOLD",
        error: "\u0417\u0430\u043A\u043E\u0434\u0438\u0440\u043E\u0432\u0430\u043D\u043E",
        totalViews: 115,
        completions: 85,
        abandonments: 30,
        averageTime: "6 \u043C\u0438\u043D 45 \u0441\u0435\u043A",
        successRate: 73.9,
        stuckUsers: 25,
        commonIssues: ["\u0421\u043B\u043E\u0436\u043D\u044B\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438", "\u041D\u0435 \u043D\u0430\u0445\u043E\u0434\u044F\u0442 \u043D\u0443\u0436\u043D\u044B\u0439 \u043F\u0443\u043D\u043A\u0442 \u043C\u0435\u043D\u044E"],
        buttonPressAccuracy: 65,
        userFeedback: 3.2
      }
    ]
  };
}
async function generateDeviceAnalyticsReport(filters, timeRange) {
  return {
    totalDevices: 4,
    devicesAnalyzed: 4,
    devices: [
      {
        deviceId: 4,
        deviceName: "Openbox GOLD",
        totalSessions: 120,
        successfulSessions: 102,
        successRate: 85,
        averageDuration: "10 \u043C\u0438\u043D 30 \u0441\u0435\u043A",
        mostCommonErrors: [
          { error: "\u0417\u0430\u043A\u043E\u0434\u0438\u0440\u043E\u0432\u0430\u043D\u043E", count: 65, successRate: 88 },
          { error: "\u041D\u0435\u0442 \u0441\u0438\u0433\u043D\u0430\u043B\u0430", count: 35, successRate: 82 },
          { error: "\u041D\u0435\u0442 \u0437\u0432\u0443\u043A\u0430", count: 20, successRate: 90 }
        ],
        userSatisfaction: 4.3,
        operatorEscalation: 8
      },
      {
        deviceId: 1,
        deviceName: "Openbox",
        totalSessions: 80,
        successfulSessions: 68,
        successRate: 85,
        averageDuration: "7 \u043C\u0438\u043D 15 \u0441\u0435\u043A",
        mostCommonErrors: [
          { error: "\u041D\u0435\u0442 \u0441\u0438\u0433\u043D\u0430\u043B\u0430", count: 40, successRate: 85 },
          { error: "\u041D\u0435\u0442 \u0437\u0432\u0443\u043A\u0430", count: 25, successRate: 88 },
          { error: "\u041D\u0435 \u0432\u043A\u043B\u044E\u0447\u0430\u0435\u0442\u0441\u044F", count: 15, successRate: 80 }
        ],
        userSatisfaction: 4.1,
        operatorEscalation: 5
      }
    ]
  };
}
async function generateErrorAnalysisReport(filters, timeRange) {
  return {
    totalErrors: 12,
    errorsAnalyzed: 12,
    errors: [
      {
        errorId: 9,
        errorTitle: "\u0417\u0430\u043A\u043E\u0434\u0438\u0440\u043E\u0432\u0430\u043D\u043E",
        device: "Openbox GOLD",
        totalOccurrences: 85,
        resolved: 72,
        resolutionRate: 84.7,
        averageResolutionTime: "12 \u043C\u0438\u043D 45 \u0441\u0435\u043A",
        escalatedToMaster: 13,
        severity: "high",
        seasonality: "\u041F\u0438\u043A \u0432 \u0432\u044B\u0445\u043E\u0434\u043D\u044B\u0435 \u0434\u043D\u0438",
        commonSolutions: [
          { solution: "\u041F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u0431\u0430\u043B\u0430\u043D\u0441\u0430", successRate: 95 },
          { solution: "\u041F\u0435\u0440\u0435\u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0430 \u043A\u0430\u0440\u0442\u044B", successRate: 78 },
          { solution: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430 \u0430\u043D\u0442\u0435\u043D\u043D\u044B", successRate: 65 }
        ]
      },
      {
        errorId: 10,
        errorTitle: "\u041D\u0435\u0442 \u0441\u0438\u0433\u043D\u0430\u043B\u0430",
        device: "All devices",
        totalOccurrences: 125,
        resolved: 98,
        resolutionRate: 78.4,
        averageResolutionTime: "8 \u043C\u0438\u043D 20 \u0441\u0435\u043A",
        escalatedToMaster: 27,
        severity: "high",
        seasonality: "\u0423\u0432\u0435\u043B\u0438\u0447\u0435\u043D\u0438\u0435 \u0432 \u043F\u043B\u043E\u0445\u0443\u044E \u043F\u043E\u0433\u043E\u0434\u0443",
        commonSolutions: [
          { solution: "\u041F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u0432\u0445\u043E\u0434\u0430 \u0422\u0412", successRate: 90 },
          { solution: "\u041F\u0435\u0440\u0435\u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u043A\u0430\u0431\u0435\u043B\u044F", successRate: 75 },
          { solution: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430 \u0430\u043D\u0442\u0435\u043D\u043D\u044B", successRate: 60 }
        ]
      }
    ]
  };
}
async function generateOperatorMetricsReport(filters, timeRange) {
  return {
    totalOperatorSessions: 45,
    operatorOnlyStepsUsed: 78,
    averageOperatorSessionDuration: "15 \u043C\u0438\u043D 30 \u0441\u0435\u043A",
    operatorSuccessRate: 94.5,
    operators: [
      {
        operatorId: "op_001",
        operatorName: "\u0418\u0432\u0430\u043D \u041F\u0435\u0442\u0440\u043E\u0432",
        totalSessions: 25,
        successfulSessions: 24,
        successRate: 96,
        averageSessionTime: "14 \u043C\u0438\u043D 20 \u0441\u0435\u043A",
        specializations: ["Openbox GOLD", "\u0421\u043B\u043E\u0436\u043D\u044B\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438"],
        userRating: 4.8
      },
      {
        operatorId: "op_002",
        operatorName: "\u041C\u0430\u0440\u0438\u044F \u0421\u0438\u0434\u043E\u0440\u043E\u0432\u0430",
        totalSessions: 20,
        successfulSessions: 19,
        successRate: 95,
        averageSessionTime: "16 \u043C\u0438\u043D 45 \u0441\u0435\u043A",
        specializations: ["HDBOX", "\u0414\u0438\u0430\u0433\u043D\u043E\u0441\u0442\u0438\u043A\u0430 \u0441\u0438\u0433\u043D\u0430\u043B\u0430"],
        userRating: 4.6
      }
    ]
  };
}
function formatReport(data, format) {
  switch (format) {
    case "json":
      return data;
    case "csv":
      return convertToCSV(data);
    case "excel":
      return convertToExcel(data);
    default:
      return data;
  }
}
function convertToCSV(data) {
  if (data.sessions) {
    const headers = ["Session ID", "Device", "Error", "Start Time", "Duration", "Result", "Steps Completed", "Button Presses"];
    const rows = data.sessions.map((session) => [
      session.sessionId,
      session.device,
      session.error,
      session.startTime,
      session.duration,
      session.result,
      session.completedSteps,
      session.totalButtonPresses
    ]);
    return [headers, ...rows].map((row) => row.join(",")).join("\n");
  }
  return JSON.stringify(data, null, 2);
}
function convertToExcel(data) {
  return {
    format: "excel",
    note: "Excel format would be implemented with ExcelJS library",
    data
  };
}

export { reports_post as default };
//# sourceMappingURL=reports.post.mjs.map
