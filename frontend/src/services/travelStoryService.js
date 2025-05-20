import api from './api';

const createTravelStory = async (formData) => {
  try {
    const response = await api.post('/api/travel-stories/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to create travel story:', error.response?.data?.error || error.message);
    throw error;
  }
};

const getAllTravelStories = async () => {
  try {
    const response = await api.get('/api/travel-stories/getall');
    return response.data.stories;
  } catch (error) {
    console.error('Failed to fetch travel stories:', error.response?.data?.error || error.message);
    throw error;
  }
};

const getUserTravelStories = async (userId) => {
  try {
    const response = await api.get(`/api/travel-stories/get/${userId}`);
    return response.data.stories;
  } catch (error) {
    console.error('Failed to fetch user travel stories:', error.response?.data?.error || error.message);
    throw error;
  }
};

export default {
  createTravelStory,
  getAllTravelStories,
  getUserTravelStories
}; 