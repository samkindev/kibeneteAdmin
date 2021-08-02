import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from '../../config/axios';


const placeEntity = createEntityAdapter({
    selectId: item => item._id,
    sortComparer: (a, b) => a.name.localeCompare(b.name)
});

const initialState = placeEntity.getInitialState({
    count: 0,
    loadingData: false,
    status: 'idle',
    error: null,
});

export const getPlacesCount = createAsyncThunk(
    "places/get count",
    async () => {
        const response = await axios.get('/place/count');
        return response.data;
    }
);

export const getPlaces = createAsyncThunk(
    "places/get all",
    async () => {
        const response = await axios.get('/place');
        return response.data;
    }
);

export const createPlace = createAsyncThunk(
    "places/create one",
    async (data) => {
        const response = await axios.post('/place', data);
        return response.data;
    }
);

export const { reducer, actions } = createSlice({
    name: "places",
    initialState,
    reducers: {
        addPhotoToPlace: (state, action) => {
            const place = state.entities[action.payload.placeId];
            console.log(place);
            if (place) {
                place.photos.push(action.payload.photoPath);
            }
        },
        updatePlaceData: (state, action) => {
            const place = state.entities[action.payload.placeId];
            if (place) {
                place[action.payload.label] = action.payload.value;
            }
        },
        clearErrors: (state) => {
            state.error = null;
        }
    },
    extraReducers: {
        [getPlacesCount.pending]: (state) => {
            state.status = "loading";
        },
        [getPlacesCount.fulfilled]: (state, action) => {
            const data = action.payload;
            if (data.code) {
                state.error = data;
                state.status = 'failed';
            } else {
                state.count = data.count;
                state.status = 'complited';
            }
        },
        [getPlacesCount.rejected]: (state, action) => {
            state.error = action.payload;
            state.status = 'failed';
        },
        [createPlace.pending]: (state) => {
            state.status = "loading";
        },
        [createPlace.fulfilled]: (state, action) => {
            const data = action.payload;
            if (data.code) {
                state.error = data;
                state.status = 'failed';
            } else {
                placeEntity.addOne(state, data.saved);
                state.count += 1;
                state.status = 'complited';
            }
        },
        [createPlace.rejected]: (state, action) => {
            state.error = action.payload;
            state.status = 'failed';
        },
        [getPlaces.pending]: (state) => {
            state.loadingData = true;
        },
        [getPlaces.fulfilled]: (state, action) => {
            const data = action.payload;
            if (data.code) {
                state.error = data;
            } else {
                placeEntity.upsertMany(state, data);
            }
            state.loadingData = false;
        },
        [getPlaces.rejected]: (state, action) => {
            state.error = action.payload;
            state.loadingData = false;
        }
    }
});

export const {
    selectAll,
    selectById
} = placeEntity.getSelectors(state => state.places);

export const getCount = state => state.places.count;
export const getRequestStatus = state => state.places.status;
export const getError = state => state.places.error;
export const getLoadingData = state => state.places.loadingData;