import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import CreateEntry from './pages/CreateEntry'
import Login from './pages/Login'
import Signup from './pages/Signup'

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" />
    }
    return children
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/create" element={
            <ProtectedRoute>
              <CreateEntry />
            </ProtectedRoute>
          } />
          <Route path="/login" element={
            user ? <Navigate to="/" /> : <Login />
          } />
          <Route path="/signup" element={
            user ? <Navigate to="/" /> : <Signup />
          } />
        </Routes>
      </main>
    </div>
  )
}

export default App 