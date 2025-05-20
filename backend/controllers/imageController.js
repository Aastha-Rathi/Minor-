const imageUpload = async (req, res) => {
    try {
        console.log("Inside imageUpload controller"); // Check if controller is reached
        console.log("Uploaded file data:", req.file); // Log file data

        if (!req.file) {
            console.log("No file uploaded"); // Log if no file is uploaded
            return res.status(400).json({ error: true, message: "No file uploaded" });
        }

        const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
        console.log("Image URL:", imageUrl); // Log the constructed image URL
        res.status(201).json({ imageUrl });
    } catch (error) {
        console.error("Error in imageUpload controller:", error); // Log any errors
        res.status(500).json({ error: true, message: error.message });
    }
};

module.exports = { imageUpload };