import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from '../../api/axios';
import type { UserProfileDto } from '../../features/user/dto/UserProfileDto';

/**
 * Represents the structure of the User object stored in the Redux state.
 */
interface User {
    id: string;
    name: string;
    email: string;
    // token: string;
}


/**
 * Defines the complete shape of the authentication state managed by this slice.
 */
interface AuthState {
    user: User | null;
    token: string | null;
    initLoading: boolean; // Tracks loading state for the initial auth check on page load
    loading: 'idle' | 'pending' | 'succeeded' | 'failed'; // Tracks loading for specific actions like login
    error: string | null;
}

/**
 * The initial state of the authentication slice.
 * It attempts to load the token from localStorage immediately.
 */
const initialState: AuthState = {
    user: null,
    token: localStorage.getItem('token'), // Pre-load token from localStorage
    initLoading: true, // App starts in a loading state until the initial auth check is complete
    loading: 'idle',
    error: null,
};

// --- ASYNC THUNKS ---

/**
 * Handles user login.
 * It sends credentials to the backend and, on success, stores the received token
 * in localStorage to enable session persistence.
 */
export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials: { username: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/auth/login', credentials);
            // On successful login, persist the token to localStorage.
            localStorage.setItem('token', response.data.token);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    }
);


/**
 * Verifies the token stored in localStorage on application startup.
 * This thunk is dispatched on page load to fetch the user's profile if a token exists,
 * effectively "re-logging" them in.
 */
export const verifyAuth = createAsyncThunk(
    'auth/verifyAuth',
    async (_, { getState, rejectWithValue }) => {
        try {
            // The token is already in our state, loaded from localStorage.
            const { token } = (getState() as { auth: AuthState }).auth;
            if (!token) {
                return rejectWithValue('No token found to verify.');
            }
            // The global axios instance is configured to automatically add the token to headers.
            const response = await axios.get('/api/profile/me');
            return response.data as UserProfileDto;
        } catch (error: any) {
            // This block will run if the token is invalid or expired, as the API will return an error.
            return rejectWithValue(error.response?.data?.message || 'Session expired. Please log in again.');
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/register',
    async (form: { username: string; email: string; password: string }, { rejectWithValue }) => {
        try {
            const res = await axios.post('/api/auth/register', form);
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Registration failed');
        }
    }
);

export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async (form: { username?: string; newPassword?: string; currentPassword?: string }, { rejectWithValue }) => {
        try {
            const res = await axios.put('/api/profile/update', form);
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Update failed');
        }
    }
);

export const deleteAccount = createAsyncThunk(
    'auth/deleteAccount',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.delete('/api/profile/delete');
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Delete failed');
        }
    }
);

export const loadUserFromToken = createAsyncThunk(
    'auth/loadUser',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return rejectWithValue('No token found');

            const response = await axios.get('/api/profile/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return { ...response.data, token };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Auth failed');
        }
    }
);


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        /**
         * Logs the user out by clearing the user state and removing the
         * token from both the state and localStorage.
         */
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
        },
        /**
         * A simple action to mark the initial authentication check as complete,
         * used when no token is found on startup.
         */
        authCheckCompleted: (state) => {
            state.initLoading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Reducers for the login action
            .addCase(loginUser.pending, (state) => {
                state.loading = 'pending';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                const { token, user: userInfo } = action.payload;
                state.loading = 'succeeded';
                state.token = token;
                state.user = {
                    id: userInfo.id,
                    name: userInfo.username, // Mapping backend's 'username' to frontend's 'name'
                    email: userInfo.email,
                };
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.payload as string;
                state.user = null;
                state.token = null;
            })

            // Reducers for the initial token verification on page load
            .addCase(verifyAuth.pending, (state) => {
                state.initLoading = true;
            })
            .addCase(verifyAuth.fulfilled, (state, action: PayloadAction<UserProfileDto>) => {
                state.initLoading = false;
                state.user = {
                    id: action.payload.id,
                    name: action.payload.username,
                    email: action.payload.email,
                };
            })
            .addCase(verifyAuth.rejected, (state, action) => {
                // This case is crucial: if token verification fails, we log the user out.
                state.initLoading = false;
                state.user = null;
                state.token = null;
                localStorage.removeItem('token'); // Clean up the invalid token
                console.error("Authentication verification failed:", action.payload);
            });
    },
});

export const { logout, authCheckCompleted } = authSlice.actions;

export default authSlice.reducer;
