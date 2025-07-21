import { d as defineEventHandler } from '../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const remotes_get = defineEventHandler(async (event) => {
  return [
    {
      id: 1,
      deviceId: 4,
      name: "\u041F\u0443\u043B\u044C\u0442 Openbox GOLD",
      version: "1.0",
      image: "/images/remotes/openbox-gold-remote.jpg",
      buttons: [
        {
          id: 1,
          type: "power",
          label: "POWER",
          description: "\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C/\u0432\u044B\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u043F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0443",
          x: 50,
          y: 15,
          size: "medium"
        },
        {
          id: 2,
          type: "source",
          label: "SOURCE",
          description: "\u041F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0438\u0441\u0442\u043E\u0447\u043D\u0438\u043A \u0441\u0438\u0433\u043D\u0430\u043B\u0430",
          x: 50,
          y: 25,
          size: "small"
        },
        {
          id: 3,
          type: "menu",
          label: "MENU",
          description: "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0433\u043B\u0430\u0432\u043D\u043E\u0435 \u043C\u0435\u043D\u044E",
          x: 30,
          y: 40,
          size: "medium"
        },
        {
          id: 4,
          type: "info",
          label: "INFO",
          description: "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044E \u043E \u043A\u0430\u043D\u0430\u043B\u0435",
          x: 70,
          y: 40,
          size: "medium"
        },
        {
          id: 5,
          type: "ok",
          label: "OK",
          description: "\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C \u0432\u044B\u0431\u043E\u0440",
          x: 50,
          y: 50,
          size: "large"
        },
        {
          id: 6,
          type: "up",
          label: "UP",
          description: "\u041D\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u044F \u0432\u0432\u0435\u0440\u0445",
          x: 50,
          y: 42,
          size: "small"
        },
        {
          id: 7,
          type: "down",
          label: "DOWN",
          description: "\u041D\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u044F \u0432\u043D\u0438\u0437",
          x: 50,
          y: 58,
          size: "small"
        },
        {
          id: 8,
          type: "left",
          label: "LEFT",
          description: "\u041D\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u044F \u0432\u043B\u0435\u0432\u043E",
          x: 42,
          y: 50,
          size: "small"
        },
        {
          id: 9,
          type: "right",
          label: "RIGHT",
          description: "\u041D\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u044F \u0432\u043F\u0440\u0430\u0432\u043E",
          x: 58,
          y: 50,
          size: "small"
        },
        {
          id: 10,
          type: "exit",
          label: "EXIT",
          description: "\u0412\u044B\u0439\u0442\u0438 \u0438\u0437 \u043C\u0435\u043D\u044E",
          x: 70,
          y: 60,
          size: "medium"
        },
        // Number buttons
        ...Array.from({ length: 10 }, (_, i) => ({
          id: 11 + i,
          type: `num-${i}`,
          label: i.toString(),
          description: `\u0426\u0438\u0444\u0440\u0430 ${i}`,
          x: 30 + i % 3 * 20,
          y: 70 + Math.floor(i / 3) * 8,
          size: "small"
        }))
      ],
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z"
    },
    {
      id: 2,
      deviceId: 1,
      name: "\u041F\u0443\u043B\u044C\u0442 Openbox Standard",
      version: "1.0",
      image: "/images/remotes/openbox-standard-remote.jpg",
      buttons: [
        {
          id: 1,
          type: "power",
          label: "POWER",
          description: "\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C/\u0432\u044B\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u043F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0443",
          x: 50,
          y: 10,
          size: "medium"
        },
        {
          id: 2,
          type: "menu",
          label: "MENU",
          description: "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043C\u0435\u043D\u044E",
          x: 30,
          y: 30,
          size: "medium"
        },
        {
          id: 3,
          type: "ok",
          label: "OK",
          description: "\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C",
          x: 50,
          y: 40,
          size: "large"
        },
        {
          id: 4,
          type: "up",
          label: "UP",
          description: "\u0412\u0432\u0435\u0440\u0445",
          x: 50,
          y: 30,
          size: "small"
        },
        {
          id: 5,
          type: "down",
          label: "DOWN",
          description: "\u0412\u043D\u0438\u0437",
          x: 50,
          y: 50,
          size: "small"
        }
      ],
      created_at: "2024-01-10T09:00:00Z",
      updated_at: "2024-01-10T09:00:00Z"
    },
    {
      id: 3,
      deviceId: 2,
      name: "\u041F\u0443\u043B\u044C\u0442 HDBOX",
      version: "1.1",
      image: "/images/remotes/hdbox-remote.jpg",
      buttons: [
        {
          id: 1,
          type: "power",
          label: "POWER",
          description: "\u041F\u0438\u0442\u0430\u043D\u0438\u0435",
          x: 50,
          y: 12,
          size: "medium"
        },
        {
          id: 2,
          type: "menu",
          label: "MENU",
          description: "\u041C\u0435\u043D\u044E",
          x: 50,
          y: 25,
          size: "medium"
        }
      ],
      created_at: "2024-01-12T11:00:00Z",
      updated_at: "2024-01-14T15:30:00Z"
    }
  ];
});

export { remotes_get as default };
//# sourceMappingURL=remotes.get.mjs.map
