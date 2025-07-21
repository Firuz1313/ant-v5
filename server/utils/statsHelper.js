const fs = require('fs')
const path = require('path')

class StatsHelper {
  constructor() {
    this.dataPath = path.join(process.cwd(), 'data', 'user_logs.json')
  }

  getUserData() {
    try {
      if (fs.existsSync(this.dataPath)) {
        const fileContent = fs.readFileSync(this.dataPath, 'utf-8')
        return JSON.parse(fileContent)
      }
      return []
    } catch (error) {
      console.error('Error reading user data:', error)
      return []
    }
  }

  async getSystemStatus() {
    const userData = this.getUserData()
    const now = new Date()
    
    const activeSessions = userData.filter(user => 
      user.sessionEnd === null && 
      (now.getTime() - new Date(user.sessionStart).getTime()) < 30 * 60 * 1000 // Активность в последние 30 минут
    )

    const completedSessions = userData.filter(user => user.sessionEnd !== null)
    const averageDuration = this.calculateAverageDuration(completedSessions)
    const successRate = this.calculateSuccessRate(completedSessions)
    
    const masterRequests = userData.filter(user => 
      user.events && user.events.some(event => event.type === 'master_request')
    ).length

    const recentEvents = this.getRecentEvents(userData, 5)

    return {
      activeSessions: activeSessions.length,
      averageDuration,
      successRate,
      masterRequests,
      recentEvents
    }
  }

  async getDailyStats() {
    const userData = this.getUserData()
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

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

    const deviceStats = this.getDeviceStats(todayUsers)
    const errorStats = this.getErrorStats(todayUsers)

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

  async getActiveUsers() {
    const userData = this.getUserData()
    const now = new Date()
    const activeThreshold = 30 * 60 * 1000 // 30 минут

    return userData
      .filter(user => 
        user.sessionEnd === null && 
        (now.getTime() - new Date(user.sessionStart).getTime()) < activeThreshold
      )
      .map(user => {
        const timeOnStep = this.calculateTimeOnCurrentStep(user)
        const location = user.userAgent ? this.extractLocationFromUserAgent(user.userAgent) : 'Неизвестно'
        
        return {
          sessionId: user.sessionId,
          device: user.device,
          error: user.error,
          currentStep: user.currentStep || 1,
          timeOnStep: this.formatDuration(timeOnStep || 0),
          location
        }
      })
  }

  async getStuckUsers() {
    const userData = this.getUserData()
    const now = new Date()
    const stuckThreshold = 2 * 60 * 1000 // 2 минуты на одном шаге
    
    return userData
      .filter(user => {
        if (user.sessionEnd !== null) return false
        
        const timeOnStep = this.calculateTimeOnCurrentStep(user)
        return timeOnStep && timeOnStep > stuckThreshold
      })
      .map(user => {
        const stuckTime = this.formatDuration(this.calculateTimeOnCurrentStep(user))
        
        return {
          sessionId: user.sessionId,
          device: user.device,
          error: user.error,
          stepTitle: user.currentStepTitle || `Шаг ${user.currentStep}`,
          stuckTime
        }
      })
  }

  calculateAverageDuration(completedSessions) {
    if (completedSessions.length === 0) return '0 мин'
    
    const totalDuration = completedSessions.reduce((sum, user) => {
      const start = new Date(user.sessionStart)
      const end = new Date(user.sessionEnd)
      return sum + (end - start)
    }, 0)
    
    const avgMilliseconds = totalDuration / completedSessions.length
    return this.formatDuration(avgMilliseconds)
  }

  calculateSuccessRate(completedSessions) {
    if (completedSessions.length === 0) return 0
    
    const successful = completedSessions.filter(user => user.completed === true).length
    return Math.round((successful / completedSessions.length) * 100)
  }

  getRecentEvents(userData, limit = 5) {
    const allEvents = []
    
    userData.forEach(user => {
      if (user.events) {
        user.events.forEach(event => {
          allEvents.push({
            time: event.timestamp,
            type: event.type,
            description: this.formatEventDescription(event, user)
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

  getDeviceStats(users) {
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

  getErrorStats(users) {
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

  calculateTimeOnCurrentStep(user) {
    if (!user.events || user.events.length === 0) return null
    
    const stepEvents = user.events.filter(event => event.type === 'step_start')
    if (stepEvents.length === 0) return null
    
    const lastStepEvent = stepEvents[stepEvents.length - 1]
    const lastStepTime = new Date(lastStepEvent.timestamp)
    
    return Date.now() - lastStepTime.getTime()
  }

  formatDuration(milliseconds) {
    const minutes = Math.floor(milliseconds / (1000 * 60))
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000)
    
    if (minutes > 0) {
      return `${minutes} мин ${seconds} сек`
    } else {
      return `${seconds} сек`
    }
  }

  extractLocationFromUserAgent(userAgent) {
    // Простая экстракция локации из user agent
    // В реальном проекте можно использовать GeoIP
    if (userAgent.includes('Mobile')) return 'Мобильное устройство'
    if (userAgent.includes('Windows')) return 'Windows'
    if (userAgent.includes('Mac')) return 'macOS'
    if (userAgent.includes('Linux')) return 'Linux'
    return 'Неизвестно'
  }

  formatEventDescription(event, user) {
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
}

module.exports = StatsHelper
