import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const VALID_USERS = [
  { username: 'admin', password: 'TTS@2026!', name: 'Admin User' },
  { username: 'arjun', password: 'taptap', name: 'Arjun' },
  { username: 'demo', password: 'TapSend#24', name: 'Demo User' },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('tts_user')
    return saved ? JSON.parse(saved) : null
  })

  const login = (username, password) => {
    const found = VALID_USERS.find(
      u => u.username === username && u.password === password
    )
    if (found) {
      const userData = { username: found.username, name: found.name }
      setUser(userData)
      localStorage.setItem('tts_user', JSON.stringify(userData))
      return { success: true }
    }
    return { success: false, error: 'Invalid username or password' }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('tts_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
