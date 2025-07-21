// API endpoint for updating existing devices
export default defineEventHandler(async (event) => {
  const deviceId = getRouterParam(event, 'id')
  const body = await readBody(event)
  
  // In a real application, this would update the database
  // For now, we'll simulate the update
  const updatedDevice = {
    id: parseInt(deviceId),
    name: body.name,
    description: body.description,
    remote_image: body.remote_image,
    updated_at: new Date().toISOString()
  }
  
  // Log the update
  console.log(`Updated device ${deviceId}:`, updatedDevice)
  
  // In production, you would:
  // 1. Validate the device exists
  // 2. Validate the input data
  // 3. Update in database
  // 4. Return the updated device
  
  return {
    success: true,
    device: updatedDevice,
    message: 'Устройство успешно обновлено'
  }
})
