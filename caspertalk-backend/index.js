import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Message from './models/Message.js'; // 1. Import your database layout blueprint

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI)
  .then(() => console.log('💾 Cloud Vault Connected: MongoDB Atlas is live!'))
  .catch((err) => console.error('❌ Database connection failure:', err));

// --- ⚙️ NEW DATABASE ROUTES START HERE ---

// 2. THE CHAT INTAKE ROUTE (Saves incoming text from the phone)
app.post('/api/messages', async (req, res) => {
  try {
    const { sender, text } = req.body; // Unpack the values sent from the Next.js app

    // Guardrail: Make sure the message isn't empty or malformed
    if (!sender || !text) {
      return res.status(400).json({ error: 'Missing required fields: sender or text' });
    }

    // Wrap the data in our Mongoose blueprint
    const newMessage = new Message({
      sender,
      text
    });

    // Fire it off to save permanently inside your MongoDB cloud cluster!
    const savedMessage = await newMessage.save();

    // Send the saved record back to the frontend to confirm success
    res.status(201).json(savedMessage);

  } catch (error) {
    console.error('❌ Error saving message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 3. THE HISTORY RETRIEVAL ROUTE (Fetches all old messages when the app reloads)
app.get('/api/messages', async (req, res) => {
  try {
    // Look into the database collection and find all records, sorted by time
    const chatHistory = await Message.find().sort({ timestamp: 1 });
    res.json(chatHistory);
  } catch (error) {
    console.error('❌ Error fetching history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// --- ⚙️ DATABASE ROUTES END HERE ---

// Base Status Route
app.get('/api/status', (req, res) => {
  res.json({ status: "online", message: "CasperTalk AI Engine is running smoothly!" });
});

app.listen(PORT, () => {
  console.log(`🟢 Boss Engine is live on port http://localhost:${PORT}`);
});