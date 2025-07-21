// Analytics API endpoint for admin dashboard
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const timeRange = query.range || '24h' // 24h, 7d, 30d
  
  try {
    // Mock analytics data - replace with real database queries
    const analytics = generateAnalytics(timeRange)
    
    return {
      success: true,
      timeRange,
      generatedAt: new Date().toISOString(),
      ...analytics
    }
  } catch (error) {
    console.error('Analytics generation error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate analytics'
    })
  }
})

function generateAnalytics(timeRange) {
  // Mock data generation based on time range
  const multiplier = getTimeMultiplier(timeRange)
  
  return {
    overview: {
      totalSessions: Math.floor(150 * multiplier),
      completedSessions: Math.floor(120 * multiplier),
      abandonedSessions: Math.floor(30 * multiplier),
      averageDuration: '8.5 мин',
      successRate: 80,
      masterRequests: Math.floor(25 * multiplier)
    },
    
    deviceUsage: [
      { device: 'Openbox GOLD', sessions: Math.floor(60 * multiplier), successRate: 85 },
      { device: 'Openbox', sessions: Math.floor(40 * multiplier), successRate: 82 },
      { device: 'HDBOX', sessions: Math.floor(35 * multiplier), successRate: 78 },
      { device: 'UCLAN', sessions: Math.floor(15 * multiplier), successRate: 75 }
    ],
    
    errorDistribution: [
      { error: 'Нет сигнала', count: Math.floor(45 * multiplier), severity: 'high' },
      { error: 'Закодировано', count: Math.floor(35 * multiplier), severity: 'high' },
      { error: 'Нет звука', count: Math.floor(25 * multiplier), severity: 'medium' },
      { error: 'Плохое качество', count: Math.floor(20 * multiplier), severity: 'medium' },
      { error: 'Не включается', count: Math.floor(15 * multiplier), severity: 'low' },
      { error: 'Медленная работа', count: Math.floor(10 * multiplier), severity: 'low' }
    ],
    
    stepAnalytics: [
      {
        stepId: 1,
        stepTitle: 'Проверить баланс в личном кабинете',
        views: Math.floor(60 * multiplier),
        completions: Math.floor(55 * multiplier),
        avgTimeSpent: '45 сек',
        stuckUsers: Math.floor(5 * multiplier),
        successRate: 92
      },
      {
        stepId: 2,
        stepTitle: 'Проверить карту доступа',
        views: Math.floor(55 * multiplier),
        completions: Math.floor(45 * multiplier),
        avgTimeSpent: '2 мин 15 сек',
        stuckUsers: Math.floor(8 * multiplier),
        successRate: 82
      },
      {
        stepId: 3,
        stepTitle: 'Настройка антенны',
        views: Math.floor(45 * multiplier),
        completions: Math.floor(35 * multiplier),
        avgTimeSpent: '3 мин 30 сек',
        stuckUsers: Math.floor(12 * multiplier),
        successRate: 78
      },
      {
        stepId: 5,
        stepTitle: 'Проверка источника сигнала на ТВ',
        views: Math.floor(40 * multiplier),
        completions: Math.floor(38 * multiplier),
        avgTimeSpent: '1 мин 20 сек',
        stuckUsers: Math.floor(2 * multiplier),
        successRate: 95
      }
    ],
    
    userBehavior: {
      averageStepsPerSession: 4.2,
      mostDifficultStep: 'Настройка антенны',
      fastestCompletion: '3 мин 45 сек',
      slowestCompletion: '25 мин 12 сек',
      operatorInterventions: Math.floor(8 * multiplier),
      alternativePathUsage: Math.floor(15 * multiplier)
    },
    
    timeDistribution: generateTimeDistribution(timeRange, multiplier),
    
    geographicData: [
      { region: 'Москва', sessions: Math.floor(35 * multiplier), successRate: 85 },
      { region: 'Санкт-Петербург', sessions: Math.floor(25 * multiplier), successRate: 82 },
      { region: 'Екатеринбург', sessions: Math.floor(15 * multiplier), successRate: 78 },
      { region: 'Новосибирск', sessions: Math.floor(12 * multiplier), successRate: 80 },
      { region: 'Другие', sessions: Math.floor(63 * multiplier), successRate: 77 }
    ],
    
    feedbackAnalysis: {
      totalFeedback: Math.floor(95 * multiplier),
      averageRating: 4.2,
      positiveComments: Math.floor(70 * multiplier),
      negativeComments: Math.floor(15 * multiplier),
      suggestions: Math.floor(10 * multiplier),
      commonCompliments: [
        'Простой и понятный интерфейс',
        'Хорошие анимации и подсказки',
        'Быстро решил проблему'
      ],
      commonComplaints: [
        'Слишком много шагов',
        'Не хватает видео-инструкций',
        'Сложно найти кнопки на пульте'
      ]
    },
    
    operatorMetrics: {
      totalOperatorSessions: Math.floor(20 * multiplier),
      operatorOnlyStepsUsed: Math.floor(35 * multiplier),
      averageOperatorTime: '12 мин',
      operatorSuccessRate: 95,
      escalatedToMaster: Math.floor(5 * multiplier)
    },
    
    systemPerformance: {
      averageLoadTime: '1.2 сек',
      apiResponseTime: '150 мс',
      errorRate: '0.5%',
      uptime: '99.8%',
      cacheHitRate: '85%'
    }
  }
}

function getTimeMultiplier(timeRange) {
  switch (timeRange) {
    case '24h': return 1
    case '7d': return 7
    case '30d': return 30
    default: return 1
  }
}

function generateTimeDistribution(timeRange, multiplier) {
  if (timeRange === '24h') {
    return Array.from({ length: 24 }, (_, hour) => ({
      hour: `${hour}:00`,
      sessions: Math.floor(Math.random() * 10 + 5),
      completions: Math.floor(Math.random() * 8 + 3)
    }))
  } else if (timeRange === '7d') {
    const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
    return days.map(day => ({
      day,
      sessions: Math.floor(Math.random() * 30 + 15),
      completions: Math.floor(Math.random() * 25 + 12)
    }))
  } else {
    return Array.from({ length: 30 }, (_, day) => ({
      date: new Date(Date.now() - (29 - day) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      sessions: Math.floor(Math.random() * 40 + 20),
      completions: Math.floor(Math.random() * 35 + 15)
    }))
  }
}
