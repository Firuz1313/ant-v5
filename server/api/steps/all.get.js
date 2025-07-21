// Enhanced API endpoint for all diagnostic steps with advanced features
export default defineEventHandler(async (event) => {
  // Mock comprehensive steps data with all advanced features
  return [
    // Openbox GOLD - "Закодировано" error steps
    {
      id: 1,
      device_id: 4,
      error_id: 9,
      order_index: 1,
      title: 'Проверить баланс в личном кабинете',
      instruction: 'Сначала проверим ваш баланс в личном кабинете провайдера.',
      tip: 'Перейдите по ссылке в личный кабинет АНТ',
      screen_image: '/images/tv/account_balance.jpg',
      actions: [
        {
          type: 'link',
          url: 'https://ant-personal-cabinet.com',
          description: 'АНТ Личный Кабинет (WEB)',
          hideIP: true
        }
      ],
      highlighted_buttons: [],
      audio_url: '/audio/check_balance.mp3',
      onlyForOperator: false,
      media: {
        type: 'image',
        url: '/images/help/balance_check.jpg',
        description: 'Скриншот личного кабинета'
      },
      created_at: '2024-01-15T10:00:00Z'
    },
    {
      id: 2,
      device_id: 4,
      error_id: 9,
      order_index: 2,
      title: 'Проверить карту доступа',
      instruction: 'Зайдите в Настройки → Карта доступа → Subscription Status',
      tip: 'Если карта не видна — вытащите и вставьте обратно',
      screen_image: '/images/tv/card_access_menu.jpg',
      actions: [
        { buttonId: 'menu', description: 'Нажмите MENU для входа в настройки' },
        { buttonId: 'down', description: 'Перейдите к пункту "Карта доступа"' },
        { buttonId: 'ok', description: 'Подтвердите выбор' }
      ],
      highlighted_buttons: ['menu', 'down', 'ok'],
      audio_url: '/audio/card_access.mp3',
      onlyForOperator: false,
      media: {
        type: 'animation',
        url: '/animations/card_removal.gif',
        description: 'Анимация вытаскивания и вставки карты'
      },
      ifNoResult: {
        nextStepId: 3,
        description: 'Если карта не отображается, выполните следующий шаг'
      },
      userConfirmation: {
        question: 'Карта отображается в меню?',
        options: [
          { text: 'Да, карта видна', action: 'next' },
          { text: 'Нет, карта не отображается', action: 'alternative' }
        ]
      },
      created_at: '2024-01-15T10:05:00Z'
    },
    {
      id: 3,
      device_id: 4,
      error_id: 9,
      order_index: 3,
      title: 'Настройка антенны',
      instruction: 'Если карта активна — нажмите Exit → перейдите в Установка → Установка антенны',
      tip: 'Проверьте правильность настроек спутника',
      screen_image: '/images/tv/antenna_settings.jpg',
      actions: [
        { buttonId: 'exit', description: 'Нажмите EXIT для выхода' },
        { buttonId: 'menu', description: 'Войдите в MENU' },
        { buttonId: 'down', description: 'Найдите "Установка"' },
        { buttonId: 'ok', description: 'Выберите "Установка антенны"' }
      ],
      highlighted_buttons: ['exit', 'menu', 'down', 'ok'],
      audio_url: '/audio/antenna_setup.mp3',
      onlyForOperator: false,
      validation: {
        satellite: '1/15 Express 80',
        lnbPower: '18v',
        frequency: 'Universal 9750/10600'
      },
      created_at: '2024-01-15T10:10:00Z'
    },
    
    // Operator-only step example
    {
      id: 4,
      device_id: 4,
      error_id: 9,
      order_index: 4,
      title: 'Расширенная диагностика сигнала',
      instruction: 'Проведите детальную проверку уровня и качества сигнала с дополнительными параметрами',
      tip: 'Этот шаг доступен только для операторов службы поддержки',
      screen_image: '/images/tv/advanced_signal.jpg',
      actions: [
        { buttonId: 'info', description: 'Нажмите INFO 5 раз для расширенной информации' },
        { buttonId: 'menu', description: 'Войдите в сервисное меню' },
        { buttonId: 'num-9', description: 'Введ��те код 9999' },
        { buttonId: 'ok', description: 'Подтвердите вход' }
      ],
      highlighted_buttons: ['info', 'menu', 'num-9', 'ok'],
      audio_url: '/audio/advanced_diagnostics.mp3',
      onlyForOperator: true,
      validation: {
        signalLevel: { min: 10, max: 90 },
        signalQuality: { min: 10, max: 90 },
        errorRate: { max: 5 }
      },
      ifNoResult: {
        nextStepId: 6,
        description: 'Если параметры не в норме, перейдите к сбросу настроек'
      },
      created_at: '2024-01-15T10:15:00Z'
    },

    // Openbox GOLD - "Нет сигнала" error steps
    {
      id: 5,
      device_id: 4,
      error_id: 10,
      order_index: 1,
      title: 'Проверка источника сигнала на ТВ',
      instruction: 'Нажмите кнопку Input или Source на телевизоре, переключайте HDMI пока не появится изображение',
      tip: 'Возможно ТВ показывает неправильный вход',
      screen_image: '/images/tv/blue_screen.jpg',
      actions: [
        {
          type: 'tv_action',
          description: 'Нажмите INPUT/SOURCE на телевизоре',
          target: 'tv_remote'
        }
      ],
      highlighted_buttons: [],
      audio_url: '/audio/check_tv_input.mp3',
      onlyForOperator: false,
      media: {
        type: 'video',
        url: '/videos/tv_input_switching.mp4',
        description: 'Видео-инструкция по переключению входов'
      },
      userConfirmation: {
        question: 'Появилось ли изображение после переключения входов?',
        options: [
          { text: 'Да, изображение появилось', action: 'completion_success' },
          { text: 'Нет, изображение не появилось', action: 'next' }
        ]
      },
      created_at: '2024-01-15T11:00:00Z'
    },
    {
      id: 6,
      device_id: 4,
      error_id: 10,
      order_index: 2,
      title: 'Проверка качества сигнала',
      instruction: 'Нажмите 3 раза кнопку INFO на пульте приставки',
      tip: 'Появится экран с показателями Качество / Уровень',
      screen_image: '/images/tv/signal_info.jpg',
      actions: [
        { buttonId: 'info', description: 'Нажмите INFO первый раз' },
        { buttonId: 'info', description: 'Нажмите INFO второй раз' },
        { buttonId: 'info', description: 'Нажмите INFO третий раз' }
      ],
      highlighted_buttons: ['info'],
      audio_url: '/audio/check_signal.mp3',
      onlyForOperator: false,
      validation: {
        signalLevel: { min: 10, max: 90 },
        signalQuality: { min: 10, max: 90 }
      },
      progress: true,
      ifNoResult: {
        nextStepId: 7,
        description: 'Если уровень сигнала 5% или 95%, переходите к переподключению кабеля'
      },
      created_at: '2024-01-15T11:05:00Z'
    },

    // Alternative step for cable reconnection
    {
      id: 7,
      device_id: 4,
      error_id: 10,
      order_index: 3,
      title: 'Переподключение кабеля',
      instruction: 'Уровень сигнала 5% или 95% указывает на проблему с кабелем. Отсоедините и подключите кабель заново',
      tip: 'Убедитесь, что кабель плотно зафиксирован',
      screen_image: '/images/tv/cable_reconnect.jpg',
      actions: [],
      highlighted_buttons: [],
      audio_url: '/audio/reconnect_cable.mp3',
      onlyForOperator: false,
      media: {
        type: 'animation',
        url: '/animations/cable_reconnection.gif',
        description: 'Анимация отсоединения и подключения кабеля'
      },
      userConfirmation: {
        question: 'Проблема решена после переподключения кабеля?',
        options: [
          { text: 'Да, сигнал появился', action: 'completion_success' },
          { text: 'Нет, проблема осталась', action: 'next' }
        ]
      },
      created_at: '2024-01-15T11:10:00Z'
    },

    // Steps for other devices (simplified examples)
    {
      id: 8,
      device_id: 1,
      error_id: 1,
      order_index: 1,
      title: 'Проверка подключения кабелей',
      instruction: 'Убедитесь, что все кабели подключены правильно',
      tip: 'Проверьте антенный кабель и HDMI',
      screen_image: '/images/tv/check_cables.jpg',
      actions: [
        { buttonId: 'power', description: 'Включите приставку' }
      ],
      highlighted_buttons: ['power'],
      audio_url: null,
      onlyForOperator: false,
      created_at: '2024-01-15T09:00:00Z'
    },
    {
      id: 9,
      device_id: 2,
      error_id: 5,
      order_index: 1,
      title: 'Проверка HDBOX сигнала',
      instruction: 'Проверьте индикаторы на передней панели HDBOX',
      tip: 'Зеленый индикатор означает хороший сигнал',
      screen_image: '/images/tv/hdbox_indicators.jpg',
      actions: [
        { buttonId: 'info', description: 'Нажмите INFO для проверки' }
      ],
      highlighted_buttons: ['info'],
      audio_url: null,
      onlyForOperator: false,
      created_at: '2024-01-15T09:30:00Z'
    },
    {
      id: 10,
      device_id: 3,
      error_id: 7,
      order_index: 1,
      title: 'Перезагрузка UCLAN',
      instruction: 'Выполните перезагрузку приставки UCLAN',
      tip: 'Отключите питание на 10 секунд',
      screen_image: '/images/tv/uclan_reboot.jpg',
      actions: [
        { buttonId: 'power', description: 'Удерживайте POWER 5 секунд' }
      ],
      highlighted_buttons: ['power'],
      audio_url: null,
      onlyForOperator: false,
      userConfirmation: {
        question: 'Приставка перезагрузилась?',
        options: [
          { text: 'Да', action: 'next' },
          { text: 'Нет', action: 'alternative' }
        ]
      },
      created_at: '2024-01-15T08:00:00Z'
    }
  ]
})
