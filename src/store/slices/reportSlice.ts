// src/store/slices/reportSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from '../../api/axios';

// The backend MonthlySummaryDto returns more data than the chart needs.
// We can define a simplified type for the slice state.
interface MonthlyReport {
    month: string;
    totalIncome: number;
    totalExpense: number;
}

interface ReportState {
    data: MonthlyReport[];
    loading: boolean;
    error: string | null;
}

const initialState: ReportState = {
    data: [],
    loading: false,
    error: null,
};

// Modify fetchReports to accept a month string (e.g., "2025-06")
export const fetchReports = createAsyncThunk(
    'reports/fetch',
    async (month: string, { rejectWithValue }) => {
        try {
            // Use the correct endpoint and pass the month as a query param
            const res = await axios.get(`/api/analytics/monthly-summary?month=${month}`);
            // Add the month to the response data for chart labeling
            return { ...res.data, month };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch reports');
        }
    }
);

const reportSlice = createSlice({
    name: 'reports',
    initialState,
    reducers: {
        clearReports: (state) => {
            state.data = [];
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchReports.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchReports.fulfilled, (state, action: PayloadAction<MonthlyReport>) => {
                state.loading = false;
                // Avoid duplicates and add the new month's data
                const existingIndex = state.data.findIndex(d => d.month === action.payload.month);
                if (existingIndex === -1) {
                    state.data.push(action.payload);
                    // Sort by month
                    state.data.sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
                }
            })
            .addCase(fetchReports.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearReports } = reportSlice.actions;
export default reportSlice.reducer;