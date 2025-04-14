import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedBrands: [],
  availableBrands:[
    { id: 1, name: "Adidas" },
    { id: 2, name: "Nike" },
    { id: 3, name: "Puma" },
    { id: 4, name: "Zara" },
    { id: 5, name: "H&M" },
    { id: 6, name: "LC Waikiki" },
    { id: 7, name: "Mavi" },
  ]
};

const brandSlice = createSlice({
  name: 'brands',
  initialState,
  reducers: {
    // Tüm markaları set etme (örneğin başlangıç parametresi için)
    setSelectedBrands(state, action) {
      state.selectedBrands = action.payload;
    },
    // Belirli bir markayı ekle veya çıkar
    toggleBrandSelection(state, action) {
      const brand = action.payload;
      const existingIndex = state.selectedBrands.findIndex(b => b.id === brand.id);
      if (existingIndex >= 0) {
        // Eğer marka seçili ise çıkar
        state.selectedBrands.splice(existingIndex, 1);
      } else {
        // Değilse ekle
        state.selectedBrands.push(brand);
      }
    },
    clearSelectedBrands(state) {
      state.selectedBrands = [];
    }
    
  },
});

export const { setSelectedBrands, toggleBrandSelection,clearSelectedBrands } = brandSlice.actions;
export default brandSlice.reducer;
