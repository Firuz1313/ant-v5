// API endpoint for deleting errors
export default defineEventHandler(async (event) => {
  const errorId = getRouterParam(event, 'id')
  
  // In a real application, this would delete from database
  // and handle related data (steps, etc.)
  
  // Log the deletion
  console.log(`Deleted error ${errorId}`)
  
  // In production, you would:
  // 1. Validate the error exists
  // 2. Check for dependencies (steps using this error)
  // 3. Either cascade delete or prevent deletion
  // 4. Delete from database
  
  return {
    success: true,
    message: 'Ошибка успешно удалена',
    errorId: parseInt(errorId)
  }
})
