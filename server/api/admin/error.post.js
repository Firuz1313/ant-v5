// API endpoint for creating new errors
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // Validate required fields
  if (!body.device_id || !body.title || !body.description) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Отсутствуют обязательные поля: device_id, title, description'
    })
  }
  
  // Validate severity
  const validSeverities = ['low', 'medium', 'high']
  if (body.severity && !validSeverities.includes(body.severity)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Неправильное значение severity. Допустимые: low, medium, high'
    })
  }
  
  // In a real application, this would save to database
  const newError = {
    id: Date.now(), // Simple ID generation for demo
    device_id: parseInt(body.device_id),
    title: body.title,
    description: body.description,
    icon: body.icon || '⚠️',
    severity: body.severity || 'medium',
    step_count: 0, // Will be updated when steps are added
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  
  // Log the creation
  console.log('Created new error:', newError)
  
  // In production, you would:
  // 1. Validate device exists
  // 2. Save to database
  // 3. Return the created error with proper ID
  
  return {
    success: true,
    error: newError,
    message: 'Ошибка успешно создана'
  }
})
