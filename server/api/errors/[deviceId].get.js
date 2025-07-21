// Mock API endpoint for errors by device
export default defineEventHandler(async (event) => {
  const deviceId = getRouterParam(event, 'deviceId')
  
  // Mock errors data
  const allErrors = [
    {
      id: 1,
      device_id: 1,
      title: 'Нет сигнала',
      description: 'На экране отображается "Нет сигнала"'
    },
    {
      id: 2,
      device_id: 1,
      title: 'Нет звука',
      description: 'Изображение есть, но звук отсутствует'
    },
    {
      id: 3,
      device_id: 1,
      title: 'Плохое качество',
      description: 'Изображе��ие нечёткое или с помехами'
    },
    {
      id: 4,
      device_id: 1,
      title: 'Не включается',
      description: 'Приставка не реагирует на пульт'
    }
  ]
  
  return allErrors.filter(error => error.device_id == deviceId)
})
