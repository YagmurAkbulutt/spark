import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  photoUri: null,
  description: "",
  tags: [],
  category: "",
  brand: "",
};

const photoSlice = createSlice({
  name: "photo",
  initialState,
  reducers: {
    setPhoto: (state, action) => {
      state.photoUri = action.payload;
    },
    setDescription: (state, action) => {
      state.description = action.payload;
    },
    setTags: (state, action) => {
      state.tags = action.payload;
    },
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    setBrand: (state, action) => {
      state.brand = action.payload;
    },
    clearPhoto: (state) => {
      state.photoUri = null;
    },
  },
});

export const { setPhoto, setDescription, setTags, setCategory, setBrand, clearPhoto } = photoSlice.actions;
export default photoSlice.reducer;
