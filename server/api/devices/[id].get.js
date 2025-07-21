// Get single device by ID
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  try {
    // Mock device data - in production this would come from database
    const devices = [
      { 
        id: 1, 
        name: 'Openbox', 
        description: 'Стандартная приставка Openbox',
        icon: '📺',
        errorCount: 4,
        image: null
      },
      { 
        id: 2, 
        name: 'HDBOX', 
        description: 'HD приставка HDBOX',
        icon: '📺',
        errorCount: 3,
        image: null
      },
      { 
        id: 3, 
        name: 'UCLAN', 
        description: 'Приставка UCLAN',
        icon: '📺',
        errorCount: 2,
        image: null
      },
      { 
        id: 4, 
        name: 'Openbox GOLD', 
        description: 'Премиум версия Openbox',
        icon: '📺',
        errorCount: 5,
        image: null
      }
    ]
    
    const device = devices.find(d => d.id === parseInt(id))
    
    if (!device) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Device not found'
      })
    }
    
    return device
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch device'
    })
  }
})
