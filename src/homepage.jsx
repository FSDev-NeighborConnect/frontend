<<<<<<< Updated upstream
<<<<<<< Updated upstream
import React, { useState, useEffect } from 'react';
=======
import React, { useState, useEffect, useContext } from 'react';
>>>>>>> Stashed changes
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CsrfContext } from '../context/CsrfContext';
import { AuthContext } from '../context/AuthContext';

const Homepage = () => {
  const navigate = useNavigate();
  const csrfToken = useContext(CsrfContext);
  const { user: currentUser } = useContext(AuthContext);

  const [showPostModal, setShowPostModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showToggleMenu, setShowToggleMenu] = useState(false);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
<<<<<<< Updated upstream
  const [currentUser, setCurrentUser] = useState(null);
=======
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CSRFContext } from '../context/CsrfContext.jsx';
import { UserContext } from '../context/UserContext.jsx';

const Homepage = () => {
  const navigate = useNavigate();
  const { csrfToken } = useContext(CSRFContext);
  const { currentUser } = useContext(UserContext);

  const [showPostModal, setShowPostModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showToggleMenu, setShowToggleMenu] = useState(false);

  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const calculateCategoryCounts = (postList) => {
    const counts = {};
    postList.forEach(post => {
      if (post.category) {
        post.category.forEach(cat => {
          counts[cat] = (counts[cat] || 0) + 1;
        });
      }
    });
    setCategoryCounts(counts);
  };

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
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    const fetchData = async () => {
      setLoading(true);
      try {
        const csrfToken = document.cookie.split('; ').find(row => row.startsWith('csrfToken='))?.split('=')[1];

        const currentUserRes = await axios.get('/api/users/currentUser', { withCredentials: true });
        const user = currentUserRes.data;
        setCurrentUser(user);

        const allUsersRes = await axios.get('/api/users');
        const neighbors = allUsersRes.data.filter(u => u.postalCode === user.postalCode && u._id !== user._id);
        setUsers(neighbors);

        try {
          const response = await axios.get('/api/posts/zip', {
            withCredentials: true,
            headers: { 'X-CSRF-Token': csrfToken }
          });
          setPosts(response.data);
          calculateCategoryCounts(response.data);
        } catch (zipError) {
          const fallback = await axios.get('/api/posts', { withCredentials: true });
          setPosts(fallback.data);
          calculateCategoryCounts(fallback.data);
        }

        setPostForm(prev => ({
          ...prev,
          street: user.streetAddress,
          postalCode: user.postalCode
        }));
      } catch (err) {
        console.error('Error fetching homepage data:', err);
        setError("Failed to load posts. Please try again.");
=======
    const fetchHomepageData = async () => {
      if (!currentUser) return;

      setLoading(true);
      try {
        const usersRes = await axios.get('/api/admin/all/users', {
          withCredentials: true,
          headers: { 'X-CSRF-Token': csrfToken }
        });
        const neighbors = usersRes.data.filter(u =>
          u.postalCode === currentUser.postalCode && u._id !== currentUser._id
        );
        setUsers(neighbors);

        const postsRes = await axios.get('/api/posts/zip', {
          withCredentials: true,
          headers: { 'X-CSRF-Token': csrfToken }
        });
        setPosts(postsRes.data);
        calculateCategoryCounts(postsRes.data);

        setPostForm(prev => ({
          ...prev,
          street: currentUser.streetAddress,
          postalCode: currentUser.postalCode
        }));

      } catch (err) {
        console.error("Homepage load error:", err);
        setError("Failed to load homepage data.");
>>>>>>> Stashed changes
      } finally {
        setLoading(false);
      }
    };

<<<<<<< Updated upstream
    fetchData();
  }, []);

  const handlePostSubmit = async () => {
    try {
      const csrfToken = document.cookie.split('; ').find(row => row.startsWith('csrfToken='))?.split('=')[1];
=======
    fetchHomepageData();
  }, [currentUser, csrfToken]);

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate('/login');
    }
  }, [loading, currentUser]);

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
>>>>>>> Stashed changes
=======
    if (currentUser) {
      fetchData(currentUser.postalCode);
    }
  }, [currentUser]);

  const handlePostSubmit = async () => {
    try {
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
<<<<<<< Updated upstream
      const csrfToken = document.cookie.split('; ').find(row => row.startsWith('csrfToken='))?.split('=')[1];
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
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
=======
  return (
    <div className="flex min-h-screen font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-pink-100 p-6" style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1950&q=80')`,
        backgroundSize: 'cover',
        backgroundBlendMode: 'multiply'
      }}>
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
          <h3 className="text-md font-bold text-pink-900">Neighbours in your ZIP</h3>
          <ul className="text-sm text-white">
            {users.length === 0 ? <li>No neighbors found.</li> : users.map(u => (
              <li key={u._id}>{u.name}</li>
            ))}
=======
          <h3 className="text-md font-bold text-pink-900">Neighbours (Zip: {currentUser?.postalCode || 'N/A'})</h3>
          <ul className="text-sm text-white">
            {loading ? <li>Loading users...</li> :
              users.length === 0 ? <li>No neighbors found.</li> :
                users.map(u => (
                  <li key={u._id}>{u.name}</li>
                ))}
>>>>>>> Stashed changes
          </ul>
        </div>
      </aside>

<<<<<<< Updated upstream
=======
      {/* Main content */}
>>>>>>> Stashed changes
      <main className="flex-1 p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">NeighbourConnect</h1>
          <div className="flex gap-4 items-center">
            <button onClick={() => setShowPostModal(true)} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full shadow">+ Create Post</button>
            <button onClick={() => setShowEventModal(true)} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full shadow">+ Create Event</button>
            <div className="relative">
              <button onClick={() => setShowToggleMenu(!showToggleMenu)} className="bg-pink-200 text-black w-12 h-12 text-xl p-2 rounded-full">☰</button>
              {showToggleMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border shadow-lg rounded-md z-10">
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
          <>
            <p className="text-lg text-gray-600 mb-4">Welcome to the NeighbourConnect platform.</p>
            {posts && posts.length > 0 ? (
              posts.map(post => (
                <div key={post._id} className="border border-gray-300 p-4 rounded mb-4">
                  <h3 className="font-bold text-lg">{post.title}</h3>
                  <p className="text-sm text-gray-700">{post.description}</p>
                  <p className="text-xs text-gray-500">
                    By: {post.createdBy?.name || 'Anonymous'} | Status: {post.status}
                  </p>
                </div>
              ))
            ) : (
              <p>No posts available.</p>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Homepage;
