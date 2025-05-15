import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(true);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showToggleMenu, setShowToggleMenu] = useState(false);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
    description: '',
    status: 'open',
    type: 'Event'
  });

  const categories = ['Community', 'Environment', 'Education', 'Health', 'Safety', 'Infrastructure', 'Events'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUserRes = await axios.get('/api/users/currentUser');
        setCurrentUser(currentUserRes.data);

        const allUsersRes = await axios.get('/api/users');
        const allUsers = allUsersRes.data;

        const neighbors = allUsers.filter(
          u => u.postalCode === currentUserRes.data.postalCode && u._id !== currentUserRes.data._id
        );
        setUsers(neighbors);

        const allPostsRes = await axios.get('/api/posts');
        const postList = allPostsRes.data;
        setPosts(postList);

        const counts = {};
        postList.forEach(post => {
          if (post.category) {
            post.category.forEach(cat => {
              counts[cat] = (counts[cat] || 0) + 1;
            });
          }
        });
        setCategoryCounts(counts);

        setPostForm(prev => ({
          ...prev,
          street: currentUserRes.data.streetAddress,
          postalCode: currentUserRes.data.postalCode
        }));
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePostSubmit = async () => {
    try {
      const postWithUser = {
        ...postForm,
        createdBy: currentUser._id
      };
      await axios.post('/api/posts/post', postWithUser);
      alert('Post created successfully');
      setShowPostModal(false);
      window.location.reload();
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
    <div className="flex min-h-screen font-sans">
      <aside className="w-72 bg-pink-100 p-6" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1950&q=80')`, backgroundSize: 'cover', backgroundBlendMode: 'multiply' }}>
        <h2 className="text-xl font-bold text-pink-900">Neighbourhood Feed</h2>
        <ul className="mt-4 space-y-2">
          <li className="text-pink-900 font-semibold">All Posts <span className="ml-2 text-pink-600">{posts.length}</span></li>
          {Object.entries(categoryCounts).map(([cat, count]) => (
            <li key={cat} className="text-sm flex justify-between">
              <span>{cat}</span><span className="bg-pink-200 rounded-full px-2">{count}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <h3 className="text-md font-bold text-pink-900">Neighbours in your ZIP</h3>
          <ul className="text-sm text-white">
            {users.length === 0 ? <li>No neighbors found.</li> : users.map(u => (
              <li key={u._id}>{u.name}</li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="flex-1 p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">NeighbourConnect</h1>
          <div className="flex gap-4">
            <button onClick={() => setShowPostModal(true)} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full shadow">+ Create Post</button>
            <button onClick={() => setShowEventModal(true)} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full shadow">+ Create Event</button>
            <div className="relative">
              <button onClick={() => setShowToggleMenu(!showToggleMenu)} className="bg-pink-200 text-black p-2 rounded-full">☰</button>
              {showToggleMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border shadow-lg rounded-md">
                  <button onClick={() => navigate('/profile')} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Profile</button>
                  <button onClick={() => navigate('/register')} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Create Profile</button>
                  <button onClick={() => navigate('/edit-profile')} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Update Profile</button>
                </div>
              )}
            </div>
          </div>
        </header>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <p className="text-lg text-gray-600">Welcome to the NeighbourConnect platform.</p>
          </div>
        )}
      </main>

      {showPostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-md w-1/2 p-6 relative">
            <button onClick={() => setShowPostModal(false)} className="absolute top-2 right-2 text-gray-700 text-xl">&times;</button>
            <h2 className="text-2xl font-bold mb-4">Create New Post</h2>
            <input value={postForm.title} onChange={e => setPostForm({ ...postForm, title: e.target.value })} className="w-full p-2 mb-2 border rounded" placeholder="Post title" />
            <textarea value={postForm.description} onChange={e => setPostForm({ ...postForm, description: e.target.value })} className="w-full p-2 mb-2 border rounded" placeholder="Describe your post in detail..." />
            <div className="mb-2">
              <label>Status:</label>
              <div>
                {['open', 'in progress', 'closed'].map(status => (
                  <label key={status} className="mr-4">
                    <input type="radio" value={status} checked={postForm.status === status} onChange={() => setPostForm({ ...postForm, status })} /> {status.charAt(0).toUpperCase() + status.slice(1)}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label>Categories (optional)</label>
              <ul className="grid grid-cols-2 gap-2">
                {categories.map(cat => (
                  <li key={cat}>
                    <label>
                      <input type="checkbox" checked={postForm.category.includes(cat)} onChange={() => toggleCategory(cat)} /> {cat}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <button onClick={handlePostSubmit} className="mt-4 bg-purple-600 text-white px-4 py-2 rounded">Create Post</button>
          </div>
        </div>
      )}

      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-md w-1/2 p-6 relative">
            <button onClick={() => setShowEventModal(false)} className="absolute top-2 right-2 text-gray-700 text-xl">&times;</button>
            <h2 className="text-2xl font-bold mb-4">Create Event</h2>
            <input value={eventForm.title} onChange={e => setEventForm({ ...eventForm, title: e.target.value })} className="w-full p-2 mb-2 border rounded" placeholder="Title" />
            <textarea value={eventForm.description} onChange={e => setEventForm({ ...eventForm, description: e.target.value })} className="w-full p-2 mb-2 border rounded" placeholder="Description" />
            <div className="flex gap-4 mb-4">
              <select value={eventForm.status} onChange={e => setEventForm({ ...eventForm, status: e.target.value })} className="p-2 border rounded">
                <option value="open">Open</option>
                <option value="in progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
              <select value={eventForm.type} onChange={e => setEventForm({ ...eventForm, type: e.target.value })} className="p-2 border rounded">
                <option value="Event">Event</option>
                <option value="Meeting">Meeting</option>
              </select>
            </div>
            <div className="flex justify-between">
              <button onClick={() => setShowEventModal(false)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
              <button onClick={handleEventSubmit} className="bg-purple-600 text-white px-4 py-2 rounded">Create Event</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;