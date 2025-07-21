// Mock API endpoint for diagnostic steps
export default defineEventHandler(async (event) => {
  const deviceId = getRouterParam(event, 'deviceId')
  const errorId = getRouterParam(event, 'errorId')
  
  // Mock steps data
  return [
    {
      id: 1,
      error_id: parseInt(errorId),
      order_index: 1,
      title: 'Проверка подключения',
      instruction: 'Убедитесь, что все кабели подключены правильно. Нажмите кнопку POWER на пульте.',
      tip: 'Проверьте, что антенный кабель плотно подключен к приставке.',
      screen_image: null,
      highlighted_button: 'power',
      audio_url: null
    },
    {
      id: 2,
      error_id: parseInt(errorId),
      order_index: 2,
      title: 'Проверка источника сигнала',
      instruction: 'Нажмите кнопку SOURCE или INPUT на пульте для выбора правильного источника сигнала.',
      tip: 'Выберите тот же источник, к которому подключена ваша приставка.',
      screen_image: null,
      highlighted_button: 'source',
      audio_url: null
    },
    {
      id: 3,
      error_id: parseInt(errorId),
      order_index: 3,
      title: 'Поиск каналов',
      instruction: 'Нажмите кнопку MENU и найдите раздел "Поиск каналов" или "Автопоиск".',
      tip: 'Автопоиск может занять несколько минут.',
      screen_image: null,
      highlighted_button: 'menu',
      audio_url: null
    },
    {
      id: 4,
      error_id: parseInt(errorId),
      order_index: 4,
      title: 'Проверка результата',
      instruction: 'После завершения поиска каналов проверьте, появился ли сигнал.',
      tip: 'Если проблема не решена, попробуйте перезагрузить приставку.',
      screen_image: null,
      highlighted_button: null,
      audio_url: null
    }
  ]
})
