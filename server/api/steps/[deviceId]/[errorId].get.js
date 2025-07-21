// Enhanced API endpoint for diagnostic steps with advanced features
export default defineEventHandler(async (event) => {
  const deviceId = getRouterParam(event, 'deviceId')
  const errorId = getRouterParam(event, 'errorId')
  
  // Enhanced steps data structure
  const allSteps = {
    // Openbox GOLD - "Закодировано" error (ID: 9)
    '4_9': [
      {
        id: 1,
        error_id: 9,
        order_index: 1,
        title: 'Проверить баланс в личном кабинете',
        instruction: 'Сначала проверим ваш баланс в личном кабинете провайдера.',
        tip: 'Перейдите по ссылке в личный кабинет АНТ',
        screen_image: '/images/tv/account_balance.jpg',
        highlighted_buttons: [],
        actions: [
          {
            type: 'link',
            url: 'https://ant-personal-cabinet.com',
            description: 'АНТ Личный Кабинет (WEB)',
            hideIP: true
          }
        ],
        audio_url: '/audio/check_balance.mp3',
        onlyForOperator: false,
        media: {
          type: 'image',
          url: '/images/help/balance_check.jpg'
        },
        nextIfSuccess: 2,
        nextIfFailed: 2
      },
      {
        id: 2,
        error_id: 9,
        order_index: 2,
        title: 'Проверить карту доступа',
        instruction: 'Зайдите в Настройки → Карта доступа → Subscription Status',
        tip: 'Если карта не видна — вытащите и вставьте обратно',
        screen_image: '/images/tv/card_access_menu.jpg',
        highlighted_buttons: ['menu', 'ok'],
        actions: [
          { buttonId: 'menu', description: 'Нажмите MENU для входа в настройки' },
          { buttonId: 'down', description: 'Перейдите к пункту "Карта доступа"' },
          { buttonId: 'ok', description: '��одтвердите выбор' }
        ],
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
        nextIfSuccess: 3,
        nextIfFailed: 'card_troubleshoot'
      },
      {
        id: 3,
        error_id: 9,
        order_index: 3,
        title: 'Настройка антенны',
        instruction: 'Если карта активна — нажмите Exit → перейдите в Установка → Установка антенны',
        tip: 'Проверьте правильность настроек спутника',
        screen_image: '/images/tv/antenna_settings.jpg',
        highlighted_buttons: ['exit', 'menu', 'ok'],
        actions: [
          { buttonId: 'exit', description: 'Нажмите EXIT для выхода' },
          { buttonId: 'menu', description: 'Войдите в MENU' },
          { buttonId: 'down', description: 'Найдите "Уста��овка"' },
          { buttonId: 'ok', description: 'Выберите "Установка антенны"' }
        ],
        audio_url: '/audio/antenna_setup.mp3',
        onlyForOperator: false,
        validation: {
          satellite: '1/15 Express 80',
          lnbPower: '18v',
          frequency: 'Universal 9750/10600'
        },
        nextIfSuccess: 4,
        nextIfFailed: 'antenna_troubleshoot'
      },
      {
        id: 4,
        error_id: 9,
        order_index: 4,
        title: 'Запуск поиска каналов',
        instruction: 'Начните поиск каналов: нажмите ОК, затем снова ОК для подтверждения',
        tip: 'Поиск может занять несколько минут',
        screen_image: '/images/tv/channel_search.jpg',
        highlighted_buttons: ['ok'],
        actions: [
          { buttonId: 'ok', description: 'Нажмите ОК для начала поиска' },
          { buttonId: 'ok', description: 'Подтвердите поиск повторным нажатием ОК' }
        ],
        audio_url: '/audio/channel_search.mp3',
        onlyForOperator: false,
        progress: true,
        nextIfSuccess: 5,
        nextIfFailed: 'search_troubleshoot'
      },
      {
        id: 5,
        error_id: 9,
        order_index: 5,
        title: 'Проверка результата',
        instruction: 'После завершения поиска проверьте, работают ли каналы',
        tip: 'Переключите несколько каналов для проверки',
        screen_image: '/images/tv/channels_working.jpg',
        highlighted_buttons: ['ch-up', 'ch-down'],
        actions: [
          { buttonId: 'ch-up', description: 'Переключите канал вверх' },
          { buttonId: 'ch-down', description: 'Переключите канал вниз' }
        ],
        audio_url: '/audio/test_channels.mp3',
        onlyForOperator: false,
        completion: {
          success: {
            title: '✅ Проблема решена',
            description: 'Каналы работают корректно!'
          },
          failure: {
            title: '❗ Проблема не решена',
            description: 'Выберите дальнейшие действия',
            options: [
              { text: 'Повторить диагностику', action: 'restart' },
              { text: 'Другая ошибка', action: 'select_error' },
              { text: 'Другая модель', action: 'select_device' },
              { text: 'Вызвать мастера', action: 'call_master' }
            ]
          }
        }
      }
    ],
    
    // Openbox GOLD - "Нет сигнала" error (ID: 10)
    '4_10': [
      {
        id: 6,
        error_id: 10,
        order_index: 1,
        title: 'Проверка источника сигнала на ТВ',
        instruction: 'Нажмите кнопку Input или Source на телевизоре, переключайте HDMI пока не появится изображение',
        tip: 'Возможно ТВ показывает неправильный вход',
        screen_image: '/images/tv/blue_screen.jpg',
        highlighted_buttons: [],
        actions: [
          {
            type: 'tv_action',
            description: 'Нажмите INPUT/SOURCE на телевизоре',
            target: 'tv_remote'
          }
        ],
        audio_url: '/audio/check_tv_input.mp3',
        onlyForOperator: false,
        scenarios: [
          {
            condition: 'blue_black_screen',
            description: 'Если на ТВ синий/чёрный экран'
          }
        ],
        ifNoResult: {
          nextStepId: 7,
          description: 'Если изображение не появилось, проверим сигнал приставки'
        },
        nextIfSuccess: 'completion_success',
        nextIfFailed: 7
      },
      {
        id: 7,
        error_id: 10,
        order_index: 2,
        title: 'Проверка качества сигнала',
        instruction: 'Нажмите 3 раза кнопку INFO на пульте приставки',
        tip: 'Появится экран с показателями Качество / Уровень',
        screen_image: '/images/tv/signal_info.jpg',
        highlighted_buttons: ['info'],
        actions: [
          { buttonId: 'info', description: 'Нажмите INFO' },
          { buttonId: 'info', description: 'Нажмите INFO второй раз' },
          { buttonId: 'info', description: 'Нажмите INFO третий раз' }
        ],
        audio_url: '/audio/check_signal.mp3',
        onlyForOperator: false,
        validation: {
          signalLevel: { min: 10, max: 90 },
          signalQuality: { min: 10, max: 90 }
        },
        conditionalLogic: {
          if: 'signal_level_5_or_95',
          then: 8,
          else: 9
        },
        nextIfSuccess: 8,
        nextIfFailed: 8
      },
      {
        id: 8,
        error_id: 10,
        order_index: 3,
        title: 'Переподключение кабеля',
        instruction: 'Уровень сигнала 5% или 95% указывает на проблему с кабелем. Отсоедините и подключите кабель заново',
        tip: 'Убедитесь, что кабель плотно зафиксирован',
        screen_image: '/images/tv/cable_reconnect.jpg',
        highlighted_buttons: [],
        actions: [],
        audio_url: '/audio/reconnect_cable.mp3',
        onlyForOperator: false,
        media: {
          type: 'animation',
          url: '/animations/cable_reconnection.gif',
          description: 'Анимация отсоединения и подключения кабеля'
        },
        userConfirmation: {
          question: 'Проблема решена?',
          options: [
            { text: 'Да, сигнал появился', action: 'completion_success' },
            { text: 'Нет, проблема осталась', action: 9 }
          ]
        },
        nextIfSuccess: 'completion_success',
        nextIfFailed: 9
      },
      {
        id: 9,
        error_id: 10,
        order_index: 4,
        title: 'Настройка антенны',
        instruction: 'Перейдите в Установка → Установка антенны и проверьте параметры',
        tip: 'Проверьте правильность настроек спутника',
        screen_image: '/images/tv/antenna_settings.jpg',
        highlighted_buttons: ['menu', 'ok'],
        actions: [
          { buttonId: 'menu', description: 'Войдите в MENU' },
          { buttonId: 'down', description: 'Найдите "Установка"' },
          { buttonId: 'ok', description: 'Выберите "Установка антенны"' }
        ],
        audio_url: '/audio/antenna_setup.mp3',
        onlyForOperator: false,
        validation: {
          satellite: '1/15 Express 80',
          lnbPower: '18v',
          frequency: 'Universal 9750/10600'
        },
        userConfirmation: {
          question: 'Параметры настроены правильно?',
          options: [
            { text: 'Да, всё верно', action: 10 },
            { text: 'Нет, нужна помощь', action: 'call_master' }
          ]
        },
        nextIfSuccess: 10,
        nextIfFailed: 'call_master'
      },
      {
        id: 10,
        error_id: 10,
        order_index: 5,
        title: 'Финальная проверка',
        instruction: 'Если настройки верны, но проблема остаётся — потребуется вызов мастера',
        tip: 'Возможна неисправность оборудования или антенны',
        screen_image: '/images/tv/master_call.jpg',
        highlighted_buttons: [],
        actions: [],
        audio_url: '/audio/master_call.mp3',
        onlyForOperator: false,
        completion: {
          failure: {
            title: '🚫 Проблема не решена',
            description: 'Мы приняли заявку, мастер скоро прибудет',
            action: {
              type: 'submit_request',
              buttonText: 'Подать заявку',
              endpoint: '/api/master-request'
            }
          }
        }
      }
    ]
  }
  
  const key = `${deviceId}_${errorId}`
  return allSteps[key] || []
})
