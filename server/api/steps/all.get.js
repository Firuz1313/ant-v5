export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const deviceId = query.device_id
    const errorId = query.error_id
    const operatorMode = query.operator_mode === 'true'
    
    // Get all steps from storage
    const allSteps = await getAllStepsFromStorage()
    
    // Filter steps based on query parameters
    let filteredSteps = allSteps
    
    if (deviceId) {
      filteredSteps = filteredSteps.filter(step => step.device_id == deviceId)
    }
    
    if (errorId) {
      filteredSteps = filteredSteps.filter(step => step.error_id == errorId)
    }
    
    // Filter operator-only steps if not in operator mode
    if (!operatorMode) {
      filteredSteps = filteredSteps.filter(step => !step.onlyForOperator)
    }
    
    // Sort by order index
    filteredSteps.sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
    
    return filteredSteps

  } catch (error) {
    console.error('Error getting all steps:', error)
    
    // Return mock data if storage fails
    return generateMockSteps()
  }
})

// Helper function to get all steps from storage
async function getAllStepsFromStorage() {
  const fs = await import('fs').then(m => m.promises)
  const path = await import('path')
  
  try {
    const storageDir = path.join(process.cwd(), 'data', 'steps')
    
    // Check if directory exists
    try {
      await fs.access(storageDir)
    } catch (error) {
      // Directory doesn't exist, return empty array
      return []
    }
    
    const files = await fs.readdir(storageDir)
    const steps = []
    
    for (const file of files) {
      if (file.endsWith('.json') && file !== 'index.json') {
        try {
          const stepData = await fs.readFile(path.join(storageDir, file), 'utf8')
          const step = JSON.parse(stepData)
          steps.push(step)
        } catch (error) {
          console.error(`Error reading step file ${file}:`, error)
        }
      }
    }
    
    return steps
    
  } catch (error) {
    console.error('Error getting all steps from storage:', error)
    return []
  }
}

// Mock data generator for fallback
function generateMockSteps() {
  return [
    {
      id: 'mock_step_1',
      device_id: '4',
      error_id: '1',
      order_index: 1,
      title: 'Проверка подключения питания',
      instruction: 'Убедитесь, что приставка подключена к электросети и на ней горит индикатор питания.',
      tip: 'Индикатор обычно расположен на передней панели и светится красным или зеленым цветом.',
      screen_image: null,
      audio_url: null,
      highlighted_buttons: ['power'],
      actions: [
        {
          buttonId: 'power',
          description: 'Нажмите кнопку питания на пульте'
        }
      ],
      onlyForOperator: false,
      critical: false,
      userConfirmation: null,
      ifNoResult: null,
      validation: null,
      media: null,
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 'mock_step_2',
      device_id: '4',
      error_id: '1',
      order_index: 2,
      title: 'Проверка подключения антенного кабеля',
      instruction: 'Проверьте, что антенный кабель надежно подключен к разъему LNB IN на приставке.',
      tip: 'Разъем LNB IN обычно находится на задней панели приставки.',
      screen_image: null,
      audio_url: null,
      highlighted_buttons: [],
      actions: [],
      onlyForOperator: false,
      critical: true,
      userConfirmation: {
        question: 'Кабель подключен надежно?',
        options: [
          { text: 'Да, кабель подключен', action: 'next' },
          { text: 'Нет, кабель отсоединен', action: 'call_master' }
        ]
      },
      ifNoResult: null,
      validation: null,
      media: null,
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 'mock_step_3',
      device_id: '4',
      error_id: '1',
      order_index: 3,
      title: 'Проверка уровня сигнала',
      instruction: 'Нажмите кнопку INFO на пульте для отображения информации о сигнале.',
      tip: 'Уровень сигнала должен быть не менее 60% для стабильной работы.',
      screen_image: null,
      audio_url: null,
      highlighted_buttons: ['info'],
      actions: [
        {
          buttonId: 'info',
          description: 'Нажмите кнопку INFO'
        }
      ],
      onlyForOperator: false,
      critical: false,
      userConfirmation: null,
      ifNoResult: {
        nextStepId: 5
      },
      validation: {
        signalLevel: true,
        signalQuality: true
      },
      media: null,
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 'mock_step_4',
      device_id: '4',
      error_id: '1',
      order_index: 4,
      title: 'Автопоиск каналов',
      instruction: 'Запустите автопоиск каналов через меню настроек приставки.',
      tip: 'Процесс поиска может занять до 10 минут.',
      screen_image: null,
      audio_url: null,
      highlighted_buttons: ['menu', 'ok'],
      actions: [
        {
          buttonId: 'menu',
          description: 'Откройте главное меню'
        },
        {
          buttonId: 'ok',
          description: 'Выберите "Поиск каналов"'
        }
      ],
      onlyForOperator: false,
      critical: false,
      userConfirmation: null,
      ifNoResult: null,
      validation: null,
      progress: {
        type: 'search',
        estimatedTime: 600
      },
      media: null,
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 'mock_step_5',
      device_id: '4',
      error_id: '1',
      order_index: 5,
      title: 'Настройка антенны (для операторов)',
      instruction: 'Выполните тонкую настройку положения антенны для улучшения качества сигнала.',
      tip: 'Используйте профессиональный измеритель сигнала для точной настройки.',
      screen_image: null,
      audio_url: null,
      highlighted_buttons: [],
      actions: [],
      onlyForOperator: true,
      critical: false,
      userConfirmation: null,
      ifNoResult: null,
      validation: {
        signalLevel: true,
        signalQuality: true
      },
      media: null,
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 'mock_step_6',
      device_id: '4',
      error_id: '2',
      order_index: 1,
      title: 'Проверка баланса карты',
      instruction: 'Убедитесь, что на карте доступа достаточно средств для просмотра каналов.',
      tip: 'Информация о балансе отображается в разделе "Карта доступа" в меню приставки.',
      screen_image: null,
      audio_url: null,
      highlighted_buttons: ['menu'],
      actions: [
        {
          buttonId: 'menu',
          description: 'Откройте меню и найдите "Карта доступа"'
        }
      ],
      onlyForOperator: false,
      critical: true,
      userConfirmation: {
        question: 'На карте есть достаточно средств?',
        options: [
          { text: 'Да, баланс положительный', action: 'next' },
          { text: 'Нет, нужно пополнить', action: 'completion_success' },
          { text: 'Не могу проверить', action: 'call_master' }
        ]
      },
      ifNoResult: null,
      validation: null,
      media: null,
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-01-01T00:00:00.000Z'
    }
  ]
}
