import React, { createContext, useState, useCallback, useEffect, useContext } from 'react';
import { service } from '../services';
import { AUTH_TOKEN_KEY } from '../config.jsx';

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [stockItems, setStockItems] = useState([]);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const login = async (credentials) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Attempting login with:', credentials);
      
      const response = await service.auth.login(credentials);
      console.log('Login response:', response);
      
      if (response.success) {
        localStorage.setItem(AUTH_TOKEN_KEY, response.data.token);
        localStorage.setItem('current_user', JSON.stringify(response.data.user));
        setUser(response.data.user);
        console.log('Login successful, user set:', response.data.user);
      }
      return response;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      const response = await service.auth.register(userData);
      
      if (response.success && response.data) {
        const { token, refreshToken, user } = response.data;
        
        // Auto-login after successful registration
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        if (refreshToken) {
          localStorage.setItem('refresh_token', refreshToken);
        }
        localStorage.setItem('current_user', JSON.stringify(user));
        
        setUser(user);
      }
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await service.auth.logout();
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('current_user');
      setUser(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      const storedUser = localStorage.getItem('current_user');
      
      if (token && storedUser) {
        setIsLoading(true);
        try {
          // Try to get fresh profile from API
          const response = await service.auth.getProfile();
          if (response.success) {
            setUser(response.data);
          } else {
            // If API fails, use stored user data
            setUser(JSON.parse(storedUser));
          }
        } catch (apiError) {
          // If API call fails, use stored user data to maintain session
          console.log('API unavailable, using stored user data');
          setUser(JSON.parse(storedUser));
        }
      } else {
        // No token or user data, user is not authenticated
        setUser(null);
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem('current_user');
      }
    } catch (err) {
      console.error('Auth check error:', err);
      setUser(null);
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem('current_user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const fetchStockItems = useCallback(async () => {
    try {
      setIsLoading(true);
      // Use database endpoint for stock data (migrated from CSV)
      const response = await service.stock.getAll();
      if (response.success && response.data?.stocks) {
        setStockItems(response.data.stocks);
      } else {
        setStockItems([]);
      }
    } catch (err) {
      console.warn('Failed to fetch stock data from database:', err.message);
      setStockItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addStockItem = useCallback(async (data) => {
    try {
      setIsLoading(true);
      const response = await service.stock.create(data);
      if (response.success) {
        setStockItems(prev => [...prev, response.data]);
        return response.data;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateStockItem = useCallback(async (id, data) => {
    try {
      setIsLoading(true);
      const response = await service.stock.update(id, data);
      if (response.success) {
        setStockItems(prev => prev.map(item => 
          item.id === id ? response.data : item
        ));
        return response.data;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteStockItem = useCallback(async (id) => {
    try {
      setIsLoading(true);
      const response = await service.stock.delete(id);
      if (response.success) {
        setStockItems(prev => prev.filter(item => item.id !== id));
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = {
    isLoading,
    error,
    user,
    isAuthenticated: !!user,
    stockItems,
    sidebarExpanded,
    setSidebarExpanded,
    login,
    register,
    logout,
    setError,
    fetchStockItems,
    addStockItem,
    updateStockItem,
    deleteStockItem,
    api: service
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
