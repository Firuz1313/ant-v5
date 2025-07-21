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
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }

    return settings
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to load settings'
    })
  }
})
