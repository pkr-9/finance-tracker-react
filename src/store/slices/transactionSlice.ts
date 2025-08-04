import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from '../../api/axios';
import type { Transaction } from '../../features/transactions/types';

interface TransactionState {
    list: Transaction[];
    loading: boolean;
    error: string | null;
}

const initialState: TransactionState = {
    list: [],
    loading: false,
    error: null,
};

export const fetchTransactions = createAsyncThunk(
    'transactions/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get('/api/transactions');
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Fetch failed');
        }
    }
);

export const addTransaction = createAsyncThunk(
    'transactions/add',
    async (tx: Omit<Transaction, 'id'>, { rejectWithValue }) => {
        try {
            const res = await axios.post('/api/transactions', tx);
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Add failed');
        }
    }
);

export const updateTransaction = createAsyncThunk(
    'transactions/update',
    async (tx: Transaction, { rejectWithValue }) => {
        try {
            const res = await axios.put(`/api/transactions/${tx.id}`, tx);
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Update failed');
        }
    }
);

export const deleteTransaction = createAsyncThunk(
    'transactions/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            await axios.delete(`/api/transactions/${id}`);
            return id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Delete failed');
        }
    }
);

const transactionSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchTransactions.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTransactions.fulfilled, (state, action: PayloadAction<Transaction[]>) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(addTransaction.fulfilled, (state, action: PayloadAction<Transaction>) => {
                state.list.push(action.payload);
            })
            .addCase(updateTransaction.fulfilled, (state, action: PayloadAction<Transaction>) => {
                const index = state.list.findIndex((t) => t.id === action.payload.id);
                if (index !== -1) state.list[index] = action.payload;
            })
            .addCase(deleteTransaction.fulfilled, (state, action: PayloadAction<string>) => {
                state.list = state.list.filter((tx) => tx.id !== action.payload);
            });
    },
});

export default transactionSlice.reducer;
