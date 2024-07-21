import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/UserPage.scss';
import { FaUser } from 'react-icons/fa';

export default function UserPage() {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchUser();
    }
  }, [token, navigate]);

  const fetchUser = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8082/u1/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      setError('Failed to fetch user data');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.put(
        'http://127.0.0.1:8082/u1/api/users/update',
        user,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('User updated successfully');
    } catch (error) {
      setError('Failed to update user data');
    }
  };

  return (
    <main>
      <Header />
      <div className="user-page">
        <h2>User Profile</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="avatar">
            <FaUser />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="firstName"
              value={user.firstName}
              onChange={handleChange}
              placeholder="First Name"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="lastName"
              value={user.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
          </div>
          <button type="submit">Update</button>
        </form>
      </div>
    </main>
  );
}
