export default defineEventHandler(async (event) => {
  try {
    // Return current settings - in production this would come from database
    const settings = {
      defaultDeviceIcon: null,
      defaultRemote: null,
      theme: 'light',
      language: 'ru',
      notifications: true,
      autoSync: true,
      mediaPath: '/uploads',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return settings
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to load settings'
    })
  }
})
