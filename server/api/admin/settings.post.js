export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // Validate required fields
    if (!body || typeof body !== 'object') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid settings data'
      })
    }

    // Extract settings from request body
    const settings = {
      defaultDeviceIcon: body.defaultDeviceIcon || null,
      defaultRemote: body.defaultRemote || null,
      theme: body.theme || 'light',
      language: body.language || 'ru',
      notifications: body.notifications !== undefined ? body.notifications : true,
      autoSync: body.autoSync !== undefined ? body.autoSync : true,
      mediaPath: body.mediaPath || '/uploads',
      updatedAt: new Date().toISOString()
    }

    // In production, save to database
    // For now, we'll return the saved settings
    console.log('Settings saved:', settings)

    return {
      success: true,
      message: 'Настройки успешно сохранены',
      settings
    }
  } catch (error) {
    console.error('Settings save error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to save settings'
    })
  }
})
