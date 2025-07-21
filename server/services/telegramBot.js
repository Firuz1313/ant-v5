const TelegramBot = require('node-telegram-bot-api')
const StatsHelper = require('../utils/statsHelper')

class TelegramBotService {
  constructor() {
    this.token = process.env.TELEGRAM_BOT_TOKEN
    this.bot = null
    this.chatIds = new Set() // Store admin chat IDs
    this.userSessions = new Map() // Track user diagnostic sessions
    
    if (this.token) {
      this.initBot()
    } else {
      console.log('Telegram bot token not provided, bot features disabled')
    }
  }

  initBot() {
    try {
      this.bot = new TelegramBot(this.token, { polling: true })
      this.setupCommands()
      this.setupHandlers()
      console.log('Telegram bot initialized successfully')
    } catch (error) {
      console.error('Failed to initialize Telegram bot:', error)
    }
  }

  setupCommands() {
    if (!this.bot) return

    // Set bot commands
    this.bot.setMyCommands([
      { command: 'start', description: 'Начать работу с ботом' },
      { command: 'help', description: 'Показать справку' },
      { command: 'status', description: 'Статус системы диагностики' },
      { command: 'stats', description: 'Статистика использования' },
      { command: 'users', description: 'Активные пользователи' },
      { command: 'stuck', description: 'Пользователи, застрявшие на шагах' },
      { command: 'errors', description: 'Последние ошибки системы' }
    ])
  }

  setupHandlers() {
    if (!this.bot) return

    // Start command
    this.bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id
      this.chatIds.add(chatId)
      
      const welcomeMessage = `
🤖 *Бот диагностики ТВ-приставок*

Добро пожаловать! Я буду уведомлять вас о событиях в системе диагностики.

*Доступные команды:*
/help - Справка по командам
/status - Статус системы
/stats - Статистика использования
/users - Активные пользователи
/stuck - Проблемные сессии
/errors - Последние ошибки

Вы будете получать уведомления о:
• Пользователях, застрявших на шагах
• Завершенных диагностиках
• Критических ошибках
• Заявках на вызов мастера
      `
      
      this.bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'Markdown' })
    })

    // Help command
    this.bot.onText(/\/help/, (msg) => {
      const chatId = msg.chat.id
      const helpMessage = `
*🔧 Команды бота диагностики ТВ*

/status - Текущий статус системы
/stats - Статистика за сегодня
/users - Список активных пользователей
/stuck - Пользователи с проблемами
/errors - Последние ошибки системы

*📊 Автоматические уведомления:*
• Пользователь застрял на шаге > 2 минут
• Диагностика завершена неудачно
• Создана заявка на вызов мастера
• Критические ошибки системы

*💬 Интерактивные команды:*
Отправьте инструкцию пользователю:
\`/send [session_id] [message]\`

Завершить проблемную сессию:
\`/complete [session_id]\`
      `
      
      this.bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' })
    })

    // Status command
    this.bot.onText(/\/status/, async (msg) => {
      const chatId = msg.chat.id
      const status = await this.getSystemStatus()
      
      const statusMessage = `
📊 *Статус системы диагностики*

🟢 Система: Работает
📱 Активных сессий: ${status.activeSessions}
⏱️ Средняя длительность: ${status.averageDuration}
✅ Успешных диагностик: ${status.successRate}%
🔧 Заявок на мастера: ${status.masterRequests}

*Последние события:*
${status.recentEvents.map(event => `• ${event}`).join('\n')}
      `
      
      this.bot.sendMessage(chatId, statusMessage, { parse_mode: 'Markdown' })
    })

    // Stats command
    this.bot.onText(/\/stats/, async (msg) => {
      const chatId = msg.chat.id
      const stats = await this.getDailyStats()
      
      const statsMessage = `
📈 *Статистика за сегодня*

👥 Пользователей: ${stats.totalUsers}
🎯 Начатых диагностик: ${stats.startedDiagnostics}
✅ Завершено успешно: ${stats.completedSuccessfully}
❌ Незавершенных: ${stats.abandoned}
🔧 Заявок на мастера: ${stats.masterRequests}

*Популярные приставки:*
${stats.topDevices.map(device => `• ${device.name}: ${device.count}`).join('\n')}

*Частые ошибки:*
${stats.topErrors.map(error => `• ${error.title}: ${error.count}`).join('\n')}
      `
      
      this.bot.sendMessage(chatId, statsMessage, { parse_mode: 'Markdown' })
    })

    // Users command
    this.bot.onText(/\/users/, async (msg) => {
      const chatId = msg.chat.id
      const activeUsers = await this.getActiveUsers()
      
      let usersMessage = '*👥 Активные пользователи:*\n\n'
      
      if (activeUsers.length === 0) {
        usersMessage += 'Нет активных пользователей'
      } else {
        activeUsers.forEach((user, index) => {
          usersMessage += `${index + 1}. Сессия ${user.sessionId}\n`
          usersMessage += `   📱 ${user.device} - ${user.error}\n`
          usersMessage += `   ⏱️ Шаг ${user.currentStep} (${user.timeOnStep})\n`
          usersMessage += `   🌐 ${user.location || 'Неизвестно'}\n\n`
        })
      }
      
      this.bot.sendMessage(chatId, usersMessage, { parse_mode: 'Markdown' })
    })

    // Stuck users command
    this.bot.onText(/\/stuck/, async (msg) => {
      const chatId = msg.chat.id
      const stuckUsers = await this.getStuckUsers()
      
      let stuckMessage = '*⚠️ Пользователи с проблемами:*\n\n'
      
      if (stuckUsers.length === 0) {
        stuckMessage += 'Нет пользователей с проблемами'
      } else {
        stuckUsers.forEach((user, index) => {
          stuckMessage += `${index + 1}. Сессия ${user.sessionId}\n`
          stuckMessage += `   🚨 Застрял на: "${user.stepTitle}"\n`
          stuckMessage += `   ⏰ Время на шаге: ${user.stuckTime}\n`
          stuckMessage += `   📱 ${user.device} - ${user.error}\n`
          stuckMessage += `   /help_${user.sessionId} - Помочь\n\n`
        })
      }
      
      this.bot.sendMessage(chatId, stuckMessage, { parse_mode: 'Markdown' })
    })

    // Send instruction to user
    this.bot.onText(/\/send (\S+) (.+)/, async (msg, match) => {
      const chatId = msg.chat.id
      const sessionId = match[1]
      const message = match[2]
      
      const success = await this.sendInstructionToUser(sessionId, message)
      
      if (success) {
        this.bot.sendMessage(chatId, `✅ Инструкция отправлена пользователю сессии ${sessionId}`)
      } else {
        this.bot.sendMessage(chatId, `❌ Не удалось отправить инструкцию. Сессия ${sessionId} не найдена.`)
      }
    })

    // Error handling
    this.bot.on('polling_error', (error) => {
      console.error('Telegram bot polling error:', error)
    })
  }

  // Notification methods
  async notifyUserStuck(sessionData) {
    if (!this.bot || this.chatIds.size === 0) return

    const message = `
🚨 *Пользователь застрял!*

👤 Сессия: \`${sessionData.sessionId}\`
📱 Устройство: ${sessionData.device}
❌ Ошибка: ${sessionData.error}
📍 Шаг: "${sessionData.stepTitle}"
⏰ Время на шаге: ${sessionData.timeStuck}

/help_${sessionData.sessionId} - Помочь пользователю
    `

    this.broadcastMessage(message)
  }

  async notifyDiagnosticCompleted(sessionData) {
    if (!this.bot || this.chatIds.size === 0) return

    const icon = sessionData.success ? '✅' : '❌'
    const status = sessionData.success ? 'завершена успешно' : 'завершена неудачно'
    
    const message = `
${icon} *Диагностика ${status}*

👤 Сессия: \`${sessionData.sessionId}\`
📱 Устройство: ${sessionData.device}
❌ Ошибка: ${sessionData.error}
⏱️ Длительность: ${sessionData.duration}
📊 Шагов пройдено: ${sessionData.stepsCompleted}/${sessionData.totalSteps}
    `

    this.broadcastMessage(message)
  }

  async notifyMasterRequest(requestData) {
    if (!this.bot || this.chatIds.size === 0) return

    const priorityIcon = requestData.priority === 'high' ? '🔴' : requestData.priority === 'medium' ? '🟡' : '🟢'
    
    const message = `
🔧 *Новая заявка на мастера*

${priorityIcon} Приоритет: ${requestData.priority}
📋 ID заявки: \`${requestData.requestId}\`
📱 Устройство: ${requestData.device}
❌ Проблема: ${requestData.error}
⏰ Ожидаемое время: ${requestData.estimatedArrival}
📞 Контакт: ${requestData.contact || 'Не указан'}

/track_${requestData.requestId} - Отследить заявку
    `

    this.broadcastMessage(message)
  }

  async notifySystemError(errorData) {
    if (!this.bot || this.chatIds.size === 0) return

    const message = `
💥 *Системная ошибка*

🚨 Уровень: ${errorData.level}
📝 Сообщение: ${errorData.message}
📍 Компонент: ${errorData.component}
⏰ Время: ${new Date(errorData.timestamp).toLocaleString('ru-RU')}

${errorData.stack ? `\`\`\`\n${errorData.stack.slice(0, 500)}\n\`\`\`` : ''}
    `

    this.broadcastMessage(message)
  }

  // Utility methods
  broadcastMessage(message) {
    this.chatIds.forEach(chatId => {
      this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' })
        .catch(error => {
          console.error(`Failed to send message to ${chatId}:`, error)
          // Remove invalid chat ID
          this.chatIds.delete(chatId)
        })
    })
  }

      async getSystemStatus() {
    try {
      // Use internal API call instead of fetch
      const { getSystemStatus } = require('../api/telegram/stats.get.js')
      return await getSystemStatus()
    } catch (error) {
      console.error('Failed to fetch system status:', error)
    }

    // Fallback data
    return {
      activeSessions: 0,
      averageDuration: '0 мин',
      successRate: 0,
      masterRequests: 0,
      recentEvents: ['Нет событий']
    }
  }

    async getDailyStats() {
    try {
      const response = await fetch('http://localhost:3000/api/telegram/stats?type=daily')
      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      console.error('Failed to fetch daily stats:', error)
    }

    // Fallback data
    return {
      totalUsers: 0,
      startedDiagnostics: 0,
      completedSuccessfully: 0,
      abandoned: 0,
      masterRequests: 0,
      topDevices: [],
      topErrors: []
    }
  }

    async getActiveUsers() {
    try {
      const response = await fetch('http://localhost:3000/api/telegram/stats?type=active_users')
      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      console.error('Failed to fetch active users:', error)
    }

    // Fallback data
    return []
  }

    async getStuckUsers() {
    try {
      const response = await fetch('http://localhost:3000/api/telegram/stats?type=stuck_users')
      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      console.error('Failed to fetch stuck users:', error)
    }

    // Fallback data
    return []
  }

  async sendInstructionToUser(sessionId, message) {
    // In a real implementation, this would send a notification to the user's browser
    // For now, we'll just log it
    console.log(`Sending instruction to session ${sessionId}: ${message}`)
    return true
  }

  // Public API for the application
  static getInstance() {
    if (!this.instance) {
      this.instance = new TelegramBotService()
    }
    return this.instance
  }
}

module.exports = TelegramBotService
