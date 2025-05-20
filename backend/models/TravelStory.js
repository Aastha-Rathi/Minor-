const mongoose = require('mongoose');

const travelStorySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  title: String,
  story: String,
  visitedLocation: String,
  imageUrl: String,
  visitedDate: Date
}, { timestamps: true });

module.exports = mongoose.model('TravelStory', travelStorySchema);