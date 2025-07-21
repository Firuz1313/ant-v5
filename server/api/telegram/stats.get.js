import fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const type = query.type || 'status'

    // Путь к файлу с данными пользователей
    const dataPath = path.join(process.cwd(), 'data', 'user_logs.json')
    
    let userData = []
    if (fs.existsSync(dataPath)) {
      const fileContent = fs.readFileSync(dataPath, 'utf-8')
      userData = JSON.parse(fileContent)
    }

    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    switch (type) {
      case 'status':
        return await getSystemStatus(userData)
      
      case 'daily':
        return await getDailyStats(userData, todayStart)
      
      case 'active_users':
        return await getActiveUsers(userData)
      
      case 'stuck_users':
        return await getStuckUsers(userData)
      
      default:
        throw new Error(`Неизвестный тип статистики: ${type}`)
    }
  } catch (error) {
    console.error('Ошибка получения статистики:', error)
    
    return {
      error: error.message
    }
  }
})

async function getSystemStatus(userData) {
  const activeSessions = userData.filter(user => 
    user.sessionEnd === null && 
    (Date.now() - new Date(user.sessionStart).getTime()) < 30 * 60 * 1000 // Активность в последние 30 минут
  )

  const completedSessions = userData.filter(user => user.sessionEnd !== null)
  const averageDuration = calculateAverageDuration(completedSessions)
  const successRate = calculateSuccessRate(completedSessions)
  
  const masterRequests = userData.filter(user => 
    user.events && user.events.some(event => event.type === 'master_request')
  ).length

  const recentEvents = getRecentEvents(userData, 5)

  return {
    activeSessions: activeSessions.length,
    averageDuration,
    successRate,
    masterRequests,
    recentEvents
  }
}

async function getDailyStats(userData, todayStart) {
  const todayUsers = userData.filter(user => 
    new Date(user.sessionStart) >= todayStart
  )

  const startedDiagnostics = todayUsers.length
  const completedSuccessfully = todayUsers.filter(user => 
    user.sessionEnd && user.completed === true
  ).length
  const abandoned = todayUsers.filter(user => 
    user.sessionEnd && user.completed !== true
  ).length

  const masterRequests = todayUsers.filter(user => 
    user.events && user.events.some(event => event.type === 'master_request')
  ).length

  const deviceStats = getDeviceStats(todayUsers)
  const errorStats = getErrorStats(todayUsers)

  return {
    totalUsers: startedDiagnostics,
    startedDiagnostics,
    completedSuccessfully,
    abandoned,
    masterRequests,
    topDevices: deviceStats.slice(0, 5),
    topErrors: errorStats.slice(0, 5)
  }
}

async function getActiveUsers(userData) {
  const now = new Date()
  const activeThreshold = 30 * 60 * 1000 // 30 минут

  return userData
    .filter(user => 
      user.sessionEnd === null && 
      (now.getTime() - new Date(user.sessionStart).getTime()) < activeThreshold
    )
    .map(user => {
      const timeOnStep = calculateTimeOnCurrentStep(user)
      const location = user.userAgent ? extractLocationFromUserAgent(user.userAgent) : 'Неизвестно'
      
      return {
        sessionId: user.sessionId,
        device: user.device,
        error: user.error,
        currentStep: user.currentStep || 1,
        timeOnStep,
        location
      }
    })
}

async function getStuckUsers(userData) {
  const now = new Date()
  const stuckThreshold = 2 * 60 * 1000 // 2 минуты на одном шаге
  
  return userData
    .filter(user => {
      if (user.sessionEnd !== null) return false
      
      const timeOnStep = calculateTimeOnCurrentStep(user)
      return timeOnStep && timeOnStep > stuckThreshold
    })
    .map(user => {
      const stuckTime = formatDuration(calculateTimeOnCurrentStep(user))
      
      return {
        sessionId: user.sessionId,
        device: user.device,
        error: user.error,
        stepTitle: user.currentStepTitle || `Шаг ${user.currentStep}`,
        stuckTime
      }
    })
}

function calculateAverageDuration(completedSessions) {
  if (completedSessions.length === 0) return '0 мин'
  
  const totalDuration = completedSessions.reduce((sum, user) => {
    const start = new Date(user.sessionStart)
    const end = new Date(user.sessionEnd)
    return sum + (end - start)
  }, 0)
  
  const avgMilliseconds = totalDuration / completedSessions.length
  return formatDuration(avgMilliseconds)
}

function calculateSuccessRate(completedSessions) {
  if (completedSessions.length === 0) return 0
  
  const successful = completedSessions.filter(user => user.completed === true).length
  return Math.round((successful / completedSessions.length) * 100)
}

function getRecentEvents(userData, limit = 5) {
  const allEvents = []
  
  userData.forEach(user => {
    if (user.events) {
      user.events.forEach(event => {
        allEvents.push({
          time: event.timestamp,
          type: event.type,
          description: formatEventDescription(event, user)
        })
      })
    }
  })
  
  return allEvents
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, limit)
    .map(event => {
      const time = new Date(event.time).toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
      })
      return `${time} - ${event.description}`
    })
}

function getDeviceStats(users) {
  const deviceCounts = {}
  
  users.forEach(user => {
    if (user.device) {
      deviceCounts[user.device] = (deviceCounts[user.device] || 0) + 1
    }
  })
  
  return Object.entries(deviceCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}

function getErrorStats(users) {
  const errorCounts = {}
  
  users.forEach(user => {
    if (user.error) {
      errorCounts[user.error] = (errorCounts[user.error] || 0) + 1
    }
  })
  
  return Object.entries(errorCounts)
    .map(([title, count]) => ({ title, count }))
    .sort((a, b) => b.count - a.count)
}

function calculateTimeOnCurrentStep(user) {
  if (!user.events || user.events.length === 0) return null
  
  const stepEvents = user.events.filter(event => event.type === 'step_start')
  if (stepEvents.length === 0) return null
  
  const lastStepEvent = stepEvents[stepEvents.length - 1]
  const lastStepTime = new Date(lastStepEvent.timestamp)
  
  return Date.now() - lastStepTime.getTime()
}

function formatDuration(milliseconds) {
  const minutes = Math.floor(milliseconds / (1000 * 60))
  const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000)
  
  if (minutes > 0) {
    return `${minutes} мин ${seconds} сек`
  } else {
    return `${seconds} сек`
  }
}

function extractLocationFromUserAgent(userAgent) {
  // Простая экстракция локации из user agent
  // В реальном проекте можно использовать GeoIP
  if (userAgent.includes('Mobile')) return 'Моби��ьное устройство'
  if (userAgent.includes('Windows')) return 'Windows'
  if (userAgent.includes('Mac')) return 'macOS'
  if (userAgent.includes('Linux')) return 'Linux'
  return 'Неизвестно'
}

function formatEventDescription(event, user) {
  switch (event.type) {
    case 'session_start':
      return `Начата диагностика ${user.device} - ${user.error}`
    case 'session_end':
      return `Завершена диагностика ${user.device}`
    case 'step_start':
      return `Пользователь перешел к шагу ${event.data?.stepNumber || 'неизвестно'}`
    case 'step_complete':
      return `Пользователь завершил шаг диагностики`
    case 'master_request':
      return `Создана заявка на мастера для ${user.device}`
    case 'stuck_detected':
      return `Пользователь застрял на шаге диагностики ${user.device}`
    default:
      return `Событие: ${event.type}`
  }
}
