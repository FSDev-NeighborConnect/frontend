import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import img from './assets/neigh.png';
import support from './assets/support.png';
import hobbies from './assets/hobbies.png';
import events from './assets/events.png';

// import Signup from './pages/Signup.jsx';
// import Login from './pages/Login.jsx';
import NewUser from './pages/newuser.jsx';
import UserProfile from './pages/userprofile.jsx';
import EditProfile from './pages/editprofile.jsx';

// Placeholder Login component if you don't have one yet
function Login() {
  const navigate = useNavigate();
  return (
    <div className="container" style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Login Page</h1>
      <p>This is a placeholder for the login page.</p>
      <button className="btn" onClick={() => navigate('/')}>Back to Home</button>
    </div>
  );
}

// Home component for the landing page
function Home() {
  const navigate = useNavigate();
  
  return (
    <div className="container">
      {/* Hero Section */}
      <section className="hero">
        <div style={{ width: 'fit-content', marginLeft: '40px' }} className="hero-text">
          <h1 style={{ color: '#4a148c', fontSize: '32px' }}>NeighbourConnect</h1>
          <h4>Connecting Neighbors, Online</h4>
          <p>Join your local online community to connect with neighbours.</p>
          <br />
          <div className="button-group">
            <button className="btn" onClick={() => navigate('/newuser')}>New User</button>
            <button className="btn" onClick={() => navigate('/login')}>Log In</button>
            <button className="btn" onClick={() => navigate('/profile')}>Profile</button>
          </div>
        </div>

        <div className="hero-img">
          <img src={img || "/placeholder.svg"} alt="Neighbors illustration" />
        </div>
      </section>

      {/* Cards Section */}
      <section className="cards">
        <div className="card">
          <img src={hobbies || "/placeholder.svg"} alt="Hobby Groups" className='hobbies' />
          <h3>Hobby Groups</h3>
          <p>Connect with neighbours who share your interests — from gardening and painting to book clubs and cycling. Find your tribe right next door!</p>
        </div>
        <div className="card">
          <img src={events || "/placeholder.svg"} alt="Local Events" className='support' />
          <h3>Local Events</h3>
          <p>Discover and organize events, activities, community meetups, cultural festivals and more. Discover what's happening around you and join the fun!</p>
        </div>
        <div className="card">
          <img src={support || "/placeholder.svg"} alt="Neighbour Support" className='support' />
          <h3>Neighbour Support</h3>
          <p>Offer help or ask for support—whether it's picking up groceries, sharing tools, or just being there for a chat. Together, we make the neighbourhood stronger.</p>
        </div>
      </section>
    </div>
  );
}

// Main App component with React Router
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/newuser" element={<NewUser />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;