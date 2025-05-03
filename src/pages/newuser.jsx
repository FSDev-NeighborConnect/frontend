// FILE: src/pages/NewUser.jsx
import React, { useState } from 'react';
import './NewUser.css';

function NewUser() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    streetAddress: '',
    postalCode: '',
    phone: '',
    avatarUrl: '',
    bio: '',
    role: 'member',
    hobbies: []
  });

  const hobbiesList = [
    'Gardening',
    'Painting',
    'Cooking',
    'Reading',
    'Cycling',
    'Photography'
  ];

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'select-multiple') {
      const options = Array.from(e.target.selectedOptions, option => option.value);
      setFormData({ ...formData, hobbies: options });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('New user data:', formData);
    alert('New user form submitted. Check console for data.');
  };

  return (
    <div className="new-user-container">
      <h1 style={{ color: '#4a148c', fontSize: '32px',  textAlign: 'center'}}>NeighbourConnect</h1>
      
      <form onSubmit={handleSubmit} className="new-user-form">
        <br />
        <input type="text" name="name" placeholder="Full Name" onChange={handleChange} value={formData.name} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} value={formData.email} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} value={formData.password} required />
        <input type="text" name="streetAddress" placeholder="Street Address" onChange={handleChange} value={formData.streetAddress} required />
        <input type="text" name="postalCode" placeholder="Postal Code" onChange={handleChange} value={formData.postalCode} required />
        <input type="text" name="phone" placeholder="Phone Number" onChange={handleChange} value={formData.phone} required />
        <input type="text" name="avatarUrl" placeholder="Avatar URL (optional)" onChange={handleChange} value={formData.avatarUrl} />
        <textarea name="bio" placeholder="Short Bio (max 500 characters)" onChange={handleChange} value={formData.bio} maxLength="500" />
      
      
        <label>Select Hobbies:</label>
        <select name="hobbies" multiple onChange={handleChange} value={formData.hobbies}>
          {hobbiesList.map(hobby => (
            <option key={hobby} value={hobby}>{hobby}</option>
          ))}
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default NewUser;
