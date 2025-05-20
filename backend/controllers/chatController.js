const Message = require('../models/Message');

// Get chat history between two users
exports.getChatHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user.userId; // Get userId from JWT token

        const messages = await Message.find({
            $or: [
                { senderId: currentUserId, receiverId: userId },
                { senderId: userId, receiverId: currentUserId }
            ]
        })
        .sort({ timestamp: 1 });

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching chat history', error: error.message });
    }
};

// Save a new message
exports.saveMessage = async (req, res) => {
    try {
        const { receiverId, messageText } = req.body;
        const senderId = req.user.userId; // Get userId from JWT token

        const newMessage = new Message({
            senderId,
            receiverId,
            messageText
        });

        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: 'Error saving message', error: error.message });
    }
}; 