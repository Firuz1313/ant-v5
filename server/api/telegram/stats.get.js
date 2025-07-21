const StatsHelper = require('../../utils/statsHelper')

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const type = query.type || 'status'

    const statsHelper = new StatsHelper()

    switch (type) {
      case 'status':
        return await statsHelper.getSystemStatus()
      
      case 'daily':
        return await statsHelper.getDailyStats()
      
      case 'active_users':
        return await statsHelper.getActiveUsers()
      
      case 'stuck_users':
        return await statsHelper.getStuckUsers()
      
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
