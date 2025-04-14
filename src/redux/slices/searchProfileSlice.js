import { createSlice } from '@reduxjs/toolkit';
import { searchProfile } from '../actions/searchActions';

const searchProfileSlice = createSlice({
  name: 'searchProfile',
  initialState: {
    users: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(searchProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload.data.users.map(user => ({
          id: user.id,
          username: user.username,
          profilePicture: user.profilePicture,
          bio: user.bio,
          followerCount: user.followerCount,
          followingCount: user.followingCount,
          posts: user.posts,
          fullName: user.fullName
        }));
      })
      .addCase(searchProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export default searchProfileSlice.reducer;
