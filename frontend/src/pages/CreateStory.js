import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import travelStoryService from "../services/travelStoryService";

const CreateStory = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    story: "",
    visitedLocation: "",
    visitedDate: ""
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Create FormData for multipart/form-data request
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('story', form.story);
      formData.append('visitedLocation', form.visitedLocation);
      formData.append('visitedDate', form.visitedDate);
      
      // Append the image file
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      // Submit the form
      await travelStoryService.createTravelStory(formData);
      
      // After successful submission
      navigate('/profile');
    } catch (error) {
      console.error("Error creating post:", error);
      setError(error.response?.data?.error || "Failed to create travel story. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-trippiko-card p-8 rounded-lg w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-heading text-trippiko-accent">Share Your Travel Story</h2>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-trippiko-accent mb-2">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Give your story a catchy title"
              className="w-full p-3 rounded-lg bg-trippiko-light text-trippiko-dark focus:outline-none focus:ring-2 focus:ring-trippiko-accent"
              required
            />
          </div>

          <div>
            <label className="block text-trippiko-accent mb-2">Location</label>
            <input
              name="visitedLocation"
              value={form.visitedLocation}
              onChange={handleChange}
              placeholder="Where did you visit?"
              className="w-full p-3 rounded-lg bg-trippiko-light text-trippiko-dark focus:outline-none focus:ring-2 focus:ring-trippiko-accent"
              required
            />
          </div>

          <div>
            <label className="block text-trippiko-accent mb-2">Visit Date</label>
            <input
              type="date"
              name="visitedDate"
              value={form.visitedDate}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-trippiko-light text-trippiko-dark focus:outline-none focus:ring-2 focus:ring-trippiko-accent"
              required
            />
          </div>

          <div>
            <label className="block text-trippiko-accent mb-2">Upload Image</label>
            <div className="flex flex-col gap-4">
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                  required
                />
                <label
                  htmlFor="image-upload"
                  className="w-full p-6 rounded-lg bg-trippiko-dark text-white cursor-pointer border-2 border-dashed border-trippiko-accent flex items-center justify-center hover:bg-opacity-90 transition-all hover:border-white"
                >
                  <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-trippiko-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xl font-semibold text-trippiko-accent">Click to upload image</span>
                    <p className="text-sm text-trippiko-light mt-2">PNG, JPG, JPEG up to 5MB</p>
                  </div>
                </label>
              </div>
              
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-trippiko-accent mb-2">Your Story</label>
            <textarea
              name="story"
              value={form.story}
              onChange={handleChange}
              placeholder="Share your travel experience..."
              className="w-full p-3 rounded-lg bg-trippiko-light text-trippiko-dark focus:outline-none focus:ring-2 focus:ring-trippiko-accent min-h-[200px] resize-y"
              required
            />
          </div>

          <div className="flex gap-4 mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 bg-trippiko-accent text-trippiko-dark px-6 py-3 rounded-lg font-semibold ${
                isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:bg-opacity-90'
              } transition-all`}
            >
              {isSubmitting ? 'Submitting...' : 'Share Story'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="flex-1 bg-trippiko-light text-trippiko-dark px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStory; 