import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Message from './models/Message.js'; // 1. Import your database layout blueprint
import { getCasperBalance } from './services/casperService.js';
import { generateAgentResponse } from './services/aiService.js';

dotenv.config({ path: './.env' });

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

app.post('/api/messages', async (req, res) => {
  try {
    const { sender, text, publicKey } = req.body; 

    if (!sender || !text) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // 1. Save the User's incoming prompt bubble into MongoDB
    const userMessage = new Message({ sender: 'user', text });
    await userMessage.save();

    let aiResponseText = "";

    // 2. If this is a user input message, trigger the Agentic logic chain
    if (sender === 'user') {
      
      // Fetch a mock or real asset block state context to ground the AI's data calculations
      // (Later, your frontend will pass the active public key straight inside the req.body)
      const blockchainContext = {
        walletAddress: publicKey || "01a0bc...MockWalletAddressHex...",
        balanceCSPR: 2450.75 
      };

      // Pass the text prompt and the blockchain info directly to Gemini
      aiResponseText = await generateAgentResponse(text, blockchainContext);

      // 3. Commit the AI's generated response directly to MongoDB
      const aiMessage = new Message({
        sender: 'ai',
        text: aiResponseText
      });
      await aiMessage.save();
    }

    // 4. Return both the user submission acknowledgment and the real AI response payload!
    res.status(201).json({
      userMessage,
      aiResponse: aiResponseText ? { sender: 'ai', text: aiResponseText } : null
    });

  } catch (error) {
    console.error('❌ Comprehensive pipeline routing failure:', error);
    res.status(500).json({ error: 'Internal Server Routing Error' });
  }
});

// THE BLOCKCHAIN READ ROUTE
app.get('/api/blockchain/balance/:publicKey', async (req, res) => {
  try {
    const { publicKey } = req.params;

    if (!publicKey) {
      return res.status(400).json({ error: 'Public Key parameter is required' });
    }

    console.log(`⛓️ Querying Casper Testnet ledger for wallet: ${publicKey.substring(0, 8)}...`);
    
    // Call our Web3 service script to fetch the balance from the node
    const balance = await getCasperBalance(publicKey);

    // Return the real blockchain data to the frontend layout
    res.json({
      success: true,
      network: "casper-testnet",
      walletAddress: publicKey,
      balanceCSPR: balance
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve on-chain data metrics' });
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