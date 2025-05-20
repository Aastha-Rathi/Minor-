const TravelStory = require('../models/TravelStory');

exports.addTravelStory = async (req, res) => {
  try {
    const { title, story, visitedLocation, visitedDate } = req.body;
    if (!title || !story || !visitedLocation || !visitedDate || !req.file) {
      return res.status(400).json({ error: 'All fields including image are required.' });
    }
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    const newStory = new TravelStory({
      userId: req.user.userId,
      username: req.user.username,
      title,
      story,
      visitedLocation,
      imageUrl,
      visitedDate
    });
    await newStory.save();
    res.status(201).json({
      message: 'Travel story added successfully.',
      story: newStory
    });
  } catch (error) {
    console.error('Error adding travel story:', error);
    res.status(500).json({ error: 'Server error while adding travel story.' });
  }
};

exports.getAllTravelStories = async (req, res) => {
  try {
    const stories = await TravelStory.find().sort({ createdAt: -1 });
    res.status(200).json({ stories });
  } catch (error) {
    console.error('Error fetching travel stories:', error);
    res.status(500).json({ error: 'Server error while fetching travel stories.' });
  }
};

exports.getTravelStoriesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const stories = await TravelStory.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ stories });
  } catch (error) {
    console.error('Error fetching user travel stories:', error);
    res.status(500).json({ error: 'Server error while fetching user travel stories.' });
  }
};
