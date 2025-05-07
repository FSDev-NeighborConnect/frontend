import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import NewUser from './pages/newuser'
import UserProfile from './pages/userprofile'
import EditProfile from './pages/editprofile.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<NewUser />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        {/* Catch-all route that redirects to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App