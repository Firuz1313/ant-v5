const TelegramBotService = require('../../services/telegramBot')

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { type, data } = body

    if (!type || !data) {
      throw new Error('Требуются поля type и data')
    }

    const botService = TelegramBotService.getInstance()

    switch (type) {
      case 'user_stuck':
        await botService.notifyUserStuck(data)
        break
      
      case 'diagnostic_completed':
        await botService.notifyDiagnosticCompleted(data)
        break
      
      case 'master_request':
        await botService.notifyMasterRequest(data)
        break
      
      case 'system_error':
        await botService.notifySystemError(data)
        break
      
      default:
        throw new Error(`Неизвестный тип уведомления: ${type}`)
    }

    return {
      success: true,
      message: 'Уведомление отправлено'
    }
  } catch (error) {
    console.error('Ошибка отправки Telegram уведомления:', error)
    
    return {
      success: false,
      error: error.message
    }
  }
})
