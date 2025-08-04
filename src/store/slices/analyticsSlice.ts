import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from '../../api/axios';

/**
 * Represents the structure of a single forecasted expense item.
 */
export interface Forecast {
    title: string;
    amount: number;
    category: string;
    projectedDate: string;
}

/**
 * Defines the state structure for the analytics slice.
 */
interface AnalyticsState {
    forecasts: Forecast[];
    loading: boolean;
    error: string | null;
}

const initialState: AnalyticsState = {
    forecasts: [],
    loading: false,
    error: null,
};

/**
 * An async thunk to fetch the expense forecast data from the backend.
 */
export const fetchForecast = createAsyncThunk(
    'analytics/fetchForecast',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/api/analytics/forecast');
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch forecast data');
        }
    }
);

const analyticsSlice = createSlice({
    name: 'analytics',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchForecast.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchForecast.fulfilled, (state, action: PayloadAction<Forecast[]>) => {
                state.loading = false;
                // Sort forecasts by projected date
                state.forecasts = action.payload.sort((a, b) =>
                    new Date(a.projectedDate).getTime() - new Date(b.projectedDate).getTime()
                );
            })
            .addCase(fetchForecast.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default analyticsSlice.reducer;
