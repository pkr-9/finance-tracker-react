// src/api/
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

// Define the API slice
export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8080', // Your backend API base URL
        prepareHeaders: (headers, { getState }) => {
            // Get the token from the Redux state
            const token = (getState() as RootState).auth.token;
            if (token) {
                // Set the authorization header if a token exists
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        // Mutation for user login
        login: builder.mutation({
            query: (credentials) => ({
                url: '/api/auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        // Query to get the current user's profile
        getProfile: builder.query({
            query: () => '/api/profile/me',
        }),
    }),
});

// Export the auto-generated hooks for use in components
export const { useLoginMutation, useGetProfileQuery } = apiSlice;
