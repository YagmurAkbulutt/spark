import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [
    "Bluz", "Ceket", "Elbise", "Gömlek", "Jean", "Kazak", "Mont",
    "Pantolon", "Sweatshirt", "Şort", "Takım", "Tişört", "Tulum", "Etek"
  ],
  selectedCategories: [],
  categoryProducts: {}
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    toggleCategory: (state, action) => {
      const category = action.payload;
      const index = state.selectedCategories.indexOf(category);
      
      if (index !== -1) {
        // Kategori zaten seçili, kaldırıyoruz
        state.selectedCategories.splice(index, 1);
        // İsteğe bağlı: Kategori kaldırıldığında ürün bilgilerini de sil
        // delete state.categoryProducts[category];
      } else {
        // Yeni kategori ekliyoruz
        state.selectedCategories.push(category);
        // Yalnızca bu kategori için boş bir obje oluştur (eğer yoksa)
        state.categoryProducts[category] = state.categoryProducts[category] || { 
          brand: "",
          color: "",
          collarType: "",
          url: ""
        };
      }
    },
    updateCategoryProduct: (state, action) => {
      const { category, field, value } = action.payload;
      if (state.selectedCategories.includes(category)) {
        // Kategori seçili değilse güncelleme yapma
        if (!state.categoryProducts[category]) {
          state.categoryProducts[category] = {};
        }
        state.categoryProducts[category][field] = value;
      }
    },
    setCategoryProduct: (state, action) => {
      const { category, productData } = action.payload;
      if (state.selectedCategories.includes(category)) {
        state.categoryProducts[category] = productData;
      }
    }
  },
});

export const { toggleCategory, updateCategoryProduct, setCategoryProduct } = categorySlice.actions;
export default categorySlice.reducer;