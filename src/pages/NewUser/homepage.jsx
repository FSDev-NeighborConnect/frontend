import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  const [postForm, setPostForm] = useState({
    title: '',
    description: '',
    category: [],
    street: '',
    postalCode: '',
    status: 'open'
  });

  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    streetAddress: '',
    postalCode: '',
    description: '',
    hobbies: []
  });

  const categories = ['Community', 'Environment', 'Education', 'Health', 'Safety', 'Infrastructure', 'Events'];

  useEffect(() => {
    axios.get('/api/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));

    axios.get('/api/posts')
      .then(res => setPosts(res.data))
      .catch(err => console.error(err));
  }, []);

  const categoryCounts = posts.reduce((acc, post) => {
    post.category.forEach(cat => {
      acc[cat] = (acc[cat] || 0) + 1;
    });
    return acc;
  }, {});

  const handlePostSubmit = async () => {
    try {
      await axios.post('/api/posts/post', postForm);
      alert('Post created successfully');
      setShowPostModal(false);
    } catch (err) {
      alert('Failed to create post');
    }
  };

  const handleEventSubmit = async () => {
    try {
      await axios.post('/api/events/event', eventForm);
      alert('Event created successfully');
      setShowEventModal(false);
    } catch (err) {
      alert('Failed to create event');
    }
  };

  const toggleCategory = (cat) => {
    setPostForm(prev => ({
      ...prev,
      category: prev.category.includes(cat)
        ? prev.category.filter(c => c !== cat)
        : [...prev.category, cat]
    }));
  };

  return (
    <div
      className="flex min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1950&q=80')" }}
    >
      <aside className="w-64 bg-pink-100 bg-opacity-90 p-6 text-pink-800 font-semibold">
        <h2 className="text-2xl mb-6">Neighbourhood Feed</h2>
        <ul className="space-y-2 text-black font-normal">
          <li className="flex justify-between items-center">
            <span>All Posts</span>
            <span className="bg-pink-300 text-xs font-bold px-2 rounded-full">{posts.length}</span>
          </li>
          {Object.entries(categoryCounts).map(([cat, count]) => (
            <li key={cat} className="flex justify-between items-center">
              <span>{cat}</span>
              <span className="bg-pink-300 text-xs font-bold px-2 rounded-full">{count}</span>
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <p className="font-bold text-pink-800">Neighbours (Zip: N/A)</p>
          <p className="text-black">
            {users.length === 0 ? 'Loading users...' : users.map(u => u.name).join(', ')}
          </p>
        </div>
      </aside>

      <main className="flex-1 p-6 relative bg-white bg-opacity-90 min-h-screen">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-blue-600">NeighbourConnect</h1>
          <div className="flex items-center space-x-4">
            <button onClick={() => setShowPostModal(true)} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full font-semibold">+ Create Post</button>
            <button onClick={() => setShowEventModal(true)} className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2 rounded-full font-semibold">+ Create Event</button>
            <div className="relative">
              <button onClick={() => setMenuOpen(!menuOpen)} className="bg-pink-300 w-10 h-10 rounded-full text-2xl font-bold">☰</button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                  <ul className="text-black font-normal">
                    <li onClick={() => navigate('/profile')} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
                    <li onClick={() => navigate('/edit-profile')} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Edit Profile</li>
                    <li onClick={() => navigate('/register')} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Create Profile</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modals remain unchanged below */}
        {/* Post Modal */}
        {showPostModal && (
          <div className="fixed inset-0 flex justify-center items-start z-20 overflow-auto bg-white bg-opacity-95">
            <div className="bg-white p-6 rounded-lg w-full max-w-xl shadow-lg mt-20">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Create New Post</h2>
                <button onClick={() => setShowPostModal(false)} className="text-xl font-bold">✕</button>
              </div>
              <input onChange={e => setPostForm({ ...postForm, title: e.target.value })} placeholder="Title" className="w-full mb-2 p-2 border rounded" />
              <textarea onChange={e => setPostForm({ ...postForm, description: e.target.value })} placeholder="Description" className="w-full mb-2 p-2 border rounded" rows="3" />
              <input onChange={e => setPostForm({ ...postForm, street: e.target.value })} placeholder="Street" className="w-full mb-2 p-2 border rounded" />
              <input onChange={e => setPostForm({ ...postForm, postalCode: e.target.value })} placeholder="Postal Code" className="w-full mb-2 p-2 border rounded" />
              <select onChange={e => setPostForm({ ...postForm, status: e.target.value })} className="w-full mb-4 p-2 border rounded">
                <option value="open">Open</option>
                <option value="in progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
              <div className="mb-4">
                <p className="mb-1 font-medium">Categories</p>
                {categories.map(cat => (
                  <label key={cat} className="block text-sm">
                    <input
                      type="checkbox"
                      checked={postForm.category.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                      className="mr-2"
                    />
                    {cat}
                  </label>
                ))}
              </div>
              <button onClick={handlePostSubmit} className="bg-purple-600 text-white px-4 py-2 rounded">Submit</button>
            </div>
          </div>
        )}

        {/* Event Modal */}
        {showEventModal && (
          <div className="fixed inset-0 flex justify-center items-start z-20 overflow-auto bg-white bg-opacity-95">
            <div className="bg-white p-6 rounded-lg w-full max-w-xl shadow-lg mt-20">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Create New Event</h2>
                <button onClick={() => setShowEventModal(false)} className="text-xl font-bold">✕</button>
              </div>
              <input onChange={e => setEventForm({ ...eventForm, title: e.target.value })} placeholder="Title" className="w-full mb-2 p-2 border rounded" />
              <input type="date" onChange={e => setEventForm({ ...eventForm, date: e.target.value })} className="w-full mb-2 p-2 border rounded" />
              <input type="time" onChange={e => setEventForm({ ...eventForm, startTime: e.target.value })} className="w-full mb-2 p-2 border rounded" />
              <input type="time" onChange={e => setEventForm({ ...eventForm, endTime: e.target.value })} className="w-full mb-2 p-2 border rounded" />
              <input onChange={e => setEventForm({ ...eventForm, streetAddress: e.target.value })} placeholder="Street Address" className="w-full mb-2 p-2 border rounded" />
              <input onChange={e => setEventForm({ ...eventForm, postalCode: e.target.value })} placeholder="Postal Code" className="w-full mb-2 p-2 border rounded" />
              <textarea onChange={e => setEventForm({ ...eventForm, description: e.target.value })} placeholder="Description" className="w-full mb-2 p-2 border rounded" rows="3" />
              <button onClick={handleEventSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Homepage;