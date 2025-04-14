// colorSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedColors: [],
  // (İsteğe bağlı) uygulamada kullanabileceğin tüm renkleri sabit liste olarak buraya koyabilirsin
  availableColors: [
    { id: 1, name: 'Siyah', hex: '#000000' },
    { id: 2, name: 'Beyaz', hex: '#FFFFFF' },
    { id: 3, name: 'Kırmızı', hex: '#FF0000' },
    { id: 4, name: 'Mavi', hex: '#0000FF' },
    { id: 5, name: 'Yeşil', hex: '#00FF00' },
    { id: 6, name: 'Sarı', hex: '#FFFF00' },
    { id: 7, name: 'Mor', hex: '#800080' },
    { id: 8, name: 'Gri', hex: '#808080' },
    { id: 9, name: 'Turuncu', hex: '#FFA500' },
    { id: 10, name: 'Pembe', hex: '#FFC0CB' },
  ],
};

const colorSlice = createSlice({
  name: 'colors',
  initialState,
  reducers: {
    setSelectedColors(state, action) {
      state.selectedColors = action.payload;
    },
    toggleColorSelection(state, action) {
      const color = action.payload;
      const existingIndex = state.selectedColors.findIndex(c => c.id === color.id);
      if (existingIndex >= 0) {
        // Seçili ise çıkar
        state.selectedColors.splice(existingIndex, 1);
      } else {
        // Değilse ekle
        state.selectedColors.push(color);
      }
    },
    clearSelectedColors(state) {
      state.selectedColors = [];
    }
  },
});

export const {
  setSelectedColors,
  toggleColorSelection,
  clearSelectedColors,
} = colorSlice.actions;

export default colorSlice.reducer;
