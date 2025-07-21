// API endpoint for updating existing remote controls
export default defineEventHandler(async (event) => {
  const remoteId = getRouterParam(event, 'id')
  const body = await readBody(event)
  
  // Validate required fields
  if (!body.name || !body.image || !body.buttons) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Отсутствуют обязательные поля: name, image, buttons'
    })
  }
  
  // Validate buttons array
  if (!Array.isArray(body.buttons) || body.buttons.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Необходимо добавить хотя бы одну кнопку'
    })
  }
  
  // In a real application, this would update the database
  const updatedRemote = {
    id: parseInt(remoteId),
    deviceId: body.deviceId,
    name: body.name,
    version: body.version || '1.0',
    image: body.image,
    buttons: body.buttons,
    updated_at: new Date().toISOString()
  }
  
  // Log the update
  console.log(`Updated remote control ${remoteId}:`, {
    name: updatedRemote.name,
    buttonCount: updatedRemote.buttons.length
  })
  
  // In production, you would:
  // 1. Validate the remote exists
  // 2. Check permissions
  // 3. Process image if changed
  // 4. Update database record
  // 5. Invalidate caches
  
  return {
    success: true,
    remote: updatedRemote,
    message: 'Пульт успешно обновлен'
  }
})
