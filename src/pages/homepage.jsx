import React, { useState } from 'react';

const allProfiles = Array.from({ length: 25 }, (_, i) => {
  const categories = ['offers', 'requests', 'events'];
  const activities = [
    'Hosting a book exchange 📚', 'Looking for a workout partner 🏋️',
    'Offering free tutoring 📘', 'Planning a chess night ♟️',
    'Organizing a pet adoption fair 🐶', 'Cooking class available 🍳',
    'Yoga in the park 🧘‍♀️', 'Looking for plant swaps 🌿',
    'Need help moving furniture 🛋️', 'Free music jam 🎶',
    'Film night this Friday 🎬', 'Hosting a garden tour 🌼',
    'Looking for painters 🎨', 'Free language exchange 🗣️',
    'Game night for teens 🎲', 'BBQ at the lake 🍖',
    'Donation drive this weekend 🎁', 'Lost and found corner 🔍',
    'Tech support offered 💻', 'Neighborhood cleanup 🌍',
    'Bike ride meetup 🚴‍♂️', 'Sewing circle 🧵', 'Craft workshop ✂️',
    'Knitting session 🧶', 'Photography tips exchange 📷'
  ];
  const names = [
    'Youhana Malik', 'Sheila Great', 'Liam Knox', 'Nora Stone', 'Zara Bloom',
    'Ethan Gray', 'Ava Cruz', 'Leo Marsh', 'Maya Lin', 'Owen Dale',
    'Noah Ray', 'Sofia James', 'Ben Ford', 'Isla Moon', 'Elijah King',
    'Grace Bell', 'Henry Black', 'Sophia White', 'Marcus Cole', 'Olivia Brooks',
    'Daniel Stone', 'Emily Chen', 'Jack Reid', 'Anna Lee', 'Victor Hill'
  ];

  return {
    id: i,
    name: names[i],
    category: categories[i % 3],
    activity: activities[i % activities.length],
    lastSeen: `${(i % 5) + 1} hours ago`,
    image: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
    email: `user${i + 1}@example.com`,
    zip: '0007',
  };
});

export default function Homepage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('offers');
  const currentZip = '0007';

  const filteredProfiles = allProfiles.filter(
    (p) => p.category === selectedCategory || p.zip === currentZip
  );

  const zipGroups = Array.from(
    allProfiles.reduce((map, profile) => {
      if (!map.has(profile.zip)) map.set(profile.zip, []);
      map.get(profile.zip).push(profile);
      return map;
    }, new Map())
  );

  return (
    <div className="min-h-screen font-sans flex bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1950&q=80)' }}>
      {/* Sidebar */}
      <aside className="w-72 p-6 bg-gradient-to-b from-pink-100 to-white bg-opacity-90 shadow-lg hidden md:block overflow-y-auto">
        <h2 className="text-xl font-bold text-pink-700 mb-6">Neighbourhood Feed</h2>
        <ul className="space-y-4 text-gray-700 font-medium">
          <li className="hover:text-pink-600 cursor-pointer" onClick={() => setSelectedCategory('offers')}>Offers</li>
          <li className="hover:text-pink-600 cursor-pointer" onClick={() => setSelectedCategory('requests')}>Requests</li>
          <li className="hover:text-pink-600 cursor-pointer" onClick={() => setSelectedCategory('events')}>Events</li>
        </ul>
        {zipGroups.map(([zip, profiles]) => (
          <div key={zip} className="mt-8">
            <h3 className="text-pink-700 font-semibold mb-2">Neighbours (Zip: {zip})</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              {profiles.map((n) => (
                <li key={n.id} className="flex items-center gap-2">
                  <img src={n.image} alt={n.name} className="w-6 h-6 rounded-full" />
                  <span className="truncate">{n.name}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>

      {/* Main content */}
      <div className="flex-1 bg-white bg-opacity-90">
        <header className="flex items-center justify-between px-6 py-4 shadow-md sticky top-0 z-10 relative bg-white bg-opacity-95">
          <div className="flex items-center space-x-3">
            <img
              src="https://img.icons8.com/color/48/community-grants.png"
              alt="logo"
              className="w-8 h-8"
            />
            <h1 className="text-3xl font-extrabold text-blue-900 tracking-wide drop-shadow-sm">NeighbourConnect</h1>
          </div>
          <div className="relative">
            <button
              className="rounded-full px-6 py-4 text-lg font-bold bg-pink-300 hover:bg-pink-400"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white shadow-xl rounded-lg py-4 z-50 border">
                <a className="block px-6 py-2 hover:bg-pink-50 cursor-pointer">General</a>
                <a className="block px-6 py-2 hover:bg-pink-50 cursor-pointer">Edit</a>
                <a className="block px-6 py-2 hover:bg-pink-50 cursor-pointer">Delete</a>
                <a className="block px-6 py-2 hover:bg-pink-50 cursor-pointer">Help Center</a>
                <a className="block px-6 py-2 hover:bg-pink-50 cursor-pointer">Update Profile</a>
              </div>
            )}
          </div>
        </header>

        <main className="p-6 space-y-6 max-w-xl mx-auto">
          {filteredProfiles.map(profile => (
            <div key={profile.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition bg-opacity-95">
              <div className="flex items-center gap-4">
                <img
                  src={profile.image}
                  alt={profile.name}
                  className="w-14 h-14 rounded-full object-cover transform transition duration-300 hover:scale-110"
                />
                <div>
                  <h2 className="text-lg font-bold text-gray-800">{profile.name}</h2>
                  <p className="text-sm text-gray-500">{profile.lastSeen}</p>
                </div>
              </div>
              <p className="mt-3 text-gray-700">{profile.activity}</p>
              <div className="mt-3 flex space-x-6 text-sm text-gray-600">
                <button className="hover:text-pink-600">👍 Like</button>
                <button className="hover:text-pink-600">💬 Comment</button>
                <a href={`mailto:${profile.email}`} className="hover:text-pink-600">✉️ Email</a>
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}
