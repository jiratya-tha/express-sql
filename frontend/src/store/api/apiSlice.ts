import { createApi, fetchBaseQuery, FetchBaseQueryHeaders } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';
import { User } from '../slices/authSlice';

// Define API response types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  data: User;
  token?: string;
}

export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  error?: string;
}

// Define a service using a base URL and expected endpoints
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers: FetchBaseQueryHeaders, { getState }: { getState: () => RootState }) => {
      // Get token from Redux state
      const token = (getState() as RootState).auth.token;
      // If we have a token set in state, use that for authenticated requests
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    // Authentication endpoints
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials: LoginRequest) => ({
        url: '/users/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData: RegisterRequest) => ({
        url: '/users/register',
        method: 'POST',
        body: userData,
      }),
    }),
    // User endpoints
    getProfile: builder.query<ApiResponse<User>, void>({
      query: () => `/users/profile`,
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation<ApiResponse<User>, Partial<User>>({
      query: (data: Partial<User>) => ({
        url: `/users/profile`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    getAllUsers: builder.query<ApiResponse<User[]>, void>({
      query: () => '/users/all',
      providesTags: ['User'],
    }),
    // Health check
    healthCheck: builder.query<{ status: string; timestamp: string; data: string }, void>({
      query: () => '/health',
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetAllUsersQuery,
  useHealthCheckQuery,
} = apiSlice; 