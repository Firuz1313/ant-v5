// API endpoint for comprehensive admin analytics
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const timeRange = query.range || '24h'
  
  // In production, this would query the database
  // For now, we'll use the temporary storage and generate mock data
  const analyticsStorage = global.analyticsStorage || []
  
  // Filter by time range
  const now = Date.now()
  let cutoffTime = 0
  
  switch (timeRange) {
    case '1h':
      cutoffTime = now - (60 * 60 * 1000)
      break
    case '24h':
      cutoffTime = now - (24 * 60 * 60 * 1000)
      break
    case '7d':
      cutoffTime = now - (7 * 24 * 60 * 60 * 1000)
      break
    case '30d':
      cutoffTime = now - (30 * 24 * 60 * 60 * 1000)
      break
    default:
      cutoffTime = 0
  }
  
  const filteredSessions = analyticsStorage.filter(session => {
    const sessionTime = new Date(session.timestamp).getTime()
    return sessionTime >= cutoffTime
  })
  
  // Generate comprehensive analytics
  const analytics = {
    overview: generateOverview(filteredSessions),
    deviceUsage: generateDeviceUsage(filteredSessions),
    errorDistribution: generateErrorDistribution(filteredSessions),
    stepAnalytics: generateStepAnalytics(filteredSessions),
    userBehavior: generateUserBehavior(filteredSessions),
    geographicData: generateGeographicData(filteredSessions),
    timeRange,
    generatedAt: new Date().toISOString(),
    totalSessions: filteredSessions.length
  }
  
  return analytics
})

// Helper functions
function generateOverview(sessions) {
  const totalSessions = sessions.length
  const completedSessions = sessions.filter(s => s.completion?.wasCompleted).length
  const abandonedSessions = totalSessions - completedSessions
  const successRate = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0
  
  return {
    totalSessions,
    completedSessions,
    abandonedSessions,
    successRate
  }
}

function generateDeviceUsage(sessions) {
  // Mock device usage data
  const devices = [
    { device: 'Openbox GOLD', sessions: Math.floor(Math.random() * 50) + 20, successRate: 89 },
    { device: 'Openbox Standard', sessions: Math.floor(Math.random() * 30) + 15, successRate: 92 },
    { device: 'HDBOX', sessions: Math.floor(Math.random() * 25) + 10, successRate: 78 },
    { device: 'UCLAN', sessions: Math.floor(Math.random() * 15) + 5, successRate: 85 }
  ]
  
  return devices.sort((a, b) => b.sessions - a.sessions)
}

function generateErrorDistribution(sessions) {
  // Mock error distribution data
  return [
    { error: 'Нет сигнала', count: Math.floor(Math.random() * 30) + 15, severity: 'high' },
    { error: 'Закодировано', count: Math.floor(Math.random() * 25) + 12, severity: 'high' },
    { error: 'Нет звука', count: Math.floor(Math.random() * 20) + 8, severity: 'medium' },
    { error: 'Плохое качество', count: Math.floor(Math.random() * 15) + 5, severity: 'medium' },
    { error: 'Медленная работа', count: Math.floor(Math.random() * 10) + 3, severity: 'low' }
  ].sort((a, b) => b.count - a.count)
}

function generateStepAnalytics(sessions) {
  // Generate step performance data
  const steps = [
    'Проверка карты доступа',
    'Настройка антенны', 
    'Поиск каналов',
    'Проверка сигнала',
    'Переподключение кабеля',
    'Настройка спутника',
    'Проверка баланса',
    'Перезагрузка устройства'
  ]
  
  return steps.map((title, index) => {
    const views = Math.floor(Math.random() * 100) + 20
    const completions = Math.floor(views * (0.6 + Math.random() * 0.3))
    const stuckUsers = Math.floor(Math.random() * 15)
    const successRate = Math.round((completions / views) * 100)
    const avgTimeSpent = `${Math.floor(Math.random() * 5) + 1}м ${Math.floor(Math.random() * 60)}с`
    
    return {
      stepId: index + 1,
      stepTitle: title,
      views,
      completions,
      avgTimeSpent,
      stuckUsers,
      successRate
    }
  }).sort((a, b) => a.successRate - b.successRate)
}

function generateUserBehavior(sessions) {
  return {
    averageStepsPerSession: Math.round(Math.random() * 5) + 3,
    mostDifficultStep: 'Настройка антенны',
    fastestCompletion: '2м 15с',
    operatorInterventions: Math.floor(Math.random() * 20) + 5,
    alternativePathUsage: Math.floor(Math.random() * 15) + 3
  }
}

function generateGeographicData(sessions) {
  return [
    { region: 'Москва', sessions: Math.floor(Math.random() * 50) + 30, successRate: 91 },
    { region: 'СПб', sessions: Math.floor(Math.random() * 40) + 25, successRate: 88 },
    { region: 'Екатеринбург', sessions: Math.floor(Math.random() * 30) + 15, successRate: 85 },
    { region: 'Новосибирск', sessions: Math.floor(Math.random() * 25) + 12, successRate: 83 },
    { region: 'Казань', sessions: Math.floor(Math.random() * 20) + 8, successRate: 87 }
  ].sort((a, b) => b.sessions - a.sessions)
}
