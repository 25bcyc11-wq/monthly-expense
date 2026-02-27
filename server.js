import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Supabase client (backend only)
const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🔧 Backend Configuration:')
console.log(`   Supabase URL: ${supabaseUrl ? '✅ Present' : '❌ Missing'}`)
console.log(`   Supabase Key: ${supabaseKey ? '✅ Present' : '❌ Missing'}`)
console.log(`   Port: ${PORT}`)

// --- Routes ---------------------------------------------------------------

// Add a new record (income or expense)
app.post('/add', async (req, res) => {
  try {
    const { type, amount, date } = req.body

    if (!type || !amount || !date) {
      return res.status(400).json({ error: 'type, amount and date are required' })
    }

    console.log('📤 Inserting record', { type, amount, date })

    // ensure amounts are stored as positive numbers (frontend will handle income/expense logic)
    const safeAmount = Math.abs(Number(amount) || 0)

    const { data, error } = await supabase
      .from('records')
      .insert([
        {
          id: randomUUID(),
          type,
          amount: safeAmount,
          // note column remains in DB but not used
          date,
        },
      ])
      .select()

    if (error) {
      console.error('❌ Insert error:', error.message)
      return res.status(400).json({ error: error.message })
    }

    res.json(data[0])
  } catch (err) {
    console.error('🔴 Server error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get all records sorted newest first
app.get('/all', async (req, res) => {
  try {
    console.log('📤 Fetching all records')
    const { data, error } = await supabase
      .from('records')
      .select('*')
      .order('date', { ascending: false })

    if (error) {
      console.error('❌ Fetch error:', error.message)
      return res.status(400).json({ error: error.message })
    }

    res.json(data)
  } catch (err) {
    console.error('🔴 Server error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Delete record by id
app.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params
    console.log('📤 Deleting record', id)
    const { error } = await supabase.from('records').delete().eq('id', id)
    if (error) {
      console.error('❌ Delete error:', error.message)
      return res.status(400).json({ error: error.message })
    }
    res.json({ success: true, id })
  } catch (err) {
    console.error('🔴 Server error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Summary totals
app.get('/summary', async (req, res) => {
  try {
    console.log('📤 Calculating summary')
    const { data, error } = await supabase.from('records').select('type, amount')
    if (error) {
      console.error('❌ Summary fetch error:', error.message)
      return res.status(400).json({ error: error.message })
    }

    let income = 0
    let expense = 0
    data.forEach((r) => {
      const amt = Number(r.amount) || 0
      if (r.type === 'income') income += amt
      else if (r.type === 'expense') expense += amt
    })
    const savings = income - expense

    res.json({ income, expense, savings })
  } catch (err) {
    console.error('🔴 Server error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// simple health check
app.get('/health', (req, res) => {
  res.json({ status: '✅ Backend running', timestamp: new Date().toISOString() })
})

// startup helper: try ports until available
const startServer = (port, attemptsLeft = 10) => {
  const server = app.listen(port)
  server.on('listening', () => {
    console.log(`\n🚀 Simple Expense Tracker Backend`)
    console.log(`📍 Running on http://localhost:${port}`)
    console.log(`\nEndpoints:`)
    console.log(`  POST   /add`)
    console.log(`  GET    /all`)
    console.log(`  DELETE /delete/:id`)
    console.log(`  GET    /summary`)
    console.log(`  GET    /health`)
    console.log('\n')
  })
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && attemptsLeft > 0) {
      const next = port + 1
      console.warn(`Port ${port} in use, trying ${next}...`)
      setTimeout(() => startServer(next, attemptsLeft - 1), 300)
    } else {
      console.error('Server failed to start:', err)
      process.exit(1)
    }
  })
}

startServer(Number(PORT) || 3001)
