import express from 'express'
import fs from 'fs'
import path from 'path'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

const DB = path.resolve(process.cwd(), 'server', 'users.json')

function readUsers() {
  try {
    const raw = fs.readFileSync(DB, 'utf-8')
    return JSON.parse(raw)
  } catch (e) {
    return []
  }
}

function writeUsers(users) {
  fs.writeFileSync(DB, JSON.stringify(users, null, 2), 'utf-8')
}

app.post('/api/users', (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return res.status(400).json({ error: 'missing' })
  const users = readUsers()
  if (users.find(u => u.username === username)) return res.status(409).json({ error: 'exists' })
  const user = { id: Date.now().toString(), username, password }
  users.push(user)
  writeUsers(users)
  res.json(user)
})

app.post('/api/login', (req, res) => {
  const { username, password } = req.body
  const users = readUsers()
  const user = users.find(u => u.username === username && u.password === password)
  if (!user) return res.status(401).json({ error: 'invalid' })
  res.json(user)
})

app.post('/api/delete', (req, res) => {
  const { id } = req.body
  if (!id) return res.status(400).json({ error: 'missing id' })
  let users = readUsers()
  users = users.filter(u => u.id !== id)
  writeUsers(users)
  res.json({ ok: true })
})

const port = process.env.PORT || 5175
app.listen(port, () => console.log(`Server running on http://localhost:${port}`))
