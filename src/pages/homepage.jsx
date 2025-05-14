import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';

export default function Homepage() {
  const [showMenu, setShowMenu] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', description: '', status: 'Open', categories: [] });
  const [newEvent, setNewEvent] = useState({ title: '', description: '', status: 'Open', type: 'Event' });

  const navigate = useNavigate();

  useEffect(() => {
    // Load current user
    fetch('http://localhost:5000/user/currentUser', { credentials: 'include' })
      .then(res => res.json())
      .then(setUser)
      .catch(console.error);

    // Load all posts
    fetch('http://localhost:5000/post')
      .then(res => res.json())
      .then(setPosts)
      .catch(console.error);

    // Load all users (for sidebar)
    fetch('http://localhost:5000/user')
      .then(res => res.json())
      .then(setUsers)
      .catch(console.error);
  }, []);

  const handleFormChange = (e, setState) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setState(prev => ({
        ...prev,
        categories: checked ? [...prev.categories, value] : prev.categories.filter(c => c !== value),
      }));
    } else {
      setState(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const post = {
      ...newPost,
      createdBy: user?._id,
      street: user?.streetAddress,
      postalCode: user?.postalCode
    };
    const res = await fetch('http://localhost:5000/post/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post)
    });
    const created = await res.json();
    setPosts(prev => [created, ...prev]);
    setShowCreateForm(false);
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    const event = {
      ...newEvent,
      createdBy: user?._id,
      street: user?.streetAddress,
      postalCode: user?.postalCode
    };
    const res = await fetch('http://localhost:5000/post/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    });
    const created = await res.json();
    setPosts(prev => [created, ...prev]);
    setShowEventForm(false);
  };

  const categoryOptions = ['Community', 'Environment', 'Education', 'Health', 'Safety', 'Infrastructure', 'Events'];

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 bg-pink-100 min-h-screen p-4">
        <h2 className="text-xl font-bold text-pink-700 mb-4">Neighbourhood Feed</h2>
        <div className="space-y-2">
          <p className="cursor-pointer" onClick={() => navigate('/offers')}>Offers</p>
          <p className="cursor-pointer" onClick={() => navigate('/requests')}>Requests</p>
          <p className="cursor-pointer" onClick={() => navigate('/events')}>Events</p>
        </div>
        <div className="mt-6 text-sm">
          <p className="font-bold text-pink-700">Neighbours (Zip: {user?.postalCode || 'N/A'})</p>
          {users.length ? (
            <ul className="text-sm">
              {users.map(u => <li key={u._id}>{u.name}</li>)}
            </ul>
          ) : (
            <p>Loading users...</p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-700">NeighbourConnect</h1>
          <div className="flex gap-4">
            <button onClick={() => { setShowCreateForm(true); setShowEventForm(false); }} className="bg-purple-600 text-white px-4 py-2 rounded-full">+ Create Post</button>
            <button onClick={() => { setShowEventForm(true); setShowCreateForm(false); }} className="bg-indigo-600 text-white px-4 py-2 rounded-full">+ Create Event</button>
            <button onClick={() => setShowMenu(!showMenu)} className="bg-pink-300 p-2 rounded-full">
              <Menu />
            </button>
          </div>
        </div>

        {showMenu && (
          <div className="absolute right-6 top-20 bg-white shadow-md p-4 rounded z-50">
            <p className="cursor-pointer mb-2" onClick={() => navigate('/profile')}>Profile</p>
            <p className="cursor-pointer mb-2" onClick={() => navigate('/edit-profile')}>Edit Profile</p>
            <p className="cursor-pointer text-red-500" onClick={() => navigate('/')}>Logout</p>
          </div>
        )}

        {/* Create Post Form */}
        {showCreateForm && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mt-6">
            <h2 className="text-2xl font-bold text-center mb-4">Create Post</h2>
            <input name="title" value={newPost.title} onChange={(e) => handleFormChange(e, setNewPost)} placeholder="Post title" className="w-full border p-2 rounded mb-4" />
            <textarea name="description" value={newPost.description} onChange={(e) => handleFormChange(e, setNewPost)} placeholder="Describe your post..." className="w-full border p-2 rounded mb-4" rows={4} />
            <div className="mb-4">
              {['Open', 'In Progress', 'Closed'].map(status => (
                <label key={status} className="mr-4">
                  <input type="radio" name="status" value={status} checked={newPost.status === status} onChange={(e) => handleFormChange(e, setNewPost)} className="mr-1" />{status}
                </label>
              ))}
            </div>
            <div className="mb-4">
              {categoryOptions.map(cat => (
                <label key={cat} className="block">
                  <input type="checkbox" value={cat} checked={newPost.categories.includes(cat)} onChange={(e) => handleFormChange(e, setNewPost)} className="mr-2" />{cat}
                </label>
              ))}
            </div>
            <button type="submit" className="bg-purple-600 text-white w-full py-2 rounded">Post</button>
          </form>
        )}

        {/* Create Event Form */}
        {showEventForm && (
          <form onSubmit={handleEventSubmit} className="bg-white p-6 rounded-lg shadow-md mt-6">
            <h2 className="text-2xl font-bold text-center mb-4">Create Event</h2>
            <input name="title" value={newEvent.title} onChange={(e) => handleFormChange(e, setNewEvent)} placeholder="Event title" className="w-full border p-2 rounded mb-4" />
            <textarea name="description" value={newEvent.description} onChange={(e) => handleFormChange(e, setNewEvent)} placeholder="Describe the event..." className="w-full border p-2 rounded mb-4" rows={4} />
            <button type="submit" className="bg-indigo-600 text-white w-full py-2 rounded">Create</button>
          </form>
        )}

        {/* Posts List */}
        <div className="mt-6 space-y-4">
          {posts.map(post => (
            <div key={post._id} className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold">{post.title}</h3>
              <p>{post.description}</p>
              <p className="text-sm italic text-gray-500">Status: {post.status}</p>
              <p className="text-sm text-gray-600">By: {post.createdBy?.name || 'Unknown User'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
