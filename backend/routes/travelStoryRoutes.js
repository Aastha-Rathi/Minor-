const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/authMiddleware');
const { upload, multerErrorHandler } = require('../utils/multer');
const { addTravelStory, getAllTravelStories, getTravelStoriesByUserId } = require('../controllers/travelStoryController');

router.post('/add', isAuthenticated, upload.single('image'), multerErrorHandler, addTravelStory);
router.get('/getall', getAllTravelStories);
router.get('/get/:userId', getTravelStoriesByUserId);

module.exports = router;