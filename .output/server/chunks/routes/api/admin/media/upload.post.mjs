import { d as defineEventHandler, b as readMultipartFormData, c as createError } from '../../../../nitro/nitro.mjs';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const upload_post = defineEventHandler(async (event) => {
  try {
    const files = await readMultipartFormData(event);
    if (!files || files.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "No files uploaded"
      });
    }
    const uploadedFiles = [];
    const uploadsDir = join(process.cwd(), "public", "uploads");
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
    }
    for (const file of files) {
      if (file.name === "file" && file.filename && file.data) {
        const allowedTypes = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
        const fileExtension = file.filename.toLowerCase().match(/\.[^.]+$/);
        if (!fileExtension || !allowedTypes.includes(fileExtension[0])) {
          throw createError({
            statusCode: 400,
            statusMessage: `Unsupported file type. Allowed: ${allowedTypes.join(", ")}`
          });
        }
        const uniqueId = randomUUID();
        const fileName = `${uniqueId}${fileExtension[0]}`;
        const filePath = join(uploadsDir, fileName);
        await writeFile(filePath, file.data);
        const fileRecord = {
          id: uniqueId,
          originalName: file.filename,
          fileName,
          url: `/uploads/${fileName}`,
          size: file.data.length,
          type: file.type || "image",
          category: "uncategorized",
          uploadedAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        uploadedFiles.push(fileRecord);
      }
    }
    return {
      success: true,
      message: `\u0423\u0441\u043F\u0435\u0448\u043D\u043E \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D\u043E ${uploadedFiles.length} \u0444\u0430\u0439\u043B(\u043E\u0432)`,
      files: uploadedFiles
    };
  } catch (error) {
    console.error("Upload error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: error.statusMessage || "Failed to upload files"
    });
  }
});

export { upload_post as default };
//# sourceMappingURL=upload.post.mjs.map
