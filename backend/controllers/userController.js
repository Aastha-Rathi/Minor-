const User = require('../models/User');
const mongoose = require('mongoose');

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile', error: err });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile', error: err });
  }
};

exports.getUserProfileById = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // First try to find by the custom userId field
    let user = await User.findOne({ userId }).select('-password');
    
    // If not found, try to find by MongoDB _id (in case userId is actually an _id)
    if (!user && mongoose.Types.ObjectId.isValid(userId)) {
      user = await User.findById(userId).select('-password');
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user profile by ID:', err);
    res.status(500).json({ message: 'Error fetching user profile', error: err.message });
  }
};

exports.addTravelPlan = async (req, res) => {
  try {
    const {
      name,
      bio,
      travelerType,
      interests,
      preferredDestinations,
      travelDates
    } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update profile pic if provided
    if (req.file) {
      user.profilePic = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }
    
    // Update basic info
    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (travelerType) user.travelerType = travelerType;
    
    // Parse JSON strings for arrays
    if (interests) {
      try {
        user.interests = JSON.parse(interests);
      } catch (e) {
        console.error('Error parsing interests:', e);
        // If parsing fails, try treating it as a single string
        user.interests = [interests];
      }
    }
    
    if (preferredDestinations) {
      try {
        user.preferredDestinations = JSON.parse(preferredDestinations);
      } catch (e) {
        console.error('Error parsing preferredDestinations:', e);
        // If parsing fails, try treating it as a single string
        user.preferredDestinations = [preferredDestinations];
      }
    }
    
    // Handle travel dates
    if (travelDates && travelDates.from && travelDates.to) {
      user.travelDates = {
        from: new Date(travelDates.from),
        to: new Date(travelDates.to)
      };
    } else if (req.body['travelDates[from]'] && req.body['travelDates[to]']) {
      // Alternative format that might be used by FormData
      user.travelDates = {
        from: new Date(req.body['travelDates[from]']),
        to: new Date(req.body['travelDates[to]'])
      };
    }
    
    await user.save();
    
    console.log('Updated user profile:', user);
    
    res.status(200).json({
      message: 'Travel plan and profile updated',
      user
    });
  } catch (err) {
    console.error('Error in addTravelPlan:', err);
    res.status(500).json({ message: 'Error updating travel plan/profile', error: err.message });
  }
};

exports.searchByDestination = async (req, res) => {
  try {
    const { destination } = req.query;
    if (!destination) {
      return res.status(400).json({ message: 'Destination parameter is required' });
    }

    const users = await User.find({
      'preferredDestinations': { $regex: destination, $options: 'i' }
    }).select('userId username name bio profilePic travelerType interests preferredDestinations');

    res.status(200).json({ results: users });
  } catch (err) {
    res.status(500).json({ message: 'Error searching users', error: err.message });
  }
};