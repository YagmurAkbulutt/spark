import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [], // Tüm mesajları burada saklayacağız
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    // Yeni bir mesaj gönder
    sendMessage: (state, action) => {
      const newMessage = {
        id: Date.now().toString(),
        senderId: action.payload.senderId,   // Gönderen kişi
        receiverId: action.payload.receiverId, // Alıcı kişi
        content: action.payload.content,    // Mesaj içeriği
        timestamp: new Date().toISOString(), // Zaman damgası
        status: 'sent', // "sent", "delivered", "read" gibi durumlar olabilir
      };
      state.messages.push(newMessage);
    },

    // Gelen mesajları ekle
    receiveMessage: (state, action) => {
      const newMessage = {
        id: action.payload.id,
        senderId: action.payload.senderId,
        receiverId: action.payload.receiverId,
        content: action.payload.content,
        timestamp: action.payload.timestamp,
        status: 'delivered', // Varsayılan olarak "delivered" yapıyoruz
      };
      state.messages.push(newMessage);
    },

    // Mesajın okunma durumunu güncelle
    markMessageAsRead: (state, action) => {
      const messageId = action.payload;
      const message = state.messages.find(msg => msg.id === messageId);
      if (message) {
        message.status = 'read';
      }
    },

    // Belirli bir mesajı sil
    deleteMessage: (state, action) => {
      state.messages = state.messages.filter(msg => msg.id !== action.payload);
    },

    // Belirli bir kullanıcıyla yapılan mesajlaşmaları getir
    getMessagesByUser: (state, action) => {
      return state.messages.filter(
        msg => msg.senderId === action.payload || msg.receiverId === action.payload
      );
    },

    // Tüm mesajları temizle (örn: oturumu kapatınca)
    clearMessages: (state) => {
      state.messages = [];
    }
  }
});

export const { 
  sendMessage, 
  receiveMessage, 
  markMessageAsRead, 
  deleteMessage, 
  getMessagesByUser, 
  clearMessages 
} = messagesSlice.actions;

export default messagesSlice.reducer;
