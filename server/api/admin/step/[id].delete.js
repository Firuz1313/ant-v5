export default defineEventHandler(async (event) => {
  try {
    const stepId = getRouterParam(event, 'id')

    if (!stepId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Step ID is required'
      })
    }

    // Get existing step before deletion
    const existingStep = await getStepFromStorage(stepId)
    if (!existingStep) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Step not found'
      })
    }

    // Delete step file
    await deleteStepFromStorage(stepId)

    // Reorder remaining steps to fill the gap
    await reorderRemainingSteps(existingStep.device_id, existingStep.error_id, existingStep.order_index)

    // Update the index
    await updateStepsIndex()

    // Log the deletion
    console.log(`Step deleted: ${existingStep.title} (ID: ${stepId})`)

    return {
      success: true,
      message: 'Step deleted successfully',
      deletedStep: {
        id: stepId,
        title: existingStep.title
      }
    }

  } catch (error) {
    console.error('Error deleting step:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to delete step'
    })
  }
})

// Helper function to get step from storage
async function getStepFromStorage(stepId) {
  const fs = await import('fs').then(m => m.promises)
  const path = await import('path')
  
  try {
    const stepFile = path.join(process.cwd(), 'data', 'steps', `${stepId}.json`)
    const stepData = await fs.readFile(stepFile, 'utf8')
    return JSON.parse(stepData)
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null // Step doesn't exist
    }
    throw error
  }
}

// Helper function to delete step from storage
async function deleteStepFromStorage(stepId) {
  const fs = await import('fs').then(m => m.promises)
  const path = await import('path')
  
  try {
    const stepFile = path.join(process.cwd(), 'data', 'steps', `${stepId}.json`)
    await fs.unlink(stepFile)
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error
    }
    // File doesn't exist, which is fine for deletion
  }
}

// Helper function to reorder remaining steps after deletion
async function reorderRemainingSteps(deviceId, errorId, deletedOrderIndex) {
  const fs = await import('fs').then(m => m.promises)
  const path = await import('path')
  
  try {
    // Get all remaining steps for this device/error combination
    const steps = await getStepsFromStorage(deviceId, errorId)
    
    // Update order indices for steps that come after the deleted step
    for (const step of steps) {
      if (step.order_index > deletedOrderIndex) {
        // Get full step data
        const fullStep = await getStepFromStorage(step.id)
        if (fullStep) {
          fullStep.order_index -= 1
          fullStep.updated_at = new Date().toISOString()
          await saveStepToStorage(fullStep)
        }
      }
    }
    
  } catch (error) {
    console.error('Error reordering remaining steps:', error)
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
      return []
    }
    
  } catch (error) {
    console.error('Error getting steps from storage:', error)
    return []
  }
}

// Helper function to save step to storage
async function saveStepToStorage(stepData) {
  const fs = await import('fs').then(m => m.promises)
  const path = await import('path')
  
  try {
    const storageDir = path.join(process.cwd(), 'data', 'steps')
    await fs.mkdir(storageDir, { recursive: true })
    
    const stepFile = path.join(storageDir, `${stepData.id}.json`)
    await fs.writeFile(stepFile, JSON.stringify(stepData, null, 2))
    
  } catch (error) {
    console.error('Error saving step to storage:', error)
    throw error
  }
}

// Helper function to update steps index
async function updateStepsIndex() {
  const fs = await import('fs').then(m => m.promises)
  const path = await import('path')
  
  try {
    const storageDir = path.join(process.cwd(), 'data', 'steps')
    
    // Check if directory exists
    try {
      await fs.access(storageDir)
    } catch (error) {
      // Directory doesn't exist, create empty index
      await fs.mkdir(storageDir, { recursive: true })
      const indexFile = path.join(storageDir, 'index.json')
      await fs.writeFile(indexFile, JSON.stringify([], null, 2))
      return
    }
    
    const files = await fs.readdir(storageDir)
    const index = []
    
    for (const file of files) {
      if (file.endsWith('.json') && file !== 'index.json') {
        try {
          const stepData = await fs.readFile(path.join(storageDir, file), 'utf8')
          const step = JSON.parse(stepData)
          
          index.push({
            id: step.id,
            device_id: step.device_id,
            error_id: step.error_id,
            order_index: step.order_index,
            title: step.title,
            onlyForOperator: step.onlyForOperator,
            created_at: step.created_at,
            updated_at: step.updated_at
          })
        } catch (error) {
          console.error(`Error reading step file ${file}:`, error)
        }
      }
    }
    
    // Sort by order index
    index.sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
    
    const indexFile = path.join(storageDir, 'index.json')
    await fs.writeFile(indexFile, JSON.stringify(index, null, 2))
    
  } catch (error) {
    console.error('Error updating steps index:', error)
    throw error
  }
}
