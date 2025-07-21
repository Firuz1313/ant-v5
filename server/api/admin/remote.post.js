// API endpoint for creating new remote controls
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // Validate required fields
  if (!body.deviceId || !body.name || !body.image || !body.buttons) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Отсутствуют обязательные поля: deviceId, name, image, buttons'
    })
  }
  
  // Validate buttons array
  if (!Array.isArray(body.buttons) || body.buttons.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Необходимо добавить хотя бы одну кнопку'
    })
  }
  
  // Validate button structure
  for (const button of body.buttons) {
    if (!button.type || !button.label || typeof button.x !== 'number' || typeof button.y !== 'number') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Неправильная структура кнопки. Требуются поля: type, label, x, y'
      })
    }
    
    if (button.x < 0 || button.x > 100 || button.y < 0 || button.y > 100) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Координаты кнопок должны быть в диапазоне 0-100%'
      })
    }
  }
  
  // In a real application, this would save to database
  const newRemote = {
    id: Date.now(), // Simple ID generation for demo
    deviceId: body.deviceId,
    name: body.name,
    version: body.version || '1.0',
    image: body.image,
    buttons: body.buttons.map((button, index) => ({
      ...button,
      id: Date.now() + index // Ensure unique IDs
    })),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  
  // Log the creation
  console.log('Created new remote control:', {
    id: newRemote.id,
    deviceId: newRemote.deviceId,
    name: newRemote.name,
    buttonCount: newRemote.buttons.length
  })
  
  // In production, you would:
  // 1. Validate device exists
  // 2. Process and store the image (possibly resize, optimize)
  // 3. Save remote data to database
  // 4. Create associations with device
  // 5. Update device remote_image field
  
  return {
    success: true,
    remote: newRemote,
    message: 'Пульт успешно создан'
  }
})
