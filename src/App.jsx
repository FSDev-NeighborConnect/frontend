import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { CsrfProvider } from './context/CsrfContext.jsx'
import { UserProvider } from './context/UserContext.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import NewUser from './pages/NewUser/newuser.jsx'
import UserProfile from './pages/userprofile.jsx'
import EditProfile from './pages/editprofile.jsx'
import AdminLogin from './pages/Admin/AdminLogin.jsx'
import AdminDashboard from './pages/Admin/AdminDashboard.jsx'
import UpdateUser from './pages/Admin/UpdateUser.jsx'
import CreateUser from './pages/Admin/AdminCreateUser.jsx'

function App() {
  return (
    <CsrfProvider>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<NewUser />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/update-user" element={<UpdateUser />} />
            <Route path="/admin/create-user" element={<CreateUser />} />
            {/* Catch-all route that redirects to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </UserProvider>
    </CsrfProvider>
  )
}

export default App