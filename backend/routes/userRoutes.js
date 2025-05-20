const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');
const { upload, multerErrorHandler } = require('../utils/multer');

router.put('/profile', jwtMiddleware, userController.updateProfile);
router.get('/profile', jwtMiddleware, userController.getProfile);
router.get('/profile/:userId', userController.getUserProfileById);
router.post('/add-travel-plan', jwtMiddleware, upload.single('profilePic'),  multerErrorHandler, userController.addTravelPlan);
router.get('/search', userController.searchByDestination);

module.exports = router;