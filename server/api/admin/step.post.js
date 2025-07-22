export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Validate required fields
    const requiredFields = ['device_id', 'error_id', 'title', 'instruction']
    for (const field of requiredFields) {
      if (!body[field]) {
        throw createError({
          statusCode: 400,
          statusMessage: `Field ${field} is required`
        })
      }
    }

    // Generate unique ID and set order if not provided
    const stepId = Date.now() + Math.random().toString(36).substr(2, 9)
    const orderIndex = body.order_index || await getNextOrderIndex(body.device_id, body.error_id)

    // Process and validate step data
    const stepData = {
      id: stepId,
      device_id: body.device_id,
      error_id: body.error_id,
      order_index: orderIndex,
      title: body.title,
      instruction: body.instruction,
      tip: body.tip || null,
      screen_image: body.screen_image || null,
      audio_url: body.audio_url || null,
      
      // Remote control hints
      highlighted_buttons: body.highlighted_buttons || [],
      actions: body.actions || [],
      
      // Advanced features
      onlyForOperator: body.onlyForOperator || false,
      critical: body.critical || false,
      severity: body.critical ? 'high' : (body.severity || null),
      
      // Interactive elements
      userConfirmation: body.userConfirmation || null,
      ifNoResult: body.ifNoResult || null,
      validation: body.validation || null,
      progress: body.progress || null,
      
      // Media support
      media: body.media || null,
      
      // Remote hint configuration
      remoteHint: body.remoteHint || null,
      
      // Metadata
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: 'admin', // TODO: Get from session
      draft: body.draft || false,
      
      // Step flow control
      nextIfSuccess: body.nextIfSuccess || null,
      estimatedTime: body.estimatedTime || null,
      
      // Analytics
      completion_rate: 0,
      average_time: 0,
      user_feedback: []
    }

    // Save step to database/storage
    // For demo purposes, we'll use a simple file-based storage
    await saveStepToStorage(stepData)

    // Log the creation
    console.log(`Step created: ${stepData.title} for device ${stepData.device_id}`)

    return {
      success: true,
      step: stepData,
      message: 'Step created successfully'
    }

  } catch (error) {
    console.error('Error creating step:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to create step'
    })
  }
})

// Helper function to get next order index
async function getNextOrderIndex(deviceId, errorId) {
  try {
    // Get existing steps for this device/error combination
    const existingSteps = await getStepsFromStorage(deviceId, errorId)
    
    if (existingSteps.length === 0) {
      return 1
    }
    
    // Find the highest order index and add 1
    const maxOrder = Math.max(...existingSteps.map(step => step.order_index || 0))
    return maxOrder + 1
    
  } catch (error) {
    console.error('Error getting next order index:', error)
    return 1
  }
}

// Helper function to save step to storage
async function saveStepToStorage(stepData) {
  // In a real implementation, this would save to your database
  // For demo purposes, we'll use a mock storage system
  
  const fs = await import('fs').then(m => m.promises)
  const path = await import('path')
  
  try {
    // Ensure storage directory exists
    const storageDir = path.join(process.cwd(), 'data', 'steps')
    await fs.mkdir(storageDir, { recursive: true })
    
    // Save step file
    const stepFile = path.join(storageDir, `${stepData.id}.json`)
    await fs.writeFile(stepFile, JSON.stringify(stepData, null, 2))
    
    // Update steps index
    await updateStepsIndex(stepData)
    
  } catch (error) {
    console.error('Error saving step to storage:', error)
    throw error
  }
}

// Helper function to get steps from storage
async function getStepsFromStorage(deviceId, errorId) {
  const fs = await import('fs').then(m => m.promises)
  const path = await import('path')
  
  try {
    const indexFile = path.join(process.cwd(), 'data', 'steps', 'index.json')
    
    try {
      const indexData = await fs.readFile(indexFile, 'utf8')
      const index = JSON.parse(indexData)
      
      return index.filter(step => 
        step.device_id == deviceId && step.error_id == errorId
      )
    } catch (error) {
      // Index file doesn't exist yet
      return []
    }
    
  } catch (error) {
    console.error('Error getting steps from storage:', error)
    return []
  }
}

// Helper function to update steps index
async function updateStepsIndex(stepData) {
  const fs = await import('fs').then(m => m.promises)
  const path = await import('path')
  
  try {
    const indexFile = path.join(process.cwd(), 'data', 'steps', 'index.json')
    let index = []
    
    try {
      const indexData = await fs.readFile(indexFile, 'utf8')
      index = JSON.parse(indexData)
    } catch (error) {
      // Index file doesn't exist yet, start with empty array
    }
    
    // Remove existing entry if updating
    index = index.filter(step => step.id !== stepData.id)
    
    // Add new/updated entry
    index.push({
      id: stepData.id,
      device_id: stepData.device_id,
      error_id: stepData.error_id,
      order_index: stepData.order_index,
      title: stepData.title,
      onlyForOperator: stepData.onlyForOperator,
      created_at: stepData.created_at,
      updated_at: stepData.updated_at
    })
    
    // Sort by order index
    index.sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
    
    // Save updated index
    await fs.writeFile(indexFile, JSON.stringify(index, null, 2))
    
  } catch (error) {
    console.error('Error updating steps index:', error)
    throw error
  }
}
