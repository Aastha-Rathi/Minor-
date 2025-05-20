import api from './api';

const getProfile = async () => {
  try {
    const response = await api.get('/api/user/profile');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch profile:', error.response?.data?.message || error.message);
    throw error;
  }
};

const getUserProfileById = async (userId) => {
  try {
    const response = await api.get(`/api/user/profile/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch profile for user ${userId}:`, error.response?.data?.message || error.message);
    throw error;
  }
};

const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/api/user/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Failed to update profile:', error.response?.data?.message || error.message);
    throw error;
  }
};

const addTravelPlan = async (formData) => {
  try {
    const response = await api.post('/api/user/add-travel-plan', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to add travel plan:', error.response?.data?.message || error.message);
    throw error;
  }
};

const searchByDestination = async (destination) => {
  try {
    const response = await api.get(`/api/user/search?destination=${destination}`);
    return response.data.results;
  } catch (error) {
    console.error('Failed to search users:', error.response?.data?.message || error.message);
    throw error;
  }
};

export default {
  getProfile,
  getUserProfileById,
  updateProfile,
  addTravelPlan,
  searchByDestination
};
