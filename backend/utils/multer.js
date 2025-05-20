const multer = require("multer");
const path = require("path");

// Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads"); // Destination folder for storing uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
});

// File Filter to accept only images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true); // Accept file
    } else {
        cb(new Error("Only image files are allowed!"), false); // Reject file
    }
};

// Upload middleware with limits
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024, // Limit file size to 100MB
    },
});

// Error Handling Middleware
const multerErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Multer-specific errors
        return res.status(400).json({ message: `Multer Error: ${err.message}` });
    } else if (err) {
        // General errors
        return res.status(400).json({ message: err.message });
    }
    next();
};

module.exports = { upload, multerErrorHandler };