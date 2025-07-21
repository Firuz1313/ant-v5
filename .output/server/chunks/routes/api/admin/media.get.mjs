import { d as defineEventHandler, c as createError } from '../../../nitro/nitro.mjs';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const media_get = defineEventHandler(async (event) => {
  try {
    const uploadsDir = join(process.cwd(), "public", "uploads");
    const mediaFiles = [];
    try {
      const files = await readdir(uploadsDir);
      for (const file of files) {
        const filePath = join(uploadsDir, file);
        const fileStat = await stat(filePath);
        if (fileStat.isFile()) {
          let category = "uncategorized";
          const lowerFile = file.toLowerCase();
          if (lowerFile.includes("remote") || lowerFile.includes("\u043F\u0443\u043B\u044C\u0442")) {
            category = "remotes";
          } else if (lowerFile.includes("icon") || lowerFile.includes("device") || lowerFile.includes("\u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u043E")) {
            category = "icons";
          } else if (lowerFile.includes("step") || lowerFile.includes("\u0448\u0430\u0433")) {
            category = "steps";
          }
          mediaFiles.push({
            id: file.replace(/\.[^.]+$/, ""),
            // filename without extension as ID
            fileName: file,
            originalName: file,
            url: `/uploads/${file}`,
            size: fileStat.size,
            type: "image",
            category,
            uploadedAt: fileStat.birthtime.toISOString(),
            usage: []
            // Will be populated with where this media is used
          });
        }
      }
    } catch (error) {
      console.log("Uploads directory not found or empty");
    }
    const stats = {
      total: mediaFiles.length,
      icons: mediaFiles.filter((f) => f.category === "icons").length,
      remotes: mediaFiles.filter((f) => f.category === "remotes").length,
      steps: mediaFiles.filter((f) => f.category === "steps").length,
      uncategorized: mediaFiles.filter((f) => f.category === "uncategorized").length
    };
    return {
      success: true,
      files: mediaFiles,
      stats
    };
  } catch (error) {
    console.error("Media fetch error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch media files"
    });
  }
});

export { media_get as default };
//# sourceMappingURL=media.get.mjs.map
