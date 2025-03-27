import { createContext, useState, useEffect } from 'react';
import { messageList as initialMessages } from '../../utils/helpers';

export const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState(initialMessages);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  useEffect(() => {
    // Okunmamış mesajları kontrol et
    const unreadExists = messages.some(chat =>
      chat.messages.some(message => !message.isRead)
    );
    setHasUnreadMessages(unreadExists);
  }, [messages]);

  // Mesajı okundu olarak işaretleme fonksiyonu
  const markAsRead = (messageId) => {
    setMessages(prevMessages =>
      prevMessages.map(chat => {
        if (chat.id === messageId) {
          return {
            ...chat,
            messages: chat.messages.map(msg => ({ ...msg, isRead: true }))
          };
        }
        return chat;
      })
    );
  };

  return (
    <MessageContext.Provider value={{ messages, hasUnreadMessages, markAsRead }}>
      {children}
    </MessageContext.Provider>
  );
};
