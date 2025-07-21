// API endpoint for deleting remote controls
export default defineEventHandler(async (event) => {
  const remoteId = getRouterParam(event, 'id')
  
  // In a real application, this would delete from database
  // and handle related dependencies
  
  // Log the deletion
  console.log(`Deleted remote control ${remoteId}`)
  
  // In production, you would:
  // 1. Validate the remote exists
  // 2. Check for dependencies (devices using this remote)
  // 3. Handle image cleanup
  // 4. Delete from database
  // 5. Update related device records
  
  return {
    success: true,
    message: 'Пульт успешно удален',
    remoteId: parseInt(remoteId)
  }
})
