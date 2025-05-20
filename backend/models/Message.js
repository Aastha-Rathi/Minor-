const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderId: {
        type: String,
        required: true
    },
    receiverId: {
        type: String,
        required: true
    },
    messageText: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Create a compound index for efficient querying of chat history
messageSchema.index({ senderId: 1, receiverId: 1, timestamp: -1 });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message; 