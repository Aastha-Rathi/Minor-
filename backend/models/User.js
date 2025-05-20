const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true }, 
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true },

  name: String,
  bio: String,
  profilePic: String,
  travelerType: { type: String, enum: ['solo', 'group'] },
  interests: [String],

  preferredDestinations: [String],
  travelDates: {                  
    from: Date,
    to: Date
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);