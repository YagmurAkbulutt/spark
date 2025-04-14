import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  photoUri: null,
};

const photoSlice = createSlice({
  name: 'photo',
  initialState,
  reducers: {
    setPhotoUri(state, action) {
      state.photoUri = action.payload;
    },
    clearPhotoUri(state) {
      state.photoUri = null;
    }
  },
});

export const { setPhotoUri, clearPhotoUri } = photoSlice.actions;
export default photoSlice.reducer;
