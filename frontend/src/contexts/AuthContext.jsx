import { createContext, useState, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const getStoredUser = () => {
    try {
      const raw = localStorage.getItem('user');
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      // Ensure expected shape to avoid runtime errors during initial render
      if (!parsed || (parsed.roles && !Array.isArray(parsed.roles))) {
        return null;
      }
      return parsed;
    } catch (_e) {
      return null;
    }
  };

  const getStoredToken = () => {
    try {
      const raw = localStorage.getItem('token');
      return raw || null;
    } catch (_e) {
      return null;
    }
  };

  const [user, setUser] = useState(getStoredUser);
  const [token, setToken] = useState(getStoredToken);

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login', {
        username,
        password,
      });
      const { token } = response.data;
      setToken(token);
      localStorage.setItem('token', token);
      // Decode token and set user info
      let userInfo = parseJwt(token);
      if (!userInfo) {
        userInfo = { username };
      }
      setUser(userInfo);
      localStorage.setItem('user', JSON.stringify(userInfo));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (username, email, password, role) => {
    try {
      await api.post(`/auth/register/${role}`, {
        username,
        email,
        password,
      });
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) return null;
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;