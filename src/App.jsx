import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Homepage from './pages/homepage';
import Login from './pages/Login';
import NewUser from './pages/NewUser/newuser';
import UserProfile from './pages/userprofile';
import EditProfile from './pages/editprofile';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import UpdateUser from './pages/Admin/UpdateUser';
import CreateUser from './pages/Admin/AdminCreateUser';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<NewUser />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/update-user" element={<UpdateUser />} />
        <Route path="/admin/create-user" element={<CreateUser />} />
        <Route path="/Home" element={<Homepage />} /> {/* Logout route points back to homepage */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
