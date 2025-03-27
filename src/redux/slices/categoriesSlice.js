import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [
    "Bluz", "Ceket", "Elbise", "Gömlek", "Jean", "Kazak", "Mont",
    "Pantolon", "Sweatshirt", "Şort", "Takım", "Tişört", "Tulum", "Etek"
  ],
  selectedCategories: [],
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    toggleCategory: (state, action) => {
      const category = action.payload;
      if (state.selectedCategories.includes(category)) {
        state.selectedCategories = state.selectedCategories.filter(c => c !== category);
      } else {
        state.selectedCategories.push(category);
      }
    },
  },
});

export const { toggleCategory } = categorySlice.actions;
export default categorySlice.reducer;