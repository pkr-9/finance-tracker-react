import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from '../../api/axios';
import type { Budget } from '../../features/budgets/types';

interface BudgetState {
    list: Budget[];
    loading: boolean;
    error: string | null;
}

const initialState: BudgetState = {
    list: [],
    loading: false,
    error: null,
};

export const fetchBudgets = createAsyncThunk('budgets/fetch', async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get('/api/budgets');
        return res.data;
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || 'Fetch failed');
    }
});

export const addBudget = createAsyncThunk(
    'budgets/add',
    async (budget: Omit<Budget, 'id' | 'spent'>, { rejectWithValue }) => {
        try {
            const res = await axios.post('/api/budgets', budget);
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Add failed');
        }
    }
);

export const updateBudget = createAsyncThunk(
    'budgets/update',
    async (budget: Budget, { rejectWithValue }) => {
        try {
            const updatePayload = {
                category: budget.category,
                limitAmount: budget.limitAmount,
                month: budget.month,
            };
            const res = await axios.put(`/api/budgets/${budget.id}`, updatePayload);
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Update failed');
        }
    }
);

export const deleteBudget = createAsyncThunk(
    'budgets/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            await axios.delete(`/api/budgets/${id}`);
            return id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Delete failed');
        }
    }
);

const budgetSlice = createSlice({
    name: 'budgets',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchBudgets.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBudgets.fulfilled, (state, action: PayloadAction<Budget[]>) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(addBudget.fulfilled, (state, action: PayloadAction<Budget>) => {
                state.list.push(action.payload);
            })
            .addCase(updateBudget.fulfilled, (state, action: PayloadAction<Budget>) => {
                const index = state.list.findIndex((b) => b.id === action.payload.id);
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
            })
            .addCase(deleteBudget.fulfilled, (state, action: PayloadAction<string>) => {
                state.list = state.list.filter((b) => b.id !== action.payload);
            });
    },
});

export default budgetSlice.reducer;