import React from 'react'
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'

import { CsrfProvider } from './context/CsrfContext.jsx'
import { UserProvider } from './context/UserContext.jsx'

import AdminCreatePost from './pages/Admin/AdminCreatePost.jsx'
import AdminDashboard from './pages/Admin/AdminDashboard.jsx'
import AdminDashboardEvents from './pages/Admin/AdminDashboardEvents.jsx'
import AdminDashboardPosts from './pages/Admin/AdminDashboardPosts.jsx'
import AdminDashboardUsers from './pages/Admin/AdminDashboardUsers.jsx'
import AdminLogin from './pages/Admin/AdminLogin.jsx'
import CreateUser from './pages/Admin/AdminCreateUser.jsx'
import DashboardStatistics from './pages/Admin/AdminStatistics.jsx'
import UpdatePost from './pages/Admin/UpdatePost.jsx'
import UpdateUser from './pages/Admin/UpdateUser.jsx'

import AboutPage from './pages/About.jsx'
import EditProfile from './pages/editprofile.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import NewUser from './pages/NewUser/newuser.jsx'
import UserProfile from './pages/userprofile.jsx'

function App() {
  return (
    <CsrfProvider>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<NewUser />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/profile/:userId" element={<UserProfile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/dashboard-events" element={<AdminDashboardEvents />} />
            <Route path="/admin/dashboard-users" element={<AdminDashboardUsers />} />
            <Route path="/admin/dashboard-posts" element={<AdminDashboardPosts />} />
            <Route path="/admin/dashboard-statistics" element={<DashboardStatistics />} />
            <Route path="/admin/update-user" element={<UpdateUser />} />
            <Route path="/admin/update-post" element={<UpdatePost />} />
            <Route path="/admin/create-user" element={<CreateUser />} />
            <Route path="/admin/create-post" element={<AdminCreatePost />} />
            {/* Catch-all route that redirects to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </UserProvider>
    </CsrfProvider>
  )
}

export default App