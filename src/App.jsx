// useState is a React hook that lets you store and update a value 
// (in this case, which view to show: home, login, newuser, etc.)
import React, { useState } from 'react';
import img from './assets/neigh.png';
import support from './assets/support.png';
import hobbies from './assets/hobbies.png';
import events from './assets/events.png';

// import Signup from './pages/Signup.jsx';
// import Login from './pages/Login.jsx';
import NewUser from './pages/newuser.jsx';
import UserProfile from './pages/userprofile.jsx';



function App() {
  const [view, setView] = useState('home');

  const renderPage = () => {
    if (view === 'login') return <Login />;
    if (view === 'newuser') return <NewUser />;
    if (view === 'profile') return <UserProfile />;

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
              <button className="btn" onClick={() => setView('newuser')}>New User</button>
              <button className="btn" onClick={() => setView('login')}>Log In</button>
              <button className="btn" onClick={() => setView('profile')}>Profile</button>
            </div>
          </div>

          <div className="hero-img">
            <img src={img} alt="Neighbors illustration" />
          </div>
        </section>

        {/* Cards Section */}
        <section className="cards">
          <div className="card">
            <img src={hobbies} alt="Hobby Groups" className='hobbies' />
            <h3>Hobby Groups</h3>
            <p>Connect with neighbours who share your interests — from gardening and painting to book clubs and cycling. Find your tribe right next door!</p>
          </div>
          <div className="card">
            <img src={events} alt="Local Events" className='support' />
            <h3>Local Events</h3>
            <p>Discover and organize events, activities, community meetups, cultural festivals and more. Discover what's happening around you and join the fun!</p>
          </div>
          <div className="card">
            <img src={support} alt="Neighbour Support" className='support' />
            <h3>Neighbour Support</h3>
            <p>Offer help or ask for support—whether it's picking up groceries, sharing tools, or just being there for a chat. Together, we make the neighbourhood stronger.</p>
          </div>
        </section>
      </div>
    );
  };

  return <>{renderPage()}</>;
}

export default App;