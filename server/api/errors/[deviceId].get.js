// Mock API endpoint for errors by device
export default defineEventHandler(async (event) => {
  const deviceId = getRouterParam(event, 'deviceId')
  
  // Mock errors data
  const allErrors = [
    // Openbox (ID: 1)
    {
      id: 1,
      device_id: 1,
      title: 'Нет сигнала',
      description: 'На экране отображается "Нет сигнала"',
      icon: '📵'
    },
    {
      id: 2,
      device_id: 1,
      title: 'Нет звука',
      description: 'Изображение есть, но звук отсутствует',
      icon: '🔇'
    },
    {
      id: 3,
      device_id: 1,
      title: 'Плохое качество',
      description: 'Изображение нечёткое или с помехами',
      icon: '📺'
    },
    {
      id: 4,
      device_id: 1,
      title: 'Не включается',
      description: 'Приставка не реагирует на пульт',
      icon: '🔌'
    },
    
    // HDBOX (ID: 2)
    {
      id: 5,
      device_id: 2,
      title: 'Нет сигнала',
      description: 'На экране отображается "Нет сигнала"',
      icon: '📵'
    },
    {
      id: 6,
      device_id: 2,
      title: 'Проблемы с записью',
      description: 'Не записывает программы',
      icon: '💾'
    },
    
    // UCLAN (ID: 3)
    {
      id: 7,
      device_id: 3,
      title: 'Нет сигнала',
      description: 'На экране отображается "Нет сигнала"',
      icon: '📵'
    },
    {
      id: 8,
      device_id: 3,
      title: 'Медленная работа',
      description: 'Приставка работает медленно',
      icon: '🐌'
    },
    
    // Openbox GOLD (ID: 4)
    {
      id: 9,
      device_id: 4,
      title: 'Закодировано',
      description: 'Каналы показывают сообщение "Закодировано"',
      icon: '🔒',
      severity: 'high'
    },
    {
      id: 10,
      device_id: 4,
      title: 'Нет сигнала',
      description: 'На экране ТВ синий/чёрный экран или "Нет сигнала"',
      icon: '📵',
      severity: 'high'
    },
    {
      id: 11,
      device_id: 4,
      title: 'Нет звука',
      description: 'Изображение есть, но звук отсутствует',
      icon: '🔇',
      severity: 'medium'
    },
    {
      id: 12,
      device_id: 4,
      title: 'Плохое качество',
      description: 'Изображение нечёткое или с помехами',
      icon: '📺',
      severity: 'medium'
    }
  ]
  
  return allErrors.filter(error => error.device_id == deviceId)
})
