import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import { CsrfProvider } from './context/CsrfContext.jsx';
import { UserProvider } from './context/UserContext.jsx';

// Admin Pages
import AdminLogin from './pages/Admin/AdminLogin.jsx';
import AdminDashboard from './pages/Admin/AdminDashboard.jsx';
import AdminDashboardUsers from './pages/Admin/AdminDashboardUsers.jsx';
import AdminDashboardPosts from './pages/Admin/AdminDashboardPosts.jsx';
import DashboardStatistics from './pages/Admin/AdminStatistics.jsx';
import UpdateUser from './pages/Admin/UpdateUser.jsx';
import UpdatePost from './pages/Admin/UpdatePost.jsx';
import AdminCreateUser from './pages/Admin/AdminCreateUser.jsx';
import AdminCreatePost from './pages/Admin/AdminCreatePost.jsx';

// User Pages
import Login from './pages/Login.jsx';
import NewUser from './pages/NewUser/newuser.jsx';         // Register page
import UserProfile from './pages/userprofile.jsx';
import EditProfile from './pages/editprofile.jsx';
import AboutPage from './pages/About.jsx';

// Main Homepage
import Homepage from './homepage.jsx'; // ✅ your main working homepage

function App() {
  return (
    <CsrfProvider>
      <UserProvider>
        <Router>
          <Routes>
            {/* Public/User-Facing Pages */}
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<NewUser />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/edit-profile" element={<EditProfile />} />

            {/* Admin Section */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/dashboard-users" element={<AdminDashboardUsers />} />
            <Route path="/admin/dashboard-posts" element={<AdminDashboardPosts />} />
            <Route path="/admin/dashboard-statistics" element={<DashboardStatistics />} />
            <Route path="/admin/update-user" element={<UpdateUser />} />
            <Route path="/admin/update-post" element={<UpdatePost />} />
            <Route path="/admin/create-user" element={<AdminCreateUser />} />
            <Route path="/admin/create-post" element={<AdminCreatePost />} />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </UserProvider>
    </CsrfProvider>
  );
}

export default App;
