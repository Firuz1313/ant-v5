import fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const type = query.type || 'status'

    const dataPath = path.join(process.cwd(), 'data', 'user_logs.json')

    let userData = []
    if (fs.existsSync(dataPath)) {
      const fileContent = fs.readFileSync(dataPath, 'utf-8')
      userData = JSON.parse(fileContent)
    }

    switch (type) {
      case 'status':
        return await getSystemStatus(userData)

      case 'daily':
        return await getDailyStats(userData)

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
