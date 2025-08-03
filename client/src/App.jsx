
import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ProfilePage from "./pages/ProfilePage"
import AdminDashboardPage from "./pages/AdminDashboardPage"
import EditProfilePage from "./pages/EditProfilePage"
import EditPostPage from "./pages/EditPostPage"
import SearchPage from "./pages/SearchPage"
import Navbar from "./components/Navbar"

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      const storedUser = JSON.parse(localStorage.getItem("user"))
      setUser(storedUser)
    }
    setLoading(false)
  }, [])

  const handleLogin = (userData, token) => {
    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(userData))
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
  }

  const handleProfileUpdate = (updatedUserData) => {
    localStorage.setItem("user", JSON.stringify(updatedUserData))
    setUser(updatedUserData)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-lg font-semibold">Loading application...</p>
      </div>
    )
  }

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <main className="container mx-auto p-4 mt-16">
        <Routes>
          <Route path="/" element={<HomePage user={user} />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage onRegister={handleLogin} />} />
          <Route path="/profile/:id" element={<ProfilePage currentUser={user} />} />
          <Route
            path="/my-profile"
            element={user ? <ProfilePage currentUser={user} userId={user._id} /> : <Navigate to="/login" />}
          />
          <Route
            path="/edit-profile"
            element={
              user ? (
                <EditProfilePage currentUser={user} onProfileUpdate={handleProfileUpdate} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/edit-post/:id"
            element={user ? <EditPostPage currentUser={user} /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin-dashboard"
            element={user && user.role === "admin" ? <AdminDashboardPage currentUser={user} /> : <Navigate to="/" />}
          />
          <Route path="/search" element={<SearchPage currentUser={user} />} />
          <Route path="*" element={<h1 className="text-2xl font-bold text-center">404 - Page Not Found</h1>} />
        </Routes>
      </main>
    </Router>
  )
}

export default App
