export default defineEventHandler(async (event) => {
  try {
    const stepId = getRouterParam(event, 'id')
    const body = await readBody(event)

    if (!stepId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Step ID is required'
      })
    }

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

    // Get existing step
    const existingStep = await getStepFromStorage(stepId)
    if (!existingStep) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Step not found'
      })
    }

    // Update step data, preserving creation metadata
    const updatedStepData = {
      ...existingStep,
      ...body,
      id: stepId, // Ensure ID doesn't change
      created_at: existingStep.created_at, // Preserve creation date
      updated_at: new Date().toISOString(),
      updated_by: 'admin' // TODO: Get from session
    }

    // If order changed, ensure it's valid
    if (body.order_index && body.order_index !== existingStep.order_index) {
      await reorderSteps(updatedStepData.device_id, updatedStepData.error_id, stepId, body.order_index)
    }

    // Save updated step
    await saveStepToStorage(updatedStepData)

    // Log the update
    console.log(`Step updated: ${updatedStepData.title} (ID: ${stepId})`)

    return {
      success: true,
      step: updatedStepData,
      message: 'Step updated successfully'
    }

  } catch (error) {
    console.error('Error updating step:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to update step'
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

// Helper function to reorder steps
async function reorderSteps(deviceId, errorId, movedStepId, newOrderIndex) {
  const fs = await import('fs').then(m => m.promises)
  const path = await import('path')
  
  try {
    // Get all steps for this device/error combination
    const steps = await getStepsFromStorage(deviceId, errorId)
    
    // Find the step being moved
    const movedStep = steps.find(step => step.id === movedStepId)
    if (!movedStep) return
    
    const oldOrderIndex = movedStep.order_index
    
    // Update order indices for affected steps
    for (const step of steps) {
      if (step.id === movedStepId) {
        step.order_index = newOrderIndex
      } else if (newOrderIndex > oldOrderIndex) {
        // Moving down: shift steps up
        if (step.order_index > oldOrderIndex && step.order_index <= newOrderIndex) {
          step.order_index -= 1
        }
      } else {
        // Moving up: shift steps down
        if (step.order_index >= newOrderIndex && step.order_index < oldOrderIndex) {
          step.order_index += 1
        }
      }
      
      // Save each updated step
      if (step.order_index !== step.original_order) {
        const fullStep = await getStepFromStorage(step.id)
        if (fullStep) {
          fullStep.order_index = step.order_index
          fullStep.updated_at = new Date().toISOString()
          await saveStepToStorage(fullStep)
        }
      }
    }
    
    // Update the index
    await updateStepsIndex()
    
  } catch (error) {
    console.error('Error reordering steps:', error)
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
      ).map(step => ({ ...step, original_order: step.order_index }))
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
