import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from '../../config/axios';

const categoryEntity = createEntityAdapter({
    selectId: item => item._id,
    sortComparer: (a, b) => a.name.localeCompare(b.name)
});

const initialState = categoryEntity.getInitialState({
    count: 0,
    loadingData: false,
    status: 'idle',
    error: null,
});

export const getCategories = createAsyncThunk(
    "categories/get all",
    async () => {
        const res = await axios.get('/category');
        return res.data;
    }
);

export const getCategoriesCount = createAsyncThunk(
    "categories/get count",
    async () => {
        const response = await axios.get('/category/count');
        return response.data;
    }
);

export const createCategory = createAsyncThunk(
    "categories/create_one",
    async (data) => {
        const response = await axios.post('/category', data);
        return response.data;
    }
);

export const updateCategory = createAsyncThunk(
    "categories/update",
    async (data) => {
        const response = await axios.post(`/category/${data.categoryId}/update`, data.data);
        return response.data;
    }
);

export const { reducer } = createSlice({
    name: "categories",
    initialState,
    extraReducers: {
        [getCategories.pending]: (state) => {
            state.status = "loading";
            state.loadingData = true;
        },
        [getCategories.fulfilled]: (state, action) => {
            const data = action.payload;
            if (data.code) {
                state.error = data;
                state.status = 'failed';
            } else {
                categoryEntity.upsertMany(state, data);
                state.status = 'fulfilled';
            }
            state.loadingData = false;
        },
        [getCategories.rejected]: (state, action) => {
            state.error = action.payload;
            state.status = 'failed';
            state.loadingData = false;
        },
        [getCategoriesCount.pending]: (state) => {
            state.status = "loading";
        },
        [getCategoriesCount.fulfilled]: (state, action) => {
            const data = action.payload;
            if (data.code) {
                state.status = "failed";
                state.error = data;
            } else {
                state.status = "fulfilled";
                state.count = data.count;
            }
        },
        [getCategoriesCount.rejected]: (state, action) => {
            state.error = action.payload;
            state.status = "failed";
        },
        [createCategory.pending]: (state) => {
            state.status = "loading";
        },
        [createCategory.fulfilled]: (state, action) => {
            const data = action.payload;
            if (data.code) {
                state.status = "failed";
                state.error = data;
            } else {
                categoryEntity.addOne(state, data.saved);
                state.count = state.count + 1;
                state.status = "fulfilled";
            }
        },
        [createCategory.rejected]: (state, action) => {
            state.error = action.payload;
            state.status = "failed";
        },
        [updateCategory.pending]: (state) => {
            state.status = "loading";
        },
        [updateCategory.fulfilled]: (state, action) => {
            const data = action.payload;
            if (data.code) {
                state.status = "failed";
                state.error = data;
            } else {
                const cat = state.entities[data._id];
                if (cat) {
                    cat.name = data.name;
                    cat.description = data.description;
                }
                state.status = "fulfilled";
            }
        },
        [updateCategory.rejected]: (state, action) => {
            state.error = action.payload;
            state.status = "failed";
        },
    }
});

export const {
    selectAll: getAllCat,
    selectById: getCatById,
} = categoryEntity.getSelectors(state => state.categories);

export const getCount = state => state.categories.count;
export const getRequestStatus = state => state.categories.status;
export const getError = state => state.categories.error;
export const getLoadingDataState = state => state.categories.loadingData;