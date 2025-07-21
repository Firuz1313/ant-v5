// API endpoint for updating existing diagnostic steps
export default defineEventHandler(async (event) => {
  const stepId = getRouterParam(event, 'id')
  const body = await readBody(event)
  
  // In a real application, this would update the database
  // For now, we'll simulate the update
  const updatedStep = {
    id: parseInt(stepId),
    device_id: body.device_id,
    error_id: body.error_id,
    order_index: body.order_index,
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
    updated_at: new Date().toISOString()
  }
  
  // Log the update
  console.log(`Updated step ${stepId}:`, updatedStep)
  
  // In production, you would:
  // 1. Validate the step exists
  // 2. Validate the input data
  // 3. Handle order_index changes
  // 4. Update in database
  // 5. Return the updated step
  
  return {
    success: true,
    step: updatedStep,
    message: 'Шаг успешно обновлен'
  }
})
