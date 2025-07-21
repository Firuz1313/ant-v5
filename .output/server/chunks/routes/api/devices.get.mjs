import { d as defineEventHandler } from '../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const devices_get = defineEventHandler(async (event) => {
  let defaultIcon = null;
  let defaultRemote = null;
  try {
    const settings = await $fetch("/api/admin/settings").catch(() => null);
    if (settings) {
      defaultIcon = settings.defaultDeviceIcon;
      defaultRemote = settings.defaultRemote;
    }
  } catch (error) {
    console.error("Failed to load settings for devices:", error);
  }
  const devices = [
    {
      id: 1,
      name: "Openbox",
      description: "\u0421\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u043D\u0430\u044F \u043F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430 Openbox",
      remote_image: null,
      icon: "\u{1F4FA}",
      custom_icon: null,
      custom_remote: null
    },
    {
      id: 2,
      name: "HDBOX",
      description: "HD \u043F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430 HDBOX",
      remote_image: null,
      icon: "\u{1F4E1}",
      custom_icon: null,
      custom_remote: null
    },
    {
      id: 3,
      name: "UCLAN",
      description: "\u041F\u0440\u0438\u0441\u0442\u0430\u0432\u043A\u0430 UCLAN",
      remote_image: null,
      icon: "\u{1F3AC}",
      custom_icon: null,
      custom_remote: null
    },
    {
      id: 4,
      name: "Openbox GOLD",
      description: "\u041F\u0440\u0435\u043C\u0438\u0443\u043C \u0432\u0435\u0440\u0441\u0438\u044F Openbox GOLD",
      remote_image: null,
      icon: "\u{1F451}",
      custom_icon: null,
      custom_remote: null
    }
  ];
  return devices.map((device) => ({
    ...device,
    display_icon: device.custom_icon || defaultIcon || device.icon,
    display_remote: device.custom_remote || defaultRemote || device.remote_image,
    has_custom_icon: !!device.custom_icon,
    has_custom_remote: !!device.custom_remote
  }));
});

export { devices_get as default };
//# sourceMappingURL=devices.get.mjs.map
