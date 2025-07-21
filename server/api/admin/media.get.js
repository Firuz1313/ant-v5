import { readdir, stat } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  try {
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    const mediaFiles = []
    
    try {
      const files = await readdir(uploadsDir)
      
      for (const file of files) {
        const filePath = join(uploadsDir, file)
        const fileStat = await stat(filePath)
        
        if (fileStat.isFile()) {
          // Determine category based on filename or content
          let category = 'uncategorized'
          const lowerFile = file.toLowerCase()
          
          if (lowerFile.includes('remote') || lowerFile.includes('пульт')) {
            category = 'remotes'
          } else if (lowerFile.includes('icon') || lowerFile.includes('device') || lowerFile.includes('устройство')) {
            category = 'icons'
          } else if (lowerFile.includes('step') || lowerFile.includes('шаг')) {
            category = 'steps'
          }
          
          mediaFiles.push({
            id: file.replace(/\.[^.]+$/, ''), // filename without extension as ID
            fileName: file,
            originalName: file,
            url: `/uploads/${file}`,
            size: fileStat.size,
            type: 'image',
            category: category,
            uploadedAt: fileStat.birthtime.toISOString(),
            usage: [] // Will be populated with where this media is used
          })
        }
      }
    } catch (error) {
      // Directory doesn't exist or is empty
      console.log('Uploads directory not found or empty')
    }

    // Calculate statistics
    const stats = {
      total: mediaFiles.length,
      icons: mediaFiles.filter(f => f.category === 'icons').length,
      remotes: mediaFiles.filter(f => f.category === 'remotes').length,
      steps: mediaFiles.filter(f => f.category === 'steps').length,
      uncategorized: mediaFiles.filter(f => f.category === 'uncategorized').length
    }

    return {
      success: true,
      files: mediaFiles,
      stats
    }
  } catch (error) {
    console.error('Media fetch error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch media files'
    })
  }
})
