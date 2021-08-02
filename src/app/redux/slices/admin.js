import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axios';


const initialState = {
    admin: null,
    connected: false,
    status: 'idle',
    error: null,
};

export const loginAdmin = createAsyncThunk(
    'Admin/login',
    async (data) => {
        const response = await axios.post('/admin/login', data);
        return response.data;
    }
);

export const getAdminData = createAsyncThunk(
    'Admin/get Admin data',
    async () => {
        const response = await axios.get('/admin');
        return response.data;
    }
);

export const logoutAdmin = createAsyncThunk(
    'Admin/logout',
    async () => {
        const response = await axios.post('/admin/logout');
        return response.data;
    }
);

export const { reducer, actions } = createSlice({
    name: 'user',
    initialState,
    extraReducers: {
        [loginAdmin.pending]: (state) => {
            state.status = 'loading';
        },
        [loginAdmin.fulfilled]: (state, action) => {
            const data = action.payload;
            if (data.code) {
                state.error = data.message;
                state.status = 'failed';
            } else {
                state.admin = action.payload;
                state.connected = true;
                state.status = 'fulfilled';
                state.error = null;
            }
        },
        [loginAdmin.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        },
        [logoutAdmin.pending]: (state) => {
            state.status = 'loading';
        },
        [logoutAdmin.fulfilled]: (state, action) => {
            const data = action.payload;
            if (data.code) {
                state.error = data.message;
                state.status = 'failed';
            } else {
                state.admin = null;
                state.connected = false;
                state.status = 'fulfilled';
                state.error = null;
            }
        },
        [logoutAdmin.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        },
        [getAdminData.pending]: (state, action) => {
            state.status = 'loading';
        },
        [getAdminData.fulfilled]: (state, action) => {
            const data = action.payload;
            if (data.code) {
                state.status = 'failed';
                state.connected = false;
                state.admin = null;
            } else {
                state.admin = data;
                state.connected = true;
                state.status = 'fulfilled';
            }
        },
        [getAdminData.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        },
    }
});

export const getRequestStatus = state => state.admin.status;
export const getError = state => state.admin.error;
export const getAdmin = state => state.admin.admin;
export const getConnectionState = state => state.admin.connected;