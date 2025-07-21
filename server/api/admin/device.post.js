// API endpoint for creating new devices
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // In a real application, this would save to a database
  // For now, we'll simulate the creation
  const newDevice = {
    id: Date.now(), // Simple ID generation for demo
    name: body.name,
    description: body.description,
    remote_image: body.remote_image,
    icon: '📱', // Default icon
    error_count: 0,
    created_at: new Date().toISOString()
  }
  
  // Log the creation
  console.log('Created new device:', newDevice)
  
  // In production, you would:
  // 1. Validate the input data
  // 2. Save to database
  // 3. Return the created device with proper ID
  
  return {
    success: true,
    device: newDevice,
    message: 'Устройство успешно создано'
  }
})
