const express = require('express');
const router = express.Router();
const { upload, multerErrorHandler } = require('../utils/multer');
const { imageUpload } = require('../controllers/imageController');

router.post('/upload', upload.single('image'), multerErrorHandler, imageUpload);

module.exports = router;