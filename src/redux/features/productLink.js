import { toggleBrandSelection } from "../slices/brandSlice";
import { setProductBrand } from "../slices/productLinkSlice";


export const toggleBrandWithProduct = (brand) => (dispatch, getState) => {
    // 1. Önce marka seçimini toggle et
    dispatch(toggleBrandSelection(brand));
    
    // 2. Eğer marka seçiliyse productLink'e ekle, değilse çıkar
    const { selectedBrands } = getState().brands;
    const isSelected = selectedBrands.some(b => b.id === brand.id);
    
    if (isSelected) {
      dispatch(setProductBrand({
        name: brand.name,
        id: brand.id
      }));
    } else {
      dispatch(setProductBrand({
        name: '',
        id: ''
      }));
    }
  };
  