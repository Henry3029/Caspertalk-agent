import mongoose from 'mongoose';

// Creating the physical database structure rulebook
const MessageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['user', 'ai'], // Strict guardrail: the sender can ONLY be 'user' or 'ai'
    required: true
  },
  text: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now // This uses that raw millisecond marker to stamp the document automatically!
  }
});

// Turn that blueprint layout into a working data model named 'Message'
const Message = mongoose.model('Message', MessageSchema);

export default Message;