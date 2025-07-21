const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const cors = require('cors')
const TelegramBotService = require('./services/telegramBot')

const app = express()
const PORT = process.env.PORT || 3002

// Middleware
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Initialize SQLite database
const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'), (err) => {
  if (err) {
    console.error('Error opening database:', err.message)
  } else {
    console.log('Connected to SQLite database')
    initializeDatabase()
  }
})

// Database initialization
function initializeDatabase() {
  // Create tables
  db.serialize(() => {
    // Devices table
    db.run(`CREATE TABLE IF NOT EXISTS devices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      remote_image TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`)

    // Errors table  
    db.run(`CREATE TABLE IF NOT EXISTS errors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      device_id INTEGER,
      title TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (device_id) REFERENCES devices (id)
    )`)

    // Steps table
    db.run(`CREATE TABLE IF NOT EXISTS steps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      error_id INTEGER,
      order_index INTEGER NOT NULL,
      title TEXT NOT NULL,
      instruction TEXT NOT NULL,
      tip TEXT,
      screen_image TEXT,
      highlighted_button TEXT,
      audio_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (error_id) REFERENCES errors (id)
    )`)

    // Media files table
    db.run(`CREATE TABLE IF NOT EXISTS media (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      size INTEGER NOT NULL,
      path TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`)

    // Insert initial data
    insertInitialData()
  })
}

function insertInitialData() {
  // Insert devices
  db.get("SELECT COUNT(*) as count FROM devices", (err, row) => {
    if (err) {
      console.error(err)
      return
    }
    
    if (row.count === 0) {
      const devices = [
        { name: 'Openbox', description: 'Стандартная приставка Openbox' },
        { name: 'HDBOX', description: 'HD приставка HDBOX' },
        { name: 'UCLAN', description: 'Приставка UCLAN' },
        { name: 'Openbox GOLD', description: 'Премиум версия Openbox' }
      ]

      devices.forEach(device => {
        db.run("INSERT INTO devices (name, description) VALUES (?, ?)", 
          [device.name, device.description])
      })

      // Insert sample errors
      const errors = [
        { device_id: 1, title: 'Нет сигнала', description: 'На экране отображается "Нет сигнала"' },
        { device_id: 1, title: 'Нет звука', description: 'Изображение есть, но звук отсутствует' },
        { device_id: 1, title: 'Плохое качество', description: 'Изображение нечёткое или с помехами' },
        { device_id: 1, title: 'Не включается', description: 'Приставка не реагирует на пульт' }
      ]

      errors.forEach(error => {
        db.run("INSERT INTO errors (device_id, title, description) VALUES (?, ?, ?)",
          [error.device_id, error.title, error.description])
      })

      console.log('Initial data inserted')
    }
  })
}

// API Routes

// Get all devices
app.get('/api/devices', (req, res) => {
  db.all("SELECT * FROM devices ORDER BY created_at DESC", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json(rows)
  })
})

// Get device by ID
app.get('/api/devices/:id', (req, res) => {
  const { id } = req.params
  db.get("SELECT * FROM devices WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    if (!row) {
      res.status(404).json({ error: 'Device not found' })
      return
    }
    res.json(row)
  })
})

// Get errors for a device
app.get('/api/errors/:deviceId', (req, res) => {
  const { deviceId } = req.params
  db.all("SELECT * FROM errors WHERE device_id = ? ORDER BY created_at DESC", 
    [deviceId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json(rows)
  })
})

// Get steps for an error
app.get('/api/steps/:deviceId/:errorId', (req, res) => {
  const { errorId } = req.params
  db.all("SELECT * FROM steps WHERE error_id = ? ORDER BY order_index ASC", 
    [errorId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json(rows)
  })
})

// Admin API Routes

// Create device
app.post('/api/admin/device', (req, res) => {
  const { name, description, remote_image } = req.body
  db.run("INSERT INTO devices (name, description, remote_image) VALUES (?, ?, ?)",
    [name, description, remote_image], function(err) {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json({ id: this.lastID, name, description, remote_image })
  })
})

// Update device
app.put('/api/admin/device/:id', (req, res) => {
  const { id } = req.params
  const { name, description, remote_image } = req.body
  db.run("UPDATE devices SET name = ?, description = ?, remote_image = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    [name, description, remote_image, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json({ message: 'Device updated successfully' })
  })
})

// Delete device
app.delete('/api/admin/device/:id', (req, res) => {
  const { id } = req.params
  db.run("DELETE FROM devices WHERE id = ?", [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json({ message: 'Device deleted successfully' })
  })
})

// Create error
app.post('/api/admin/error', (req, res) => {
  const { device_id, title, description } = req.body
  db.run("INSERT INTO errors (device_id, title, description) VALUES (?, ?, ?)",
    [device_id, title, description], function(err) {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json({ id: this.lastID, device_id, title, description })
  })
})

// Create step
app.post('/api/admin/step', (req, res) => {
  const { error_id, order_index, title, instruction, tip, screen_image, highlighted_button, audio_url } = req.body
  db.run("INSERT INTO steps (error_id, order_index, title, instruction, tip, screen_image, highlighted_button, audio_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [error_id, order_index, title, instruction, tip, screen_image, highlighted_button, audio_url], function(err) {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json({ id: this.lastID })
  })
})

// Get global config
app.get('/api/config', (req, res) => {
  res.json({
    app_name: 'TV Diagnostics System',
    version: '1.0.0',
    languages: ['ru'],
    theme: 'light'
  })
})

// Statistics endpoint
app.get('/api/admin/stats', (req, res) => {
  Promise.all([
    new Promise((resolve, reject) => {
      db.get("SELECT COUNT(*) as count FROM devices", (err, row) => {
        if (err) reject(err)
        else resolve(row.count)
      })
    }),
    new Promise((resolve, reject) => {
      db.get("SELECT COUNT(*) as count FROM errors", (err, row) => {
        if (err) reject(err)
        else resolve(row.count)
      })
    }),
    new Promise((resolve, reject) => {
      db.get("SELECT COUNT(*) as count FROM steps", (err, row) => {
        if (err) reject(err)
        else resolve(row.count)
      })
    }),
    new Promise((resolve, reject) => {
      db.get("SELECT COUNT(*) as count FROM media", (err, row) => {
        if (err) reject(err)
        else resolve(row.count)
      })
    })
  ]).then(([devices, errors, steps, media]) => {
    res.json({ devices, errors, steps, media })
  }).catch(err => {
    res.status(500).json({ error: err.message })
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

// Start server
app.listen(PORT, () => {
  console.log(`API Server running on port ${PORT}`)
})

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message)
    } else {
      console.log('Database connection closed')
    }
  })
  process.exit(0)
})
