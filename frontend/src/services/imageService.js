import api from './api';

const uploadImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await api.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.imageUrl;
  } catch (error) {
    console.error('Failed to upload image:', error.response?.data?.message || error.message);
    throw error;
  }
};

export default {
  uploadImage
}; 