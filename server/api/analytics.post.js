// Analytics API endpoint for user action logging
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  try {
    // In production, this would save to database
    console.log('Analytics received:', {
      sessionId: body.sessionId,
      eventsCount: body.events?.length || 0,
      summary: body.summary
    })
    
    // Process analytics data
    const analytics = processAnalytics(body)
    
    // Here you would typically save to database
    // await saveAnalytics(analytics)
    
    return {
      success: true,
      sessionId: body.sessionId,
      processed: analytics
    }
  } catch (error) {
    console.error('Analytics processing error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to process analytics'
    })
  }
})

function processAnalytics(data) {
  const { events, summary } = data
  
  // Analyze user behavior patterns
  const behaviorPatterns = {
    averageTimePerStep: calculateAverageTimePerStep(events),
    mostDifficultSteps: findDifficultSteps(events),
    buttonPressAccuracy: calculateButtonAccuracy(events),
    completionPath: extractCompletionPath(events),
    userStuckPoints: findStuckPoints(events)
  }
  
  // Analyze completion rates
  const completionAnalysis = {
    completed: summary.stepsCompleted,
    total: summary.stepsViewed,
    completionRate: summary.stepsCompleted / summary.stepsViewed,
    abandonmentPoint: findAbandonmentPoint(events)
  }
  
  return {
    sessionId: data.sessionId,
    timestamp: Date.now(),
    behaviorPatterns,
    completionAnalysis,
    summary,
    flags: generateFlags(behaviorPatterns, completionAnalysis)
  }
}

function calculateAverageTimePerStep(events) {
  const stepTimes = events
    .filter(e => e.type === 'step_action' && e.timeOnStep)
    .map(e => e.timeOnStep)
  
  return stepTimes.length > 0 
    ? stepTimes.reduce((a, b) => a + b, 0) / stepTimes.length 
    : 0
}

function findDifficultSteps(events) {
  const stepData = {}
  
  events.forEach(event => {
    if (event.type === 'step_action' && event.stepId) {
      if (!stepData[event.stepId]) {
        stepData[event.stepId] = {
          stepId: event.stepId,
          stepTitle: event.stepTitle,
          views: 0,
          completions: 0,
          totalTime: 0,
          failures: 0
        }
      }
      
      const step = stepData[event.stepId]
      
      if (event.action === 'viewed') step.views++
      if (event.action === 'completed') step.completions++
      if (event.action === 'failed') step.failures++
      if (event.timeOnStep) step.totalTime += event.timeOnStep
    }
  })
  
  return Object.values(stepData)
    .map(step => ({
      ...step,
      avgTime: step.views > 0 ? step.totalTime / step.views : 0,
      completionRate: step.views > 0 ? step.completions / step.views : 0,
      failureRate: step.views > 0 ? step.failures / step.views : 0
    }))
    .sort((a, b) => a.completionRate - b.completionRate) // Least completed first
}

function calculateButtonAccuracy(events) {
  const buttonEvents = events.filter(e => e.type === 'button_press')
  const successful = buttonEvents.filter(e => e.successful).length
  
  return buttonEvents.length > 0 ? successful / buttonEvents.length : 1
}

function extractCompletionPath(events) {
  return events
    .filter(e => e.type === 'step_action' && e.action === 'viewed')
    .map(e => ({
      stepId: e.stepId,
      stepTitle: e.stepTitle,
      timestamp: e.timestamp
    }))
}

function findStuckPoints(events) {
  return events
    .filter(e => e.type === 'step_action' && e.timeOnStep > 120000) // 2+ minutes
    .map(e => ({
      stepId: e.stepId,
      stepTitle: e.stepTitle,
      timeSpent: e.timeOnStep,
      timestamp: e.timestamp
    }))
}

function findAbandonmentPoint(events) {
  const stepEvents = events.filter(e => e.type === 'step_action' && e.action === 'viewed')
  return stepEvents.length > 0 ? stepEvents[stepEvents.length - 1].stepId : null
}

function generateFlags(behaviorPatterns, completionAnalysis) {
  const flags = []
  
  if (completionAnalysis.completionRate < 0.5) {
    flags.push('low_completion_rate')
  }
  
  if (behaviorPatterns.buttonPressAccuracy < 0.7) {
    flags.push('high_button_error_rate')
  }
  
  if (behaviorPatterns.averageTimePerStep > 180000) { // 3+ minutes average
    flags.push('slow_progression')
  }
  
  if (behaviorPatterns.userStuckPoints.length > 2) {
    flags.push('multiple_stuck_points')
  }
  
  return flags
}
