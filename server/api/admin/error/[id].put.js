// API endpoint for updating existing errors
export default defineEventHandler(async (event) => {
  const errorId = getRouterParam(event, 'id')
  const body = await readBody(event)
  
  // Validate required fields
  if (!body.title || !body.description) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Отсутствуют обязательные поля: title, description'
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
  
  // In a real application, this would update the database
  const updatedError = {
    id: parseInt(errorId),
    device_id: body.device_id ? parseInt(body.device_id) : undefined,
    title: body.title,
    description: body.description,
    icon: body.icon || '⚠️',
    severity: body.severity || 'medium',
    updated_at: new Date().toISOString()
  }
  
  // Log the update
  console.log(`Updated error ${errorId}:`, updatedError)
  
  // In production, you would:
  // 1. Validate the error exists
  // 2. Update in database
  // 3. Return the updated error
  
  return {
    success: true,
    error: updatedError,
    message: 'Ошибка успешно обновлена'
  }
})
