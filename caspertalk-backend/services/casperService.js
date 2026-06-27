import { CasperServiceByJsonRPC } from 'casper-js-sdk';
import dotenv from 'dotenv';

dotenv.config();

// Initialize the connector pointing to the public Casper Testnet RPC node
const rpcUrl = process.env.CASPER_TESTNET_RPC || "https://rpc.testnet.casper.live/rpc";
const casperService = new CasperServiceByJsonRPC(rpcUrl);

/**
 * Fetches the liquid token balance of a given Casper Public Key (Wallet Address)
 * @param {string} publicKeyHex - The user's Casper public key string
 * @returns {Promise<number>} The balance converted from motes to CSPR tokens
 */
export async function getCasperBalance(publicKeyHex) {
  try {
    // 1. Query the node to get the absolute latest state root hash of the ledger
    const latestBlockInfo = await casperService.getLatestBlockInfo();
    const stateRootHash = latestBlockInfo.block.header.state_root_hash;

    // 2. Convert the user's readable public key hex string into an internal account hash format
    const accountBalanceUref = await casperService.getAccountBalanceUrefByPublicKey(
      stateRootHash,
      publicKeyHex
    );

    // 3. Query the blockchain for the raw balance number (returned in 'motes')
    const rawBalanceMotes = await casperService.getAccountBalance(
      stateRootHash,
      accountBalanceUref
    );

    // 4. Crypto math: 1 CSPR = 1,000,000,000 motes. We divide to make it readable!
    const csprBalance = Number(rawBalanceMotes) / 1_000_000_000;
    
    return csprBalance;

  } catch (error) {
    console.error(`❌ Failed to fetch Casper chain metrics for key ${publicKeyHex}:`, error.message);
    // Return 0 if the account doesn't exist yet or has never received tokens on Testnet
    return 0;
  }
}