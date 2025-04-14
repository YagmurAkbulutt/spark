import { useNavigation } from "@react-navigation/native";
import api from "../../api/api";
import { postCreateFailure, postCreateStart, postCreateSuccess } from "../slices/postCreateSlice";
import { useDispatch } from "react-redux";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData, { rejectWithValue }) => {
    try {
      console.log('Sending request with:', postData);
      
      const response = await api.post('posts', postData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        transformRequest: (data, headers) => {
          console.log('Final transformed data:', data);
          return data;
        }
      });
      
      console.log('Received response:', response);
      return response.data;
      
    } catch (error) {
      console.error('Full error object:', {
        message: error.message,
        config: error.config,
        response: error.response,
        stack: error.stack
      });
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
