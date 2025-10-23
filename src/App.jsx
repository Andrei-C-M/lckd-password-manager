import { useState } from 'react'
import LoginPage from './components/LoginPage'
import PasswordList from './components/PasswordList'
import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  return (
    <div className="app">
      {!isLoggedIn ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <PasswordList onLogout={handleLogout} />
      )}
    </div>
  )
}

export default App
