// User action logging system
export const useUserLogger = () => {
  const userEvents = ref([])
  const sessionId = ref(null)
  const startTime = ref(null)

  // Initialize session
  const initSession = (deviceId, errorId) => {
    sessionId.value = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    startTime.value = Date.now()
    
    logEvent({
      type: 'session_start',
      deviceId,
      errorId,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`
    })
  }

  // Log user events
  const logEvent = (eventData) => {
    const event = {
      id: Date.now() + Math.random(),
      sessionId: sessionId.value,
      timestamp: Date.now(),
      ...eventData
    }
    
    userEvents.value.push(event)
    
    // Store in localStorage for persistence
    const stored = localStorage.getItem('diagnostic_events') || '[]'
    const allEvents = JSON.parse(stored)
    allEvents.push(event)
    localStorage.setItem('diagnostic_events', JSON.stringify(allEvents))
    
    console.log('Event logged:', event)
  }

  // Log step events
  const logStepEvent = (stepId, stepTitle, action, additionalData = {}) => {
    logEvent({
      type: 'step_action',
      stepId,
      stepTitle,
      action, // 'viewed', 'completed', 'skipped', 'failed'
      timeOnStep: additionalData.timeOnStep || null,
      ...additionalData
    })
  }

  // Log button presses
  const logButtonPress = (buttonId, stepId, successful = true) => {
    logEvent({
      type: 'button_press',
      buttonId,
      stepId,
      successful,
      timestamp: Date.now()
    })
  }

  // Log user choices
  const logUserChoice = (choiceType, choice, stepId, context = {}) => {
    logEvent({
      type: 'user_choice',
      choiceType, // 'confirmation', 'option_select', 'navigation'
      choice,
      stepId,
      context
    })
  }

  // Log errors and issues
  const logError = (error, stepId, context = {}) => {
    logEvent({
      type: 'error',
      errorMessage: error.message || error,
      errorStack: error.stack || null,
      stepId,
      context
    })
  }

  // Log completion events
  const logCompletion = (result, finalStepId, totalSteps, totalTime) => {
    logEvent({
      type: 'diagnostic_completion',
      result, // 'success', 'failure', 'abandoned'
      finalStepId,
      totalSteps,
      totalTime,
      completionRate: finalStepId / totalSteps
    })
  }

  // Get session summary
  const getSessionSummary = () => {
    const events = userEvents.value
    const stepEvents = events.filter(e => e.type === 'step_action')
    const buttonEvents = events.filter(e => e.type === 'button_press')
    const choiceEvents = events.filter(e => e.type === 'user_choice')
    
    return {
      sessionId: sessionId.value,
      startTime: startTime.value,
      duration: Date.now() - (startTime.value || Date.now()),
      totalEvents: events.length,
      stepsViewed: stepEvents.filter(e => e.action === 'viewed').length,
      stepsCompleted: stepEvents.filter(e => e.action === 'completed').length,
      buttonPresses: buttonEvents.length,
      successfulButtonPresses: buttonEvents.filter(e => e.successful).length,
      userChoices: choiceEvents.length,
      lastActivity: Math.max(...events.map(e => e.timestamp))
    }
  }

  // Export session data
  const exportSessionData = (format = 'json') => {
    const summary = getSessionSummary()
    const data = {
      summary,
      events: userEvents.value
    }
    
    if (format === 'json') {
      return JSON.stringify(data, null, 2)
    } else if (format === 'csv') {
      return convertToCSV(userEvents.value)
    }
    
    return data
  }

  // Convert events to CSV
  const convertToCSV = (events) => {
    if (events.length === 0) return ''
    
    const headers = ['timestamp', 'type', 'stepId', 'action', 'buttonId', 'choice', 'successful']
    const rows = events.map(event => [
      new Date(event.timestamp).toISOString(),
      event.type,
      event.stepId || '',
      event.action || '',
      event.buttonId || '',
      event.choice || '',
      event.successful !== undefined ? event.successful : ''
    ])
    
    return [headers, ...rows].map(row => row.join(',')).join('\n')
  }

  // Download session report
  const downloadReport = (format = 'json') => {
    const data = exportSessionData(format)
    const blob = new Blob([data], { 
      type: format === 'json' ? 'application/json' : 'text/csv' 
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `diagnostic_report_${sessionId.value}.${format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Send analytics to server
  const sendAnalytics = async () => {
    if (userEvents.value.length === 0) return
    
    try {
      await $fetch('/api/analytics', {
        method: 'POST',
        body: {
          sessionId: sessionId.value,
          events: userEvents.value,
          summary: getSessionSummary()
        }
      })
      console.log('Analytics sent successfully')
    } catch (error) {
      console.error('Failed to send analytics:', error)
    }
  }

  // Get stuck points analysis
  const getStuckAnalysis = () => {
    const stepEvents = userEvents.value.filter(e => e.type === 'step_action')
    const stuckSteps = []
    
    stepEvents.forEach(event => {
      if (event.timeOnStep && event.timeOnStep > 60000) { // More than 1 minute
        stuckSteps.push({
          stepId: event.stepId,
          stepTitle: event.stepTitle,
          timeSpent: event.timeOnStep,
          timestamp: event.timestamp
        })
      }
    })
    
    return stuckSteps
  }

  // Clean up old events
  const cleanupOldEvents = (daysToKeep = 7) => {
    const cutoffTime = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000)
    const stored = localStorage.getItem('diagnostic_events') || '[]'
    const allEvents = JSON.parse(stored)
    const filteredEvents = allEvents.filter(event => event.timestamp > cutoffTime)
    localStorage.setItem('diagnostic_events', JSON.stringify(filteredEvents))
  }

  return {
    userEvents: readonly(userEvents),
    sessionId: readonly(sessionId),
    initSession,
    logEvent,
    logStepEvent,
    logButtonPress,
    logUserChoice,
    logError,
    logCompletion,
    getSessionSummary,
    exportSessionData,
    downloadReport,
    sendAnalytics,
    getStuckAnalysis,
    cleanupOldEvents
  }
}
