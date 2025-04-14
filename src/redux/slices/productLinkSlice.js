
import { createSlice } from '@reduxjs/toolkit';

const productLinkSlice = createSlice({
  name: 'product',
  initialState: {
    currentProduct: {
      url: '',
      type: '', 
      title: '',
      price: 0,
      brand: '',
      yakaType: '',
      color: ''
    },
    clothingLinks: []
  },
  reducers: {
    setProductUrl: (state, action) => {
      state.currentProduct.url = action.payload;
    },
    setProductType: (state, action) => {
      // Handle both cases - if payload is object or string
      state.currentProduct.type = typeof action.payload === 'object' 
        ? action.payload.type 
        : action.payload;
    },
    setProductTitle: (state, action) => {
      state.currentProduct.title = action.payload;
    },
    setProductPrice: (state, action) => {
      state.currentProduct.price = action.payload;
    },
    setProductBrand: (state, action) => {
      state.currentProduct.brand = action.payload; 
    },
    setYakaType: (state, action) => {
      state.currentProduct.yakaType = action.payload;
    },
    setColor: (state, action) => {
      state.currentProduct.color = action.payload;
    },

    addProductLink: (state) => {
      if (state.currentProduct.url) {
        if (!state.currentProduct.type) {
          console.warn("Ürün tipi belirtilmedi!");
          return;
        }
        
        state.clothingLinks.push({
          type: state.currentProduct.type,
          url: state.currentProduct.url,
          title: state.currentProduct.title || '',
          price: state.currentProduct.price || 0,
          brand: state.currentProduct.brand || '',
          yakaType: state.currentProduct.yakaType || '',
          color: state.currentProduct.color || ''
        });
        
        state.currentProduct = {
          url: '',
          type: '',
          title: '',
          price: 0,
          brand: '',
          yakaType: '',
          color: ''
        };
      }
    },
    removeProductLink: (state, action) => {
      state.clothingLinks.splice(action.payload, 1);
    },
    resetProductLinks: (state) => {
      state.clothingLinks = [];
    }
  }
});

export const { 
  setProductUrl,
  setProductType,
  setProductTitle,
  setProductPrice,
  setProductBrand,
  setYakaType,
  setColor,
  addProductLink,
  removeProductLink,
  resetProductLinks
} = productLinkSlice.actions;

export default productLinkSlice.reducer;

