import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize the Gemini client using the API key from your .env vault
const aiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: aiKey });

/**
 * Sends a prompt to Gemini with integrated Casper blockchain context data
 * @param {string} userPrompt - The text typed into the mobile chat screen
 * @param {object} blockchainContext - Live parameters fetched from Casper Testnet
 * @returns {Promise<string>} The localized, human-friendly text response
 */
export async function generateAgentResponse(userPrompt, blockchainContext = null) {
  try {
    // 1. Establish strict system guardrails for the model role
    let systemInstruction = `
      You are CasperTalk AI, a high-end, expert Web3 Agentic Analyst specialized in the Casper Network.
      Your job is to break down complex on-chain analytics into simple, human-friendly terms.
      Always maintain a secure, professional, yet supportive tone.
    `;

    // 2. Inject raw blockchain ledger metrics directly into the agent's contextual environment
    if (blockchainContext) {
      systemInstruction += `
        \n[LIVE CASPER BLOCKCHAIN DATA]:
        - User Wallet: ${blockchainContext.walletAddress}
        - Liquid Balance: ${blockchainContext.balanceCSPR} CSPR
        - Network: Casper Testnet
        
        Use these exact metrics to answer the user's inquiry accurately if they ask about their profile, risk, or funds.
      `;
    }

    // 3. Dispatch the compilation request to the Gemini 2.5 Flash model
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.4, // Lower temperature makes the AI more focused and analytical
      }
    });

    return response.text;

  } catch (error) {
    console.error('❌ AI Brain Generation Failure:', error);
    return "CasperTalk Core Error: My language processing center disconnected from the network hub. Please try your query again shortly.";
  }
}