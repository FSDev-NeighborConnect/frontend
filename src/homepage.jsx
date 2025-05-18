<<<<<<< Updated upstream
import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useCsrf } from '../context/CsrfContext';
import CreateEventModal from "./CreateEventModal"

const Homepage = () => {
  const navigate = useNavigate();
  const { userId } = useUser(); // ✅ FIXED
  const { csrfToken } = useCsrf();
  const { userId: currentUserId } = useUser()
  

  const [userProfile, setUserProfile] = useState(null);
=======
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CsrfContext } from '../context/CsrfContext';
import { AuthContext } from '../context/AuthContext';

const Homepage = () => {
  const navigate = useNavigate();
  const csrfToken = useContext(CsrfContext);
  const { user: currentUser } = useContext(AuthContext);

>>>>>>> Stashed changes
  const [showPostModal, setShowPostModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showToggleMenu, setShowToggleMenu] = useState(false);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [loading, setLoading] = useState(true);

  const categories = ['Community', 'Environment', 'Education', 'Health', 'Safety', 'Infrastructure', 'Events'];

  const [postForm, setPostForm] = useState({
    title: '',
    description: '',
    category: [],
    street: '',
    postalCode: '',
    status: 'open'
  });

  // const [eventForm, setEventForm] = useState({
  //   title: '',
  //   description: '',
  //   status: 'open',
  //   type: 'Event'
  // });

  const fetchEvents = async () => {
  try {
    const res = await axios.get('/api/events/zip', {
      withCredentials: true,
      headers: {
        'X-CSRF-Token': csrfToken
      }
    });
    setEvents(res.data.events || []);
  } catch (error) {
    console.error('Error fetching updated events:', error);
  }
};


  useEffect(() => {
  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(apiUrl(`api/users/user/${userId}`), {
        
        withCredentials: true,
        headers: {
          'X-CSRF-Token': csrfToken

        }
        
      });
  
       console.log("Fetched user profile:", res.data); // ✅ Safe here

      setUserProfile(res.data);
      setPostForm(prev => ({
        ...prev,
        street: res.data.streetAddress || '',
        postalCode: res.data.postalCode || ''
      }));
    } catch (err) {
      console.error('User profile fetch failed:', err.response?.data || err.message);
      setUserProfile({

});

    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const resPosts = await axios.get('/api/posts/zip', {
        withCredentials: true,
        headers: { 'X-CSRF-Token': csrfToken }
      });
      setPosts(resPosts.data);
      countCategories(resPosts.data);

      const resEvents = await axios.get('/api/events/zip', {
        withCredentials: true,
        headers: { 'X-CSRF-Token': csrfToken }
      });
      setEvents(resEvents.data.events);
    } catch (error) {
      console.error('Homepage load error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 👇 These calls should be inside the effect
  fetchUserProfile();
  fetchData();
}, [userId, csrfToken]); // 👈 This must match the outer useEffect




  const countCategories = (posts) => {
    const counts = {};
    posts.forEach(post => {
      if (post.category) {
        post.category.forEach(cat => {
          counts[cat] = (counts[cat] || 0) + 1;
        });
      }
    });
    setCategoryCounts(counts);
  };

<<<<<<< Updated upstream
=======
  const fetchData = async (postalCode) => {
    setLoading(true);
    try {
      const [postsRes, neighborsRes] = await Promise.all([
        axios.get(`/api/posts/zip`, {
          withCredentials: true,
          headers: { 'X-CSRF-Token': csrfToken }
        }),
        axios.get(`/api/users/zip/${postalCode}`, {
          withCredentials: true,
          headers: { 'X-CSRF-Token': csrfToken }
        })
      ]);

      setPosts(postsRes.data);
      calculateCategoryCounts(postsRes.data);
      setUsers(neighborsRes.data);

      setPostForm(prev => ({
        ...prev,
        street: currentUser.streetAddress,
        postalCode: currentUser.postalCode
      }));
    } catch (err) {
      setError("Failed to load posts. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchData(currentUser.postalCode);
    }
  }, [currentUser]);

  const handlePostSubmit = async () => {
    try {
      const postWithUser = { ...postForm, createdBy: currentUser._id };
      await axios.post('/api/posts/post', postWithUser, {
        withCredentials: true,
        headers: { 'X-CSRF-Token': csrfToken }
      });
      alert('Post created successfully');
      setShowPostModal(false);
      fetchData(currentUser.postalCode);
    } catch (err) {
      alert('Failed to create post');
      console.error(err);
    }
  };

  const handleEventSubmit = async () => {
    try {
      const eventWithUser = { ...eventForm, createdBy: currentUser._id };
      await axios.post('/api/events/event', eventWithUser, {
        withCredentials: true,
        headers: { 'X-CSRF-Token': csrfToken }
      });
      alert('Event created successfully');
      setShowEventModal(false);
    } catch (err) {
      alert('Failed to create event');
      console.error(err);
    }
  };

>>>>>>> Stashed changes
  const toggleCategory = (cat) => {
    setPostForm(prev => ({
      ...prev,
      category: prev.category.includes(cat)
        ? prev.category.filter(c => c !== cat)
        : [...prev.category, cat]
    }));
  };

  const handlePostSubmit = async () => {
    try {
      if (!csrfToken || !userId) {
        alert("Missing CSRF token or user");
        return;
      }

      const postWithUser = {
        ...postForm,
        createdBy: userId
      };

      await axios.post('/api/posts/post', postWithUser, {
        withCredentials: true,
        headers: {
          'X-CSRF-Token': csrfToken
        }
      });

      alert('Post created successfully');
      setShowPostModal(false);
      window.location.reload();
    } catch (err) {
      console.error("Post creation error:", err.response?.data || err.message);
      alert("Post creation failed. Check console.");
    }
  };

  const handleEventSubmit = async () => {
  try {
    if (!userId || !csrfToken) {
      alert("Missing user or CSRF token");
      return;
    }

    if (!userProfile) {
  console.warn("No user profile. Proceeding with fallback data.");
}


    const eventWithUser = {
      ...eventForm,
      createdBy: userId,
      street: userProfile?.streetAddress || "unknown",
      postalCode: userProfile?.postalCode || "unknown",
      type: eventForm.type || "Event",
    };

    console.log("Creating event:", eventWithUser);

    const response = await axios.post('/api/events/event', eventWithUser, {
      withCredentials: true,
      headers: {
        'X-CSRF-Token': csrfToken,
      },
    });

    alert('Event created successfully!');
    setShowEventModal(false);

    // 🧠 Optional — fetch fresh list after creation
    await fetchData();  // or fetchEvents();

  } catch (err) {
    console.error("Event creation failed:", err.response?.data || err.message);
    alert("Event creation failed. Please try again.");
  }
};





  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-72 bg-pink-100 p-6" style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1950&q=80')`,
        backgroundSize: 'cover',
        backgroundBlendMode: 'multiply'
      }}>
        <h2 className="text-xl font-bold text-pink-900">Neighbourhood Feed</h2>
        <ul className="mt-4 space-y-2">
          <li className="font-semibold text-pink-900">All Posts <span className="ml-2 text-pink-600">{posts.length}</span></li>
          {Object.entries(categoryCounts).map(([cat, count]) => (
            <li key={cat} className="text-sm flex justify-between text-white">
              <span>{cat}</span><span className="bg-pink-300 px-2 rounded-full">{count}</span>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">NeighbourConnect</h1>
          <div className="relative">
            {loading ? (
              <p className="text-gray-500">Loading user data...</p>
            ) : (
              <>
                
                
              </>
            )}
            <button
              onClick={() => setShowToggleMenu(prev => !prev)}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-full hover:bg-gray-300"
            >
              ☰
            </button>

            {showToggleMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-md rounded z-50">
                <button onClick={() => navigate('/profile')} className="block w-full text-left px-4 py-2 hover:bg-gray-100">👤 Profile</button>
                <button onClick={() => navigate('/edit-profile')} className="block w-full text-left px-4 py-2 hover:bg-gray-100">✏️ Edit Profile</button>
                <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100">🚪 Logout</button>
              </div>
            )}
          </div>
          <div className="flex gap-4 items-center">
            <button onClick={() => setShowPostModal(true)} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full shadow">+ Create Post</button>
            <button onClick={() => setShowEventModal(true)} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full shadow">+ Create Event</button>
          </div>
        </header>

        {userProfile && (
          <p className="text-gray-500 mb-4">
            Logged in as <strong>{currentUserId.name}</strong> ({userProfile.postalCode})


          </p>
        )}

        {loading ? <p>Loading...</p> : (
          <>
            <p className="text-lg text-gray-600 mb-4">Welcome to the NeighbourConnect platform.</p>
            {posts.length > 0 ? posts.map(post => (
              <div key={post._id} className="border border-gray-300 p-4 rounded mb-4">
                <h3 className="font-bold text-lg">{post.title}</h3>
                <p className="text-sm text-gray-700">{post.description}</p>
                <p className="text-xs text-gray-500">By: {post.createdBy?.name || 'Anonymous'} | Status: {post.status}</p>
              </div>
            )) : <p>No posts found.</p>}
          </>
        )}

        {events.length > 0 && (
          <>
            <h2 className="text-2xl font-bold text-blue-600 mt-10 mb-4">Events</h2>
            {events.map(event => (
              <div key={event._id} className="border border-blue-300 p-4 rounded mb-4">
                <h3 className="font-bold text-lg">{event.title}</h3>
                <p className="text-sm text-gray-700">{event.description}</p>
                <p className="text-xs text-gray-500">
                  By: {event.createdBy?.name || 'Anonymous'} | Status: {event.status}
                </p>
              </div>
            ))}
          </>
        )}
      </main>
<<<<<<< Updated upstream

      {/* Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-md w-1/2 p-6 relative">
            <button onClick={() => setShowPostModal(false)} className="absolute top-2 right-2 text-gray-700 text-xl">&times;</button>
            <h2 className="text-2xl font-bold mb-4">Create New Post</h2>
            <input value={postForm.title} onChange={e => setPostForm({ ...postForm, title: e.target.value })} className="w-full p-2 mb-2 border rounded" placeholder="Title" />
            <textarea value={postForm.description} onChange={e => setPostForm({ ...postForm, description: e.target.value })} className="w-full p-2 mb-2 border rounded" placeholder="Description" />
            <div className="mb-2">
              <label>Status:</label>
              {['open', 'in progress', 'closed'].map(status => (
                <label key={status} className="ml-4">
                  <input type="radio" value={status} checked={postForm.status === status} onChange={() => setPostForm({ ...postForm, status })} /> {status}
                </label>
              ))}
            </div>
            <div>
              <label>Categories:</label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map(cat => (
                  <label key={cat}>
                    <input type="checkbox" checked={postForm.category.includes(cat)} onChange={() => toggleCategory(cat)} /> {cat}
                  </label>
                ))}
              </div>
            </div>
            <button onClick={handlePostSubmit} className="mt-4 bg-purple-600 text-white px-4 py-2 rounded">Submit</button>
          </div>
        </div>
      )}

      {/* Event Modal */}
     <CreateEventModal
  isOpen={showEventModal}
  onClose={() => setShowEventModal(false)}
  onEventCreated={(newEvent) => {
    // Optional: you can add the event to state directly or re-fetch
    fetchEvents(); // already defined in your file
  }}
/>
=======
>>>>>>> Stashed changes
    </div>
  );
};


export default Homepage;
