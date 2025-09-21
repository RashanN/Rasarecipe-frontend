import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const API_BASE_URL = 'http://localhost:3000/api';

  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (user && token) {
      setCurrentUser(JSON.parse(user));
    }
    
    setLoading(false);
  }, []);

  const register = async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/register`, userData);
      const { user, token } = response.data; // Assuming your backend returns both user and token
      
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token); // Store the token
      setCurrentUser(user);
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Network error';
      throw { message: errorMessage };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/login`, {
        email,
        password
      });
      
      const { user, token } = response.data; // Assuming your backend returns both user and token
      
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token); // Store the token
      setCurrentUser(user);
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Network error';
      throw { message: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token'); // Remove the token
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    user: currentUser, // Add this alias so RecipeView.js can use { user }
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};