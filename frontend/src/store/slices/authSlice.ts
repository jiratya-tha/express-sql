import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getUserFromToken, DecodedToken } from '../../utils/jwtUtils';

export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Helper function to get user from localStorage or token
const getUserFromStorage = (): User | null => {
  // First try to get from localStorage
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error('Error parsing stored user:', error);
    }
  }
  
  // Fallback to token decoding
  const token = localStorage.getItem('token');
  if (token) {
    const decodedUser = getUserFromToken(token);
    if (decodedUser) {
      // Convert DecodedToken to User format
      const user: User = {
        id: decodedUser.id,
        username: decodedUser.username,
        email: decodedUser.email,
        created_at: decodedUser.created_at,
        updated_at: decodedUser.created_at // Use created_at as fallback for updated_at
      };
      // Store in localStorage for future use
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    }
  }
  
  return null;
};

const initialState: AuthState = {
  user: getUserFromStorage(),
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token?: string }>
    ) => {
      const { user, token } = action.payload;
      state.user = user;
      state.isAuthenticated = true;
      
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      
      if (token) {
        state.token = token;
        localStorage.setItem('token', token);
      }
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload);
      
      // Decode token and store user data
      const decodedUser = getUserFromToken(action.payload);
      if (decodedUser) {
        const user: User = {
          id: decodedUser.id,
          username: decodedUser.username,
          email: decodedUser.email,
          created_at: decodedUser.created_at,
          updated_at: decodedUser.created_at
        };
        state.user = user;
        localStorage.setItem('user', JSON.stringify(user));
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    initializeFromToken: (state) => {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedUser = getUserFromToken(token);
        if (decodedUser) {
          const user: User = {
            id: decodedUser.id,
            username: decodedUser.username,
            email: decodedUser.email,
            created_at: decodedUser.created_at,
            updated_at: decodedUser.created_at
          };
          state.user = user;
          state.isAuthenticated = true;
          localStorage.setItem('user', JSON.stringify(user));
        }
      }
    },
  },
});

export const { setCredentials, setToken, logout, setLoading, initializeFromToken } = authSlice.actions;
export default authSlice.reducer; 