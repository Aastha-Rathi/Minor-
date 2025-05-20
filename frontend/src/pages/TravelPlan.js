import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import profileService from "../services/profileService";
import authService from "../services/authService";

const TravelPlan = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    travelerType: "solo",
    interests: [],
    preferredDestinations: [],
    travelDates: {
      from: "",
      to: ""
    }
  });
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  
  useEffect(() => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      navigate("/login");
    }
    
    // Pre-fill form with user info
    const userInfo = authService.getUserInfo();
    if (userInfo) {
      setFormData(prevData => ({
        ...prevData,
        name: userInfo.username || "",
      }));
    }
    
    // Clean up preview URL
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleInterestsChange = (e) => {
    const interests = e.target.value.split(",").map(item => item.trim()).filter(item => item);
    setFormData({
      ...formData,
      interests
    });
  };
  
  const handleDestinationsChange = (e) => {
    const destinations = e.target.value.split(",").map(item => item.trim()).filter(item => item);
    setFormData({
      ...formData,
      preferredDestinations: destinations
    });
  };
  
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      travelDates: {
        ...formData.travelDates,
        [name]: value
      }
    });
  };
  
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Create FormData object for multipart/form-data
      const submitData = new FormData();
      
      // Add all form fields
      submitData.append("name", formData.name);
      submitData.append("bio", formData.bio);
      submitData.append("travelerType", formData.travelerType);
      
      // Add arrays as JSON strings
      submitData.append("interests", JSON.stringify(formData.interests));
      submitData.append("preferredDestinations", JSON.stringify(formData.preferredDestinations));
      
      // Add travel dates
      if (formData.travelDates.from && formData.travelDates.to) {
        submitData.append("travelDates[from]", formData.travelDates.from);
        submitData.append("travelDates[to]", formData.travelDates.to);
      }
      
      // Add profile pic if selected
      if (profilePic) {
        submitData.append("profilePic", profilePic);
      }
      
      // Submit the data
      const response = await profileService.addTravelPlan(submitData);
      setSuccess(true);
      
      // Redirect to profile after 1.5 seconds
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
      
    } catch (err) {
      console.error("Error updating travel plan:", err);
      setError(err.response?.data?.message || "Failed to update travel plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-trippiko-accent mb-6">Update Your Travel Plans</h1>
      
      {/* Success message */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Travel plan updated successfully! Redirecting to your profile...
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-trippiko-card rounded-lg shadow p-6">
        {/* Profile Picture */}
        <div className="mb-4">
          <label className="block text-trippiko-light mb-2">Profile Picture</label>
          <div className="flex items-center gap-4">
            {preview ? (
              <img src={preview} alt="Profile Preview" className="w-24 h-24 rounded-full object-cover" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-trippiko-light flex items-center justify-center">
                <span className="text-trippiko-dark">No Image</span>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleProfilePicChange}
              className="block w-full text-sm text-trippiko-light file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-trippiko-accent file:text-trippiko-dark"
            />
          </div>
        </div>
        
        {/* Name */}
        <div className="mb-4">
          <label className="block text-trippiko-light mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 rounded bg-trippiko-bg text-trippiko-light"
            placeholder="Your name"
          />
        </div>
        
        {/* Bio */}
        <div className="mb-4">
          <label className="block text-trippiko-light mb-2">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full p-2 rounded bg-trippiko-bg text-trippiko-light"
            placeholder="Tell us about yourself"
            rows="3"
          ></textarea>
        </div>
        
        {/* Traveler Type */}
        <div className="mb-4">
          <label className="block text-trippiko-light mb-2">Traveler Type</label>
          <select
            name="travelerType"
            value={formData.travelerType}
            onChange={handleChange}
            className="w-full p-2 rounded bg-trippiko-bg text-trippiko-light"
          >
            <option value="solo">Solo Traveler</option>
            <option value="group">Group Traveler</option>
          </select>
        </div>
        
        {/* Interests */}
        <div className="mb-4">
          <label className="block text-trippiko-light mb-2">Interests (comma-separated)</label>
          <input
            type="text"
            value={formData.interests.join(", ")}
            onChange={handleInterestsChange}
            className="w-full p-2 rounded bg-trippiko-bg text-trippiko-light"
            placeholder="Photography, Hiking, Food, etc."
          />
        </div>
        
        {/* Preferred Destinations */}
        <div className="mb-4">
          <label className="block text-trippiko-light mb-2">Preferred Destinations (comma-separated)</label>
          <input
            type="text"
            value={formData.preferredDestinations.join(", ")}
            onChange={handleDestinationsChange}
            className="w-full p-2 rounded bg-trippiko-bg text-trippiko-light"
            placeholder="Paris, Bali, Tokyo, etc."
          />
        </div>
        
        {/* Travel Dates */}
        <div className="mb-6">
          <label className="block text-trippiko-light mb-2">Travel Dates</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-trippiko-light mb-1">From</label>
              <input
                type="date"
                name="from"
                value={formData.travelDates.from}
                onChange={handleDateChange}
                className="w-full p-2 rounded bg-trippiko-bg text-trippiko-light"
              />
            </div>
            <div>
              <label className="block text-trippiko-light mb-1">To</label>
              <input
                type="date"
                name="to"
                value={formData.travelDates.to}
                onChange={handleDateChange}
                className="w-full p-2 rounded bg-trippiko-bg text-trippiko-light"
              />
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-trippiko-accent text-trippiko-dark font-bold py-3 px-4 rounded hover:bg-opacity-90 transition-all"
        >
          {loading ? "Updating..." : "Update Travel Plan"}
        </button>
      </form>
    </div>
  );
};

export default TravelPlan; 