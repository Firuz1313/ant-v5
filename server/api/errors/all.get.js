// API endpoint for all errors across all devices
export default defineEventHandler(async (event) => {
  // Mock comprehensive errors data
  return [
    // Openbox (ID: 1)
    {
      id: 1,
      device_id: 1,
      title: 'Нет сигнала',
      description: 'На экране отображается "Нет сигнала"',
      icon: '📵',
      severity: 'high',
      created_at: '2024-01-10T10:00:00Z'
    },
    {
      id: 2,
      device_id: 1,
      title: 'Нет звука',
      description: 'Изображение есть, но звук отсутствует',
      icon: '🔇',
      severity: 'medium',
      created_at: '2024-01-10T10:05:00Z'
    },
    {
      id: 3,
      device_id: 1,
      title: 'Плохое качество',
      description: 'Изображение нечёткое или с помехами',
      icon: '📺',
      severity: 'medium',
      created_at: '2024-01-10T10:10:00Z'
    },
    {
      id: 4,
      device_id: 1,
      title: 'Не включается',
      description: 'Приставка не реагирует на пульт',
      icon: '🔌',
      severity: 'high',
      created_at: '2024-01-10T10:15:00Z'
    },
    
    // HDBOX (ID: 2)
    {
      id: 5,
      device_id: 2,
      title: 'Нет сигнала',
      description: 'На экране отображается "Нет сигнала"',
      icon: '📵',
      severity: 'high',
      created_at: '2024-01-10T11:00:00Z'
    },
    {
      id: 6,
      device_id: 2,
      title: 'Проблемы с записью',
      description: 'Не записывает программы',
      icon: '💾',
      severity: 'medium',
      created_at: '2024-01-10T11:05:00Z'
    },
    {
      id: 7,
      device_id: 2,
      title: 'Медленная загрузка',
      description: 'Каналы переключаются медленно',
      icon: '⏳',
      severity: 'low',
      created_at: '2024-01-10T11:10:00Z'
    },
    
    // UCLAN (ID: 3)
    {
      id: 8,
      device_id: 3,
      title: 'Нет сигнала',
      description: 'На экране отображается "Нет сигнала"',
      icon: '📵',
      severity: 'high',
      created_at: '2024-01-10T12:00:00Z'
    },
    {
      id: 9,
      device_id: 3,
      title: 'Медленная работа',
      description: 'Приставка работает медленно',
      icon: '🐌',
      severity: 'medium',
      created_at: '2024-01-10T12:05:00Z'
    },
    {
      id: 10,
      device_id: 3,
      title: 'Зависает',
      description: 'Приставка периодически зависает',
      icon: '❄️',
      severity: 'medium',
      created_at: '2024-01-10T12:10:00Z'
    },
    
    // Openbox GOLD (ID: 4)
    {
      id: 11,
      device_id: 4,
      title: 'Закодировано',
      description: 'Каналы показывают сообщение "Закодировано"',
      icon: '🔒',
      severity: 'high',
      created_at: '2024-01-10T13:00:00Z'
    },
    {
      id: 12,
      device_id: 4,
      title: 'Нет сигнала',
      description: 'На экране ТВ синий/чёрный экран или "Нет сигнала"',
      icon: '📵',
      severity: 'high',
      created_at: '2024-01-10T13:05:00Z'
    },
    {
      id: 13,
      device_id: 4,
      title: 'Нет звука',
      description: 'Изображение есть, но звук отсутствует',
      icon: '🔇',
      severity: 'medium',
      created_at: '2024-01-10T13:10:00Z'
    },
    {
      id: 14,
      device_id: 4,
      title: 'Плохое качество',
      description: 'Изображение нечёткое или с помехами',
      icon: '📺',
      severity: 'medium',
      created_at: '2024-01-10T13:15:00Z'
    },
    {
      id: 15,
      device_id: 4,
      title: 'Интернет не работает',
      description: 'Не загружаются онлайн-сервисы',
      icon: '🌐',
      severity: 'low',
      created_at: '2024-01-10T13:20:00Z'
    }
  ]
})
