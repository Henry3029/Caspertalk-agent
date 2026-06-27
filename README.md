# 👻 CasperTalk AI – Frontend Dashboard

This is the mobile-optimized, real-time frontend dashboard for **CasperTalk AI**. Built using Next.js (App Router), TypeScript, and Tailwind CSS, this interface serves as the execution layer that interacts directly with the `caspertalk-backend` agent orchestration service to read, analyze, and present real user transaction and state metrics from the **Casper Network**.

---

## 🏗️ Core Architecture & Data Pipeline

The frontend maintains a real-time tracking network pipe bound directly to MongoDB Atlas storage and the Casper RPC layers via the Node.js agent backend.

```
[User Input Prompt] ──> (Next.js React State)
                              │
                              ▼ (HTTP POST payload JSON)
                     [Node.js Express Backend] ──> [Casper Network RPC]
                              │                             │
                              ▼ (Stores & Tracks Log)       ▼ (Fetches State)
                     [MongoDB Database] <─────────── [Gemini AI Evaluation]
                              │
                              ▼ (Structured JSON Response + Metrics)
[Dashboard Re-renders with Live Balance & Risk Scores] <───┘

```

---

## 📊 Data Contracts & Alignment Interfaces

To ensure absolute type safety across the application without breaking compile runs, the frontend components adhere strictly to the following structural models.

### 💬 The Message Interface

Every entry processed in the user-agent dialogue window maps safely to MongoDB's asynchronous logs while parsing payload timestamps into valid JavaScript runtime objects:

```typescript
interface Message {
  id: string;              // Maps to document `_id` or generated unique UUIDs
  sender: 'user' | 'ai';   // Strictly tracks source identity
  text: string;            // The markdown clean human-friendly response from Gemini
  timestamp: Date;         // Formatted runtime Date object for ChatWindow tracking
}

```

### 📈 Blockchain Metrics Data Contract

The main metrics layout hooks directly into state layers reflecting live chain lookups rather than arbitrary initial placeholders:

```typescript
interface DashboardMetricsProps {
  walletAddress: string;                            // Casper hex-encoded public key
  balance: number;                                  // Live liquid balance computed from the chain
  riskLevel: 'Low Risk' | 'Medium Risk' | 'High Risk'; // AI portfolio evaluation metrics
  aiAnalysis: string;                               // Condensed situational assessment string
  isLoading?: boolean;                              // Async network loading context spinner
}

```

---

## 🚀 Execution & Local Integration

To run this module side-by-side with your backend data layer, follow the step sequence below inside your workspace terminal environment:

### 1. Synchronize Configuration Files

Ensure your configurations are isolated cleanly right inside your root frontend scope:

* `caspertalk-frontend/tsconfig.json` (Includes custom mapped path alias `"@/*": ["./src/*"]`)
* `caspertalk-frontend/next.config.ts`

### 2. Install Build-essential Dependencies

Boot up your terminal instance, change context into the frontend path, and build your local `node_modules` structure:

```bash
cd /workspaces/Caspertalk-agent/caspertalk-frontend
npm install

```

### 3. Launch the Next.js Compiler Loop

Fire up the local Turbopack compilation server to watch files:

```bash
npm run dev

```