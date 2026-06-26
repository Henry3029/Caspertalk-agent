import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose'; // 1. Import the database connector

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 2. STITCH THE MONGODB CONNECTION HERE
const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI)
  .then(() => console.log('💾 Cloud Vault Connected: MongoDB Atlas is live!'))
  .catch((err) => console.error('❌ Database connection failure:', err));

// Test Route
app.get('/api/status', (req, res) => {
  res.json({ status: "online", message: "CasperTalk AI Engine is running smoothly!" });
});

app.listen(PORT, () => {
  console.log(`🟢 Boss Engine is live on port http://localhost:${PORT}`);
});