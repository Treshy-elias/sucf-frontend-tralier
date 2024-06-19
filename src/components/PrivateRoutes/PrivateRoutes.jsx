import React from 'react';
import { Navigate } from 'react-router-dom';

// Utility functions for JWT decoding
const base64UrlDecode = (base64Url) => {
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  return decodeURIComponent(atob(base64).split('').map(c =>
    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
};

const parseJwt = (token) => {
  const base64Url = token.split('.')[1];
  if (!base64Url) {
    throw new Error('Invalid token');
  }
  const base64 = base64UrlDecode(base64Url);
  return JSON.parse(base64);
};

// PrivateRoute component
const PrivateRoutes = ({ element: Component, ...rest }) => {
  const token = localStorage.getItem('token');
  let isAuthenticated = false;

  if (token) {
    try {
      const decoded = parseJwt(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp > currentTime) {
        isAuthenticated = true;
      } else {
        localStorage.removeItem('token');
      }
    } catch (e) {
      console.error('Invalid token:', e);
      localStorage.removeItem('token');
    }
  }

  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
