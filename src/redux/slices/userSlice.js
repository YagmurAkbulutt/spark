import { createSlice } from '@reduxjs/toolkit';
import { getUserInfo, profileUpdate } from '../actions/userActions';

const initialState = {
userInfo:null,
isLoading:false,
error:null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
 reducers:{},
  extraReducers: builder => {
    builder
    .addCase(getUserInfo.fulfilled, (state, action) => {
      state.isLoading = false;
      state.userInfo=action.payload
    })
    .addCase(getUserInfo.rejected, (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    })
    .addCase(getUserInfo.pending, state => {
      state.isLoading = true;
    })

   // profileUpdate 
   .addCase(profileUpdate.pending, (state) => {
    state.isLoading = true;
  })
  .addCase(profileUpdate.fulfilled, (state, action) => {
    state.userInfo = {
      ...state.userInfo,
      ...action.payload, 
    }; 
    state.isLoading = false;
  })
  .addCase(profileUpdate.rejected, (state, action) => {
    state.error = action.error.message;
    state.isLoading = false;
  });
  }
});

export default userSlice.reducer;
