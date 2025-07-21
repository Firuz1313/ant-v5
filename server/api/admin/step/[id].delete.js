// API endpoint for deleting diagnostic steps
export default defineEventHandler(async (event) => {
  const stepId = getRouterParam(event, 'id')
  
  // In a real application, this would delete from database
  // and potentially reorder remaining steps
  
  // Log the deletion
  console.log(`Deleted step ${stepId}`)
  
  // In production, you would:
  // 1. Validate the step exists
  // 2. Check for dependencies
  // 3. Delete from database
  // 4. Reorder remaining steps if needed
  
  return {
    success: true,
    message: 'Шаг успешно удален',
    stepId: parseInt(stepId)
  }
})
