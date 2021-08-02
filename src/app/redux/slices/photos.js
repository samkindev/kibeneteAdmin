import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from '../../config/axios';

import { compareDates } from '../../customeFunctions/helpers';

const photoEntity = createEntityAdapter({
    selectId: item => item._id,
    sortComparer: (a, b) => compareDates(a.createdAt, b.createdAt)
});

const initialState = photoEntity.getInitialState({
    count: 0,
    loadingData: false,
    status: 'idle',
    error: null,
});

export const getphotosCount = createAsyncThunk(
    "photos/get count",
    async () => {
        const response = await axios.get('/photo/count');
        return response.data;
    }
);

export const getPhotos = createAsyncThunk(
    "photos/get all",
    async () => {
        const response = await axios.get('/photo');
        return response.data;
    }
);

export const createPhoto = createAsyncThunk(
    "photos/create one",
    async (data) => {
        const response = await axios.post('/photo/' + data.placeId, data.formData);
        return response.data;
    }
);

export const { reducer } = createSlice({
    name: "photos",
    initialState,
    extraReducers: {
        [getphotosCount.pending]: (state) => {
            state.status = "loading";
        },
        [getphotosCount.fulfilled]: (state, action) => {
            const data = action.payload;
            if (data.code) {
                state.error = data;
                state.status = "failed";
            } else {
                state.count = data.count;
                state.status = "fulfilled";
            }
        },
        [getphotosCount.rejected]: (state, action) => {
            state.error = action.payload;
            state.status = "failed";
        },
        [createPhoto.pending]: (state) => {
            state.status = "loading";
        },
        [createPhoto.fulfilled]: (state, action) => {
            const data = action.payload;
            if (data.code) {
                state.error = data;
                state.status = "failed";
            } else {
                photoEntity.updateOne(state, data);
                state.status = "fulfilled";
            }
        },
        [createPhoto.rejected]: (state, action) => {
            state.error = action.payload;
        },
        [getPhotos.pending]: (state) => {
            state.status = "failed";
            state.loadingData = true;
        },
        [getPhotos.fulfilled]: (state, action) => {
            const data = action.payload;
            if (data.code) {
                state.error = data;
            } else {
                photoEntity.upsertMany(state, data);
            }
            state.loadingData = false;
        },
        [getPhotos.rejected]: (state, action) => {
            state.error = action.payload;
            state.loadingData = false;
        }
    }
});

export const {
    selectAll,
} = photoEntity.getSelectors(state => state.photos);

export const getCount = state => state.photos.count;
export const getRequestStatus = state => state.photos.status;
export const getError = state => state.photos.error;
export const getLoadingDataState = state => state.photos.loadingData;