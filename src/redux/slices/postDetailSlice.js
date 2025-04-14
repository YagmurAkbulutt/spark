// postDetailSlice.js
import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  postData: {
    title: '',
    description: '',
    tags: [],
    mentions: [],
    poll: null,
    clothingLinks: [],
    location: '',
    image: null,
  },
  status: 'idle',
  error: null,
};

const postDetailSlice = createSlice({
  name: 'postDetail',
  initialState,
  reducers: {
    setTitle: (state, action) => {
      state.postData.title = action.payload;
    },
    updateDesc: (state, action) => {
      state.postData.description = action.payload;
      // Açıklama değiştiğinde etiket ve mention'ları güncelle
      const text = action.payload;

      // Etiketleri bul (birden fazla # ile başlayan kelimeler)
      const tagMatches = text.match(/#\w+/g) || [];
      const uniqueTags = [...new Set(tagMatches.map(tag => tag.substring(1)))]; // # işaretini kaldır
      state.postData.tags = uniqueTags;

      // Mention'ları bul (birden fazla @ ile başlayan kelimeler)
      const mentionMatches = text.match(/@\w+/g) || [];
      const uniqueMentions = [
        ...new Set(mentionMatches.map(mention => mention.substring(1))),
      ]; // @ işaretini kaldır
      state.postData.mentions = uniqueMentions;
    },
    resetTags: state => {
      state.postData.tags = [];
    },
    addTag: (state, action) => {
      const description = state.postData.description;
      state.postData.description = description + ' #';
      // TextInput'a odaklan
    },
    setImage: (state, action) => {
      state.postData.image = action.payload; // File object
    },
    
    setLocation: (state, action) => {
      state.postData.location = action.payload;
    },
    
    addClothingLink: (state, action) => {
      // action.payload formatı:
      // { type: 'shirt', url: '...', title: '...', price: 99, brand: '...' }
      state.postData.clothingLinks.push(action.payload);
    },
    
    removeClothingLink: (state, action) => {
      state.postData.clothingLinks = state.postData.clothingLinks.filter(
        (_, index) => index !== action.payload
      );
    },
    resetMentions: state => {
      state.postData.mentions = [];
    },
    addMention: (state, action) => {
      const description = state.postData.description;
      state.postData.description = description + ' @';
      // TextInput'a odaklan
    },
    setPoll: (state, action) => {
      state.postData.poll = action.payload;
    },
    resetPostDetail: () => initialState,
  },
});

// Sadece tanımlı action'ları export edin
export const {
  setTitle,
  setTags,
setImage, setLocation, addClothingLink, removeClothingLink,
  setMentions,
  updateDesc,
  insertTag,
  deleteTag,
  insertMention,
  deleteMention,
  setPoll,
  resetPostDetail,
  setDescription,
  resetTags,
  addTag,
  resetMentions,
  addMention,
} = postDetailSlice.actions;

export default postDetailSlice.reducer;
