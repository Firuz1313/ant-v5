import { d as defineEventHandler, a as getRouterParam } from '../../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const _errorId__get = defineEventHandler(async (event) => {
  const deviceId = getRouterParam(event, "deviceId");
  const errorId = getRouterParam(event, "errorId");
  const allSteps = {
    // Openbox GOLD - "Закодировано" error (ID: 9)
    "4_9": [
      {
        id: 1,
        error_id: 9,
        order_index: 1,
        title: "\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u0431\u0430\u043B\u0430\u043D\u0441 \u0432 \u043B\u0438\u0447\u043D\u043E\u043C \u043A\u0430\u0431\u0438\u043D\u0435\u0442\u0435",
        instruction: "\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u043C \u0432\u0430\u0448 \u0431\u0430\u043B\u0430\u043D\u0441 \u0432 \u043B\u0438\u0447\u043D\u043E\u043C \u043A\u0430\u0431\u0438\u043D\u0435\u0442\u0435 \u043F\u0440\u043E\u0432\u0430\u0439\u0434\u0435\u0440\u0430.",
        tip: "\u041F\u0435\u0440\u0435\u0439\u0434\u0438\u0442\u0435 \u043F\u043E \u0441\u0441\u044B\u043B\u043A\u0435 \u0432 \u043B\u0438\u0447\u043D\u044B\u0439 \u043A\u0430\u0431\u0438\u043D\u0435\u0442 \u0410\u041D\u0422",
        screen_image: "/images/tv/account_balance.jpg",
        highlighted_buttons: [],
        actions: [
          {
            type: "link",
            url: "https://ant-personal-cabinet.com",
            description: "\u0410\u041D\u0422 \u041B\u0438\u0447\u043D\u044B\u0439 \u041A\u0430\u0431\u0438\u043D\u0435\u0442 (WEB)",
            hideIP: true
          }
        ],
        audio_url: "/audio/check_balance.mp3",
        onlyForOperator: false,
        media: {
          type: "image",
          url: "/images/help/balance_check.jpg"
        },
        nextIfSuccess: 2,
        nextIfFailed: 2
      },
      {
        id: 2,
        error_id: 9,
        order_index: 2,
        title: "\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u043A\u0430\u0440\u0442\u0443 \u0434\u043E\u0441\u0442\u0443\u043F\u0430",
        instruction: "\u0417\u0430\u0439\u0434\u0438\u0442\u0435 \u0432 \u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u2192 \u041A\u0430\u0440\u0442\u0430 \u0434\u043E\u0441\u0442\u0443\u043F\u0430 \u2192 Subscription Status",
        tip: "\u0415\u0441\u043B\u0438 \u043A\u0430\u0440\u0442\u0430 \u043D\u0435 \u0432\u0438\u0434\u043D\u0430 \u2014 \u0432\u044B\u0442\u0430\u0449\u0438\u0442\u0435 \u0438 \u0432\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u043E\u0431\u0440\u0430\u0442\u043D\u043E",
        screen_image: "/images/tv/card_access_menu.jpg",
        highlighted_buttons: ["menu", "ok"],
        actions: [
          { buttonId: "menu", description: "\u041D\u0430\u0436\u043C\u0438\u0442\u0435 MENU \u0434\u043B\u044F \u0432\u0445\u043E\u0434\u0430 \u0432 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438" },
          { buttonId: "down", description: '\u041F\u0435\u0440\u0435\u0439\u0434\u0438\u0442\u0435 \u043A \u043F\u0443\u043D\u043A\u0442\u0443 "\u041A\u0430\u0440\u0442\u0430 \u0434\u043E\u0441\u0442\u0443\u043F\u0430"' },
          { buttonId: "ok", description: "\uFFFD\uFFFD\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u0435 \u0432\u044B\u0431\u043E\u0440" }
        ],
        audio_url: "/audio/card_access.mp3",
        onlyForOperator: false,
        media: {
          type: "animation",
          url: "/animations/card_removal.gif",
          description: "\u0410\u043D\u0438\u043C\u0430\u0446\u0438\u044F \u0432\u044B\u0442\u0430\u0441\u043A\u0438\u0432\u0430\u043D\u0438\u044F \u0438 \u0432\u0441\u0442\u0430\u0432\u043A\u0438 \u043A\u0430\u0440\u0442\u044B"
        },
        ifNoResult: {
          nextStepId: 3,
          description: "\u0415\u0441\u043B\u0438 \u043A\u0430\u0440\u0442\u0430 \u043D\u0435 \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u0435\u0442\u0441\u044F, \u0432\u044B\u043F\u043E\u043B\u043D\u0438\u0442\u0435 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \u0448\u0430\u0433"
        },
        nextIfSuccess: 3,
        nextIfFailed: "card_troubleshoot"
      },
      {
        id: 3,
        error_id: 9,
        order_index: 3,
        title: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430 \u0430\u043D\u0442\u0435\u043D\u043D\u044B",
        instruction: "\u0415\u0441\u043B\u0438 \u043A\u0430\u0440\u0442\u0430 \u0430\u043A\u0442\u0438\u0432\u043D\u0430 \u2014 \u043D\u0430\u0436\u043C\u0438\u0442\u0435 Exit \u2192 \u043F\u0435\u0440\u0435\u0439\u0434\u0438\u0442\u0435 \u0432 \u0423\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0430 \u2192 \u0423\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0430 \u0430\u043D\u0442\u0435\u043D\u043D\u044B",
        tip: "\u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u043E\u0441\u0442\u044C \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043A \u0441\u043F\u0443\u0442\u043D\u0438\u043A\u0430",
        screen_image: "/images/tv/antenna_settings.jpg",
        highlighted_buttons: ["exit", "menu", "ok"],
        actions: [
          { buttonId: "exit", description: "\u041D\u0430\u0436\u043C\u0438\u0442\u0435 EXIT \u0434\u043B\u044F \u0432\u044B\u0445\u043E\u0434\u0430" },
          { buttonId: "menu", description: "\u0412\u043E\u0439\u0434\u0438\u0442\u0435 \u0432 MENU" },
          { buttonId: "down", description: '\u041D\u0430\u0439\u0434\u0438\u0442\u0435 "\u0423\u0441\u0442\u0430\uFFFD\uFFFD\u043E\u0432\u043A\u0430"' },
          { buttonId: "ok", description: '\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 "\u0423\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0430 \u0430\u043D\u0442\u0435\u043D\u043D\u044B"' }
        ],
        audio_url: "/audio/antenna_setup.mp3",
        onlyForOperator: false,
        validation: {
          satellite: "1/15 Express 80",
          lnbPower: "18v",
          frequency: "Universal 9750/10600"
        },
        nextIfSuccess: 4,
        nextIfFailed: "antenna_troubleshoot"
      },
      {
        id: 4,
        error_id: 9,
        order_index: 4,
        title: "\u0417\u0430\u043F\u0443\u0441\u043A \u043F\u043E\u0438\u0441\u043A\u0430 \u043A\u0430\u043D\u0430\u043B\u043E\u0432",
        instruction: "\u041D\u0430\u0447\u043D\u0438\u0442\u0435 \u043F\u043E\u0438\u0441\u043A \u043A\u0430\u043D\u0430\u043B\u043E\u0432: \u043D\u0430\u0436\u043C\u0438\u0442\u0435 \u041E\u041A, \u0437\u0430\u0442\u0435\u043C \u0441\u043D\u043E\u0432\u0430 \u041E\u041A \u0434\u043B\u044F \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u044F",
        tip: "\u041F\u043E\u0438\u0441\u043A \u043C\u043E\u0436\u0435\u0442 \u0437\u0430\u043D\u044F\u0442\u044C \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u043C\u0438\u043D\u0443\u0442",
        screen_image: "/images/tv/channel_search.jpg",
        highlighted_buttons: ["ok"],
        actions: [
          { buttonId: "ok", description: "\u041D\u0430\u0436\u043C\u0438\u0442\u0435 \u041E\u041A \u0434\u043B\u044F \u043D\u0430\u0447\u0430\u043B\u0430 \u043F\u043E\u0438\u0441\u043A\u0430" },
          { buttonId: "ok", description: "\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u0435 \u043F\u043E\u0438\u0441\u043A \u043F\u043E\u0432\u0442\u043E\u0440\u043D\u044B\u043C \u043D\u0430\u0436\u0430\u0442\u0438\u0435\u043C \u041E\u041A" }
        ],
        audio_url: "/audio/channel_search.mp3",
        onlyForOperator: false,
        progress: true,
        nextIfSuccess: 5,
        nextIfFailed: "search_troubleshoot"
      },
      {
        id: 5,
        error_id: 9,
        order_index: 5,
        title: "\u041F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u0430",
        instruction: "\u041F\u043E\u0441\u043B\u0435 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0438\u044F \u043F\u043E\u0438\u0441\u043A\u0430 \u043F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435, \u0440\u0430\u0431\u043E\u0442\u0430\u044E\u0442 \u043B\u0438 \u043A\u0430\u043D\u0430\u043B\u044B",
        tip: "\u041F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0438\u0442\u0435 \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u043A\u0430\u043D\u0430\u043B\u043E\u0432 \u0434\u043B\u044F \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0438",
        screen_image: "/images/tv/channels_working.jpg",
        highlighted_buttons: ["ch-up", "ch-down"],
        actions: [
          { buttonId: "ch-up", description: "\u041F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0438\u0442\u0435 \u043A\u0430\u043D\u0430\u043B \u0432\u0432\u0435\u0440\u0445" },
          { buttonId: "ch-down", description: "\u041F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0438\u0442\u0435 \u043A\u0430\u043D\u0430\u043B \u0432\u043D\u0438\u0437" }
        ],
        audio_url: "/audio/test_channels.mp3",
        onlyForOperator: false,
        completion: {
          success: {
            title: "\u2705 \u041F\u0440\u043E\u0431\u043B\u0435\u043C\u0430 \u0440\u0435\u0448\u0435\u043D\u0430",
            description: "\u041A\u0430\u043D\u0430\u043B\u044B \u0440\u0430\u0431\u043E\u0442\u0430\u044E\u0442 \u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u043E!"
          },
          failure: {
            title: "\u2757 \u041F\u0440\u043E\u0431\u043B\u0435\u043C\u0430 \u043D\u0435 \u0440\u0435\u0448\u0435\u043D\u0430",
            description: "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0434\u0430\u043B\u044C\u043D\u0435\u0439\u0448\u0438\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F",
            options: [
              { text: "\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u044C \u0434\u0438\u0430\u0433\u043D\u043E\u0441\u0442\u0438\u043A\u0443", action: "restart" },
              { text: "\u0414\u0440\u0443\u0433\u0430\u044F \u043E\u0448\u0438\u0431\u043A\u0430", action: "select_error" },
              { text: "\u0414\u0440\u0443\u0433\u0430\u044F \u043C\u043E\u0434\u0435\u043B\u044C", action: "select_device" },
              { text: "\u0412\u044B\u0437\u0432\u0430\u0442\u044C \u043C\u0430\u0441\u0442\u0435\u0440\u0430", action: "call_master" }
            ]
          }
        }
      }
    ],
    // Openbox GOLD - "Нет сигнала" error (ID: 10)
    "4_10": [
      {
        id: 6,
        error_id: 10,
        order_index: 1,
        title: "\u041F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u0438\u0441\u0442\u043E\u0447\u043D\u0438\u043A\u0430 \u0441\u0438\u0433\u043D\u0430\u043B\u0430 \u043D\u0430 \u0422\u0412",
        instruction: "\u041D\u0430\u0436\u043C\u0438\u0442\u0435 \u043A\u043D\u043E\u043F\u043A\u0443 Input \u0438\u043B\u0438 Source \u043D\u0430 \u0442\u0435\u043B\u0435\u0432\u0438\u0437\u043E\u0440\u0435, \u043F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0430\u0439\u0442\u0435 HDMI \u043F\u043E\u043A\u0430 \u043D\u0435 \u043F\u043E\u044F\u0432\u0438\u0442\u0441\u044F \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435",
        tip: "\u0412\u043E\u0437\u043C\u043E\u0436\u043D\u043E \u0422\u0412 \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442 \u043D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u044B\u0439 \u0432\u0445\u043E\u0434",
        screen_image: "/images/tv/blue_screen.jpg",
        highlighted_buttons: [],
        actions: [
          {
            type: "tv_action",
            description: "\u041D\u0430\u0436\u043C\u0438\u0442\u0435 INPUT/SOURCE \u043D\u0430 \u0442\u0435\u043B\u0435\u0432\u0438\u0437\u043E\u0440\u0435",
            target: "tv_remote"
          }
        ],
        audio_url: "/audio/check_tv_input.mp3",
        onlyForOperator: false,
        scenarios: [
          {
            condition: "blue_black_screen",
            description: "\u0415\u0441\u043B\u0438 \u043D\u0430 \u0422\u0412 \u0441\u0438\u043D\u0438\u0439/\u0447\u0451\u0440\u043D\u044B\u0439 \u044D\u043A\u0440\u0430\u043D"
          }
        ],
        ifNoResult: {
          nextStepId: 7,
          description: "\u0415\u0441\u043B\u0438 \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u043D\u0435 \u043F\u043E\u044F\u0432\u0438\u043B\u043E\u0441\u044C, \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u043C \u0441\u0438\u0433\u043D\u0430\u043B \u043F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0438"
        },
        nextIfSuccess: "completion_success",
        nextIfFailed: 7
      },
      {
        id: 7,
        error_id: 10,
        order_index: 2,
        title: "\u041F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u043A\u0430\u0447\u0435\u0441\u0442\u0432\u0430 \u0441\u0438\u0433\u043D\u0430\u043B\u0430",
        instruction: "\u041D\u0430\u0436\u043C\u0438\u0442\u0435 3 \u0440\u0430\u0437\u0430 \u043A\u043D\u043E\u043F\u043A\u0443 INFO \u043D\u0430 \u043F\u0443\u043B\u044C\u0442\u0435 \u043F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0438",
        tip: "\u041F\u043E\u044F\u0432\u0438\u0442\u0441\u044F \u044D\u043A\u0440\u0430\u043D \u0441 \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u0435\u043B\u044F\u043C\u0438 \u041A\u0430\u0447\u0435\u0441\u0442\u0432\u043E / \u0423\u0440\u043E\u0432\u0435\u043D\u044C",
        screen_image: "/images/tv/signal_info.jpg",
        highlighted_buttons: ["info"],
        actions: [
          { buttonId: "info", description: "\u041D\u0430\u0436\u043C\u0438\u0442\u0435 INFO" },
          { buttonId: "info", description: "\u041D\u0430\u0436\u043C\u0438\u0442\u0435 INFO \u0432\u0442\u043E\u0440\u043E\u0439 \u0440\u0430\u0437" },
          { buttonId: "info", description: "\u041D\u0430\u0436\u043C\u0438\u0442\u0435 INFO \u0442\u0440\u0435\u0442\u0438\u0439 \u0440\u0430\u0437" }
        ],
        audio_url: "/audio/check_signal.mp3",
        onlyForOperator: false,
        validation: {
          signalLevel: { min: 10, max: 90 },
          signalQuality: { min: 10, max: 90 }
        },
        conditionalLogic: {
          if: "signal_level_5_or_95",
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
        title: "\u041F\u0435\u0440\u0435\u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u043A\u0430\u0431\u0435\u043B\u044F",
        instruction: "\u0423\u0440\u043E\u0432\u0435\u043D\u044C \u0441\u0438\u0433\u043D\u0430\u043B\u0430 5% \u0438\u043B\u0438 95% \u0443\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442 \u043D\u0430 \u043F\u0440\u043E\u0431\u043B\u0435\u043C\u0443 \u0441 \u043A\u0430\u0431\u0435\u043B\u0435\u043C. \u041E\u0442\u0441\u043E\u0435\u0434\u0438\u043D\u0438\u0442\u0435 \u0438 \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0438\u0442\u0435 \u043A\u0430\u0431\u0435\u043B\u044C \u0437\u0430\u043D\u043E\u0432\u043E",
        tip: "\u0423\u0431\u0435\u0434\u0438\u0442\u0435\u0441\u044C, \u0447\u0442\u043E \u043A\u0430\u0431\u0435\u043B\u044C \u043F\u043B\u043E\u0442\u043D\u043E \u0437\u0430\u0444\u0438\u043A\u0441\u0438\u0440\u043E\u0432\u0430\u043D",
        screen_image: "/images/tv/cable_reconnect.jpg",
        highlighted_buttons: [],
        actions: [],
        audio_url: "/audio/reconnect_cable.mp3",
        onlyForOperator: false,
        media: {
          type: "animation",
          url: "/animations/cable_reconnection.gif",
          description: "\u0410\u043D\u0438\u043C\u0430\u0446\u0438\u044F \u043E\u0442\u0441\u043E\u0435\u0434\u0438\u043D\u0435\u043D\u0438\u044F \u0438 \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u044F \u043A\u0430\u0431\u0435\u043B\u044F"
        },
        userConfirmation: {
          question: "\u041F\u0440\u043E\u0431\u043B\u0435\u043C\u0430 \u0440\u0435\u0448\u0435\u043D\u0430?",
          options: [
            { text: "\u0414\u0430, \u0441\u0438\u0433\u043D\u0430\u043B \u043F\u043E\u044F\u0432\u0438\u043B\u0441\u044F", action: "completion_success" },
            { text: "\u041D\u0435\u0442, \u043F\u0440\u043E\u0431\u043B\u0435\u043C\u0430 \u043E\u0441\u0442\u0430\u043B\u0430\u0441\u044C", action: 9 }
          ]
        },
        nextIfSuccess: "completion_success",
        nextIfFailed: 9
      },
      {
        id: 9,
        error_id: 10,
        order_index: 4,
        title: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430 \u0430\u043D\u0442\u0435\u043D\u043D\u044B",
        instruction: "\u041F\u0435\u0440\u0435\u0439\u0434\u0438\u0442\u0435 \u0432 \u0423\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0430 \u2192 \u0423\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0430 \u0430\u043D\u0442\u0435\u043D\u043D\u044B \u0438 \u043F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u044B",
        tip: "\u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u043E\u0441\u0442\u044C \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043A \u0441\u043F\u0443\u0442\u043D\u0438\u043A\u0430",
        screen_image: "/images/tv/antenna_settings.jpg",
        highlighted_buttons: ["menu", "ok"],
        actions: [
          { buttonId: "menu", description: "\u0412\u043E\u0439\u0434\u0438\u0442\u0435 \u0432 MENU" },
          { buttonId: "down", description: '\u041D\u0430\u0439\u0434\u0438\u0442\u0435 "\u0423\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0430"' },
          { buttonId: "ok", description: '\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 "\u0423\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0430 \u0430\u043D\u0442\u0435\u043D\u043D\u044B"' }
        ],
        audio_url: "/audio/antenna_setup.mp3",
        onlyForOperator: false,
        validation: {
          satellite: "1/15 Express 80",
          lnbPower: "18v",
          frequency: "Universal 9750/10600"
        },
        userConfirmation: {
          question: "\u041F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u044B \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043D\u044B \u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u043E?",
          options: [
            { text: "\u0414\u0430, \u0432\u0441\u0451 \u0432\u0435\u0440\u043D\u043E", action: 10 },
            { text: "\u041D\u0435\u0442, \u043D\u0443\u0436\u043D\u0430 \u043F\u043E\u043C\u043E\u0449\u044C", action: "call_master" }
          ]
        },
        nextIfSuccess: 10,
        nextIfFailed: "call_master"
      },
      {
        id: 10,
        error_id: 10,
        order_index: 5,
        title: "\u0424\u0438\u043D\u0430\u043B\u044C\u043D\u0430\u044F \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0430",
        instruction: "\u0415\u0441\u043B\u0438 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0432\u0435\u0440\u043D\u044B, \u043D\u043E \u043F\u0440\u043E\u0431\u043B\u0435\u043C\u0430 \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F \u2014 \u043F\u043E\u0442\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044F \u0432\u044B\u0437\u043E\u0432 \u043C\u0430\u0441\u0442\u0435\u0440\u0430",
        tip: "\u0412\u043E\u0437\u043C\u043E\u0436\u043D\u0430 \u043D\u0435\u0438\u0441\u043F\u0440\u0430\u0432\u043D\u043E\u0441\u0442\u044C \u043E\u0431\u043E\u0440\u0443\u0434\u043E\u0432\u0430\u043D\u0438\u044F \u0438\u043B\u0438 \u0430\u043D\u0442\u0435\u043D\u043D\u044B",
        screen_image: "/images/tv/master_call.jpg",
        highlighted_buttons: [],
        actions: [],
        audio_url: "/audio/master_call.mp3",
        onlyForOperator: false,
        completion: {
          failure: {
            title: "\u{1F6AB} \u041F\u0440\u043E\u0431\u043B\u0435\u043C\u0430 \u043D\u0435 \u0440\u0435\u0448\u0435\u043D\u0430",
            description: "\u041C\u044B \u043F\u0440\u0438\u043D\u044F\u043B\u0438 \u0437\u0430\u044F\u0432\u043A\u0443, \u043C\u0430\u0441\u0442\u0435\u0440 \u0441\u043A\u043E\u0440\u043E \u043F\u0440\u0438\u0431\u0443\u0434\u0435\u0442",
            action: {
              type: "submit_request",
              buttonText: "\u041F\u043E\u0434\u0430\u0442\u044C \u0437\u0430\u044F\u0432\u043A\u0443",
              endpoint: "/api/master-request"
            }
          }
        }
      }
    ]
  };
  const key = `${deviceId}_${errorId}`;
  return allSteps[key] || [];
});

export { _errorId__get as default };
//# sourceMappingURL=_errorId_.get.mjs.map
