import { configureStore } from '@reduxjs/toolkit';

import { reducer as photosReducer } from './redux/slices/photos';
import { reducer as placesReducer } from './redux/slices/places';
import { reducer as categoriesReducer } from './redux/slices/category';
import { reducer as adminReducer } from './redux/slices/admin';

export const store = configureStore({
  reducer: {
    admin: adminReducer,
    places: placesReducer,
    photos: photosReducer,
    categories: categoriesReducer,
  },
});
