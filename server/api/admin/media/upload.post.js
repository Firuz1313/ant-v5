import { mkdir, writeFile } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'

export default defineEventHandler(async (event) => {
  try {
    const files = await readMultipartFormData(event)
    
    if (!files || files.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No files uploaded'
      })
    }

    const uploadedFiles = []
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    
    // Ensure uploads directory exists
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      // Directory already exists or other error
    }

    for (const file of files) {
      if (file.name === 'file' && file.filename && file.data) {
        // Validate file type
        const allowedTypes = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
        const fileExtension = file.filename.toLowerCase().match(/\.[^.]+$/)
        
        if (!fileExtension || !allowedTypes.includes(fileExtension[0])) {
          throw createError({
            statusCode: 400,
            statusMessage: `Unsupported file type. Allowed: ${allowedTypes.join(', ')}`
          })
        }

        // Generate unique filename
        const uniqueId = randomUUID()
        const fileName = `${uniqueId}${fileExtension[0]}`
        const filePath = join(uploadsDir, fileName)
        
        // Save file
        await writeFile(filePath, file.data)
        
        // Create file record
        const fileRecord = {
          id: uniqueId,
          originalName: file.filename,
          fileName: fileName,
          url: `/uploads/${fileName}`,
          size: file.data.length,
          type: file.type || 'image',
          category: 'uncategorized',
          uploadedAt: new Date().toISOString()
        }
        
        uploadedFiles.push(fileRecord)
      }
    }

    return {
      success: true,
      message: `Успешно загружено ${uploadedFiles.length} файл(ов)`,
      files: uploadedFiles
    }
  } catch (error) {
    console.error('Upload error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.statusMessage || 'Failed to upload files'
    })
  }
})
