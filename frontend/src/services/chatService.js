import api from './api';

const getChatHistory = async (userId) => {
  try {
    const response = await api.get(`/api/chat/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch chat history:', error.response?.data?.message || error.message);
    throw error;
  }
};

const sendMessage = async (receiverId, messageText) => {
  try {
    const response = await api.post('/api/chat', { receiverId, messageText });
    return response.data;
  } catch (error) {
    console.error('Failed to send message:', error.response?.data?.message || error.message);
    throw error;
  }
};

export default {
  getChatHistory,
  sendMessage
}; 