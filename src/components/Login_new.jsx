import React, { useState } from 'react'
import { GameStateManager } from '../utils/gameStateManager'

// Login component: tries server API (/api) first, falls back to GameStateManager local store.
export default function Login({ onLogin }) {
  const gsm = new GameStateManager()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [loading, setLoading] = useState(false)

  const tryServer = async (path, body) => {
    try {
      const res = await fetch(`/api${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      if (!res.ok) return null
      return await res.json()
    } catch (e) {
      return null
    }
  }

  const submit = async () => {
    if (!username || !password) {
      alert('Enter username and password')
      return
    }
    setLoading(true)

    try {
      if (mode === 'register') {
        const serverUser = await tryServer('/users', { username, password })
        if (serverUser) { onLogin(serverUser); setLoading(false); return }

        if (gsm.findUserByUsername(username)) { alert('User exists'); setLoading(false); return }
        const user = { id: Date.now().toString(), username, password }
        gsm.addUser(user)
        onLogin(user)
        setLoading(false)
        return
      }

      const serverAuth = await tryServer('/login', { username, password })
      if (serverAuth) { onLogin(serverAuth); setLoading(false); return }

      const user = gsm.authenticateLocal(username, password)
      if (!user) { alert('Invalid credentials'); setLoading(false); return }
      onLogin(user)
      setLoading(false)
    } catch (err) {
      console.error('Login error', err)
      alert('An error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-96">
        <h2 className="text-2xl font-bold mb-4">🐶 Sign in to Puppy Paw Battle</h2>
        <div className="mb-2">
          <label className="block text-sm">Username</label>
          <input value={username} onChange={e => setUsername(e.target.value)} className="w-full border px-2 py-1 rounded" />
        </div>
        <div className="mb-4">
          <label className="block text-sm">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border px-2 py-1 rounded" />
        </div>
        <div className="flex gap-2 mb-4">
          <button onClick={() => setMode('login')} className={`flex-1 py-2 rounded ${mode==='login' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Login</button>
          <button onClick={() => setMode('register')} className={`flex-1 py-2 rounded ${mode==='register' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>Register</button>
        </div>
        <div className="flex gap-2">
          <button onClick={submit} disabled={loading} className="flex-1 bg-indigo-600 text-white py-2 rounded">{loading ? 'Please wait…' : 'Continue'}</button>
        </div>
      </div>
    </div>
  )
}
