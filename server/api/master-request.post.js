// Master service request API endpoint
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  try {
    // Generate unique request ID
    const requestId = `REQ_${Date.now()}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    
    // Process master request
    const masterRequest = {
      id: requestId,
      timestamp: Date.now(),
      deviceInfo: body.deviceInfo || {},
      errorInfo: body.errorInfo || {},
      diagnosticPath: body.diagnosticPath || [],
      userContact: body.userContact || {},
      priority: determinePriority(body),
      status: 'pending',
      estimatedArrival: calculateEstimatedArrival()
    }
    
    // In production, this would:
    // 1. Save to database
    // 2. Send notification to master dispatch system
    // 3. Send confirmation SMS/email to user
    // 4. Create ticket in support system
    
    console.log('Master request created:', masterRequest)
    
    // Simulate notification sending
    await sendMasterNotification(masterRequest)
    
    return {
      success: true,
      requestId,
      message: 'Заявка на вызов мастера принята',
      estimatedArrival: masterRequest.estimatedArrival,
      trackingUrl: `/track/${requestId}`
    }
  } catch (error) {
    console.error('Master request error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Не удалось создать заявку на вызов мастера'
    })
  }
})

function determinePriority(requestData) {
  // Determine priority based on error type and diagnostic results
  const { errorInfo, diagnosticPath } = requestData
  
  if (errorInfo.severity === 'high') return 'high'
  if (diagnosticPath.length > 5) return 'medium' // Many failed steps
  
  return 'normal'
}

function calculateEstimatedArrival() {
  // Simple estimation - in production would use real scheduling data
  const now = new Date()
  const businessHours = isBusinessHours(now)
  
  if (businessHours) {
    // 2-4 hours during business hours
    return new Date(now.getTime() + (2 + Math.random() * 2) * 60 * 60 * 1000)
  } else {
    // Next business day
    const nextDay = new Date(now)
    nextDay.setDate(nextDay.getDate() + 1)
    nextDay.setHours(9, 0, 0, 0) // 9 AM next day
    return nextDay
  }
}

function isBusinessHours(date) {
  const hour = date.getHours()
  const day = date.getDay()
  
  // Monday-Friday, 8 AM - 6 PM
  return day >= 1 && day <= 5 && hour >= 8 && hour < 18
}

async function sendMasterNotification(request) {
  // Simulate sending notifications
  console.log('Sending master notification:', {
    requestId: request.id,
    priority: request.priority,
    estimatedArrival: request.estimatedArrival
  })
  
  // In production, this would:
  // - Send to master dispatch system
  // - Send SMS/email to user
  // - Create calendar event
  // - Send to Telegram bot if configured
}
