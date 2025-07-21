// API endpoint for deleting devices
export default defineEventHandler(async (event) => {
  const deviceId = getRouterParam(event, 'id')
  
  // In a real application, this would delete from database
  // and handle related data (errors, steps, etc.)
  
  // Log the deletion
  console.log(`Deleted device ${deviceId}`)
  
  // In production, you would:
  // 1. Validate the device exists
  // 2. Check for dependencies (errors, steps)
  // 3. Either cascade delete or prevent deletion
  // 4. Delete from database
  
  return {
    success: true,
    message: 'Устройство успешно удалено',
    deviceId: parseInt(deviceId)
  }
})
