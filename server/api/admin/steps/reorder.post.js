// API endpoint for reordering diagnostic steps
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { draggedStepId, targetStepId, draggedIndex, targetIndex } = body
  
  // In a real application, this would update the database
  // For now, we'll simulate the reordering logic
  
  try {
    // Calculate new order indices
    const steps = [] // This would come from database
    
    // Reorder logic:
    // 1. If moving up: increment all steps between target and dragged
    // 2. If moving down: decrement all steps between dragged and target
    // 3. Set dragged step to target position
    
    if (draggedIndex > targetIndex) {
      // Moving up - increment steps in between
      console.log(`Moving step ${draggedStepId} up from ${draggedIndex} to ${targetIndex}`)
      
      // In real implementation:
      // UPDATE steps SET order_index = order_index + 1 
      // WHERE order_index >= targetIndex AND order_index < draggedIndex
      // AND id != draggedStepId
      
      // UPDATE steps SET order_index = targetIndex WHERE id = draggedStepId
      
    } else {
      // Moving down - decrement steps in between
      console.log(`Moving step ${draggedStepId} down from ${draggedIndex} to ${targetIndex}`)
      
      // In real implementation:
      // UPDATE steps SET order_index = order_index - 1 
      // WHERE order_index > draggedIndex AND order_index <= targetIndex
      // AND id != draggedStepId
      
      // UPDATE steps SET order_index = targetIndex WHERE id = draggedStepId
    }
    
    // Log the reordering
    console.log('Step reordering completed:', {
      draggedStepId,
      targetStepId,
      draggedIndex,
      targetIndex
    })
    
    return {
      success: true,
      message: 'Порядок шагов успешно изменен',
      reorderedSteps: {
        draggedStepId: parseInt(draggedStepId),
        newPosition: targetIndex
      }
    }
    
  } catch (error) {
    console.error('Error reordering steps:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Ошибка при изменении порядка шагов'
    })
  }
})
