// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Set the base URL for Axios
axios.defaults.baseURL = 'http://localhost:5000'; 

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Contains user object (customer/restaurant)
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
        try {
            const parsedUser = JSON.parse(storedUser);
            
            // CRITICAL CHECK: Ensure parsedUser is a valid object and has a role
            if (parsedUser && parsedUser.role) {
                setToken(storedToken);
                setUser(parsedUser);
                setRole(parsedUser.role); 
                
                // Set default auth header for all subsequent requests
                axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            } else {
                // If user data is incomplete, force logout/clear storage
                console.warn("Incomplete user data found in localStorage. Clearing session.");
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        } catch (e) {
            // If JSON parsing failed (data corruption), clear storage
            console.error("Error parsing user data from localStorage:", e);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    const { token, ...userDetails } = userData;
    
    // Check if the role is valid before storing
    if (!userDetails.role) {
        console.error("Login data missing role.");
        return;
    }

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userDetails));

    setToken(token);
    setUser(userDetails);
    setRole(userDetails.role);
    
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    setToken(null);
    setUser(null);
    setRole(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const contextValue = {
    user,
    token,
    role,
    loading,
    login,
    logout,
    isAuthenticated: !!token,
  };

  if (loading) return <div className="text-center p-10 text-xl text-primary-orange">Loading Application...</div>; 

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};