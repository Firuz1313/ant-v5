// API endpoint for creating new diagnostic steps
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // In a real application, this would save to a database
  // For now, we'll simulate the creation
  const newStep = {
    id: Date.now(), // Simple ID generation for demo
    device_id: body.device_id,
    error_id: body.error_id,
    order_index: body.order_index || 1,
    title: body.title,
    instruction: body.instruction,
    tip: body.tip,
    screen_image: body.screen_image,
    highlighted_buttons: body.highlighted_buttons || [],
    actions: body.actions || [],
    audio_url: body.audio_url,
    onlyForOperator: body.onlyForOperator || false,
    media: body.media,
    userConfirmation: body.userConfirmation,
    validation: body.validation,
    ifNoResult: body.ifNoResult,
    progress: body.progress || false,
    created_at: new Date().toISOString()
  }
  
  // Log the creation
  console.log('Created new step:', newStep)
  
  // In production, you would:
  // 1. Validate the input data
  // 2. Validate device and error exist
  // 3. Handle order_index conflicts
  // 4. Save to database
  // 5. Return the created step with proper ID
  
  return {
    success: true,
    step: newStep,
    message: 'Шаг успешно создан'
  }
})
