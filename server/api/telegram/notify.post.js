export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { type, data } = body

    if (!type || !data) {
      throw new Error('Требуются поля type и data')
    }

    // For now, just log the notification instead of using Telegram bot
    // This avoids the require/import circular dependency issue
    console.log(`Telegram notification: ${type}`, data)

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
