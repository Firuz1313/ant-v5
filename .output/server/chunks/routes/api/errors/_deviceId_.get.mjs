import { d as defineEventHandler, a as getRouterParam } from '../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const _deviceId__get = defineEventHandler(async (event) => {
  const deviceId = getRouterParam(event, "deviceId");
  const allErrors = [
    // Openbox (ID: 1)
    {
      id: 1,
      device_id: 1,
      title: "\u041D\u0435\u0442 \u0441\u0438\u0433\u043D\u0430\u043B\u0430",
      description: '\u041D\u0430 \u044D\u043A\u0440\u0430\u043D\u0435 \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u0435\u0442\u0441\u044F "\u041D\u0435\u0442 \u0441\u0438\u0433\u043D\u0430\u043B\u0430"',
      icon: "\u{1F4F5}"
    },
    {
      id: 2,
      device_id: 1,
      title: "\u041D\u0435\u0442 \u0437\u0432\u0443\u043A\u0430",
      description: "\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u0435\u0441\u0442\u044C, \u043D\u043E \u0437\u0432\u0443\u043A \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442",
      icon: "\u{1F507}"
    },
    {
      id: 3,
      device_id: 1,
      title: "\u041F\u043B\u043E\u0445\u043E\u0435 \u043A\u0430\u0447\u0435\u0441\u0442\u0432\u043E",
      description: "\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u043D\u0435\u0447\u0451\u0442\u043A\u043E\u0435 \u0438\u043B\u0438 \u0441 \u043F\u043E\u043C\u0435\u0445\u0430\u043C\u0438",
      icon: "\u{1F4FA}"
    },
    {
      id: 4,
      device_id: 1,
      title: "\u041D\u0435 \u0432\u043A\u043B\u044E\u0447\u0430\u0435\u0442\u0441\u044F",
      description: "\u041F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430 \u043D\u0435 \u0440\u0435\u0430\u0433\u0438\u0440\u0443\u0435\u0442 \u043D\u0430 \u043F\u0443\u043B\u044C\u0442",
      icon: "\u{1F50C}"
    },
    // HDBOX (ID: 2)
    {
      id: 5,
      device_id: 2,
      title: "\u041D\u0435\u0442 \u0441\u0438\u0433\u043D\u0430\u043B\u0430",
      description: '\u041D\u0430 \u044D\u043A\u0440\u0430\u043D\u0435 \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u0435\u0442\u0441\u044F "\u041D\u0435\u0442 \u0441\u0438\u0433\u043D\u0430\u043B\u0430"',
      icon: "\u{1F4F5}"
    },
    {
      id: 6,
      device_id: 2,
      title: "\u041F\u0440\u043E\u0431\u043B\u0435\u043C\u044B \u0441 \u0437\u0430\u043F\u0438\u0441\u044C\u044E",
      description: "\u041D\u0435 \u0437\u0430\u043F\u0438\u0441\u044B\u0432\u0430\u0435\u0442 \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u044B",
      icon: "\u{1F4BE}"
    },
    // UCLAN (ID: 3)
    {
      id: 7,
      device_id: 3,
      title: "\u041D\u0435\u0442 \u0441\u0438\u0433\u043D\u0430\u043B\u0430",
      description: '\u041D\u0430 \u044D\u043A\u0440\u0430\u043D\u0435 \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u0435\u0442\u0441\u044F "\u041D\u0435\u0442 \u0441\u0438\u0433\u043D\u0430\u043B\u0430"',
      icon: "\u{1F4F5}"
    },
    {
      id: 8,
      device_id: 3,
      title: "\u041C\u0435\u0434\u043B\u0435\u043D\u043D\u0430\u044F \u0440\u0430\u0431\u043E\u0442\u0430",
      description: "\u041F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430 \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442 \u043C\u0435\u0434\u043B\u0435\u043D\u043D\u043E",
      icon: "\u{1F40C}"
    },
    // Openbox GOLD (ID: 4)
    {
      id: 9,
      device_id: 4,
      title: "\u0417\u0430\u043A\u043E\u0434\u0438\u0440\u043E\u0432\u0430\u043D\u043E",
      description: '\u041A\u0430\u043D\u0430\u043B\u044B \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u044E\u0442 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435 "\u0417\u0430\u043A\u043E\u0434\u0438\u0440\u043E\u0432\u0430\u043D\u043E"',
      icon: "\u{1F512}",
      severity: "high"
    },
    {
      id: 10,
      device_id: 4,
      title: "\u041D\u0435\u0442 \u0441\u0438\u0433\u043D\u0430\u043B\u0430",
      description: '\u041D\u0430 \u044D\u043A\u0440\u0430\u043D\u0435 \u0422\u0412 \u0441\u0438\u043D\u0438\u0439/\u0447\u0451\u0440\u043D\u044B\u0439 \u044D\u043A\u0440\u0430\u043D \u0438\u043B\u0438 "\u041D\u0435\u0442 \u0441\u0438\u0433\u043D\u0430\u043B\u0430"',
      icon: "\u{1F4F5}",
      severity: "high"
    },
    {
      id: 11,
      device_id: 4,
      title: "\u041D\u0435\u0442 \u0437\u0432\u0443\u043A\u0430",
      description: "\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u0435\u0441\u0442\u044C, \u043D\u043E \u0437\u0432\u0443\u043A \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442",
      icon: "\u{1F507}",
      severity: "medium"
    },
    {
      id: 12,
      device_id: 4,
      title: "\u041F\u043B\u043E\u0445\u043E\u0435 \u043A\u0430\u0447\u0435\u0441\u0442\u0432\u043E",
      description: "\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u043D\u0435\u0447\u0451\u0442\u043A\u043E\u0435 \u0438\u043B\u0438 \u0441 \u043F\u043E\u043C\u0435\u0445\u0430\u043C\u0438",
      icon: "\u{1F4FA}",
      severity: "medium"
    }
  ];
  return allErrors.filter((error) => error.device_id == deviceId);
});

export { _deviceId__get as default };
//# sourceMappingURL=_deviceId_.get.mjs.map
