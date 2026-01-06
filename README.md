# 🏦 Fractional Tokenized Government Bond Platform (RWA)

## The Problem

Traditional government bonds remain one of the safest investment vehicles, yet they are largely **inaccessible to retail investors**. Minimum investments often start at $10,000 or more, settlement takes days, and there's no easy way to exit a position early without penalties.

This creates a significant barrier for everyday investors who want exposure to stable, government-backed yields — the same yields that institutional investors enjoy.

## Our Solution

This platform **tokenizes government bonds on the blockchain**, enabling:

- **Fractional ownership** — Invest with as little as $1
- **Instant liquidity** — Withdraw anytime, no lock-up periods
- **Transparent yields** — Interest distribution happens on-chain, visible to everyone
- **Programmable finance** — Composable with other DeFi protocols

We implement the **ERC-4626 tokenized vault standard**, the industry-standard interface for yield-bearing tokens, ensuring maximum compatibility with the broader DeFi ecosystem.

---

## 🏗️ System Architecture

Our platform consists of three core components working together:

![Architecture Diagram](assets/architecture.png)

| Component | Role |
|-----------|------|
| **MockUSDC** | Test stablecoin (ERC-20) representing the deposit asset |
| **BondVault** | ERC-4626 vault that holds USDC and issues fBOND shares |
| **Next.js Dashboard** | User interface for investments, withdrawals, and admin functions |

### How It Works

1. **User deposits USDC** into the BondVault contract
2. **Vault mints fBOND shares** proportional to the deposit
3. **Admin distributes yield** (simulating government interest payments)
4. **Share price increases** as vault assets grow
5. **User redeems shares** for USDC + earned yield

---

## 🔄 Investment & Yield Cycle

The following sequence diagram illustrates the complete lifecycle of an investment:

![Sequence Diagram](assets/sequence.png)

### Phase 1: Investment
- User approves the vault to spend their USDC
- User deposits USDC into the vault
- Vault mints equivalent fBOND shares to the user

### Phase 2: Yield Distribution
- Platform admin injects yield into the vault (simulating bond interest)
- Total vault assets increase while share count stays constant
- **Result**: Each share is now worth more USDC

### Phase 3: Redemption
- User redeems their fBOND shares
- Vault burns the shares and returns USDC + proportional yield
- User receives more than they deposited — **profit realized**

---

## 📁 Project Structure

```
├── contracts/              # Smart contracts (Solidity)
│   ├── BondVault.sol       # ERC-4626 yield-bearing vault
│   └── MockUSDC.sol        # Test stablecoin (6 decimals)
├── script/                 
│   └── Deploy.s.sol        # Foundry deployment script
├── scripts/                
│   └── export-abi.js       # ABI export utility
├── frontend/               # Next.js 14 application
│   └── src/
│       ├── app/            # App Router pages
│       ├── constants/      # Contract addresses & ABIs
│       └── ...
├── assets/                 # Documentation images
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- [Foundry](https://getfoundry.sh/) — Smart contract toolkit
- [Node.js](https://nodejs.org/) v18+ — Frontend runtime
- [MetaMask](https://metamask.io/) — Wallet browser extension
- Sepolia ETH — For gas fees ([Faucet](https://sepolia-faucet.pk910.de/))

### 1. Clone & Install

```bash
git clone https://github.com/Aryankumar102907/RWA_IITKGP.git
cd RWA_IITKGP

# Install contract dependencies
forge install

# Install frontend dependencies
cd frontend && npm install
```

### 2. Deploy to Sepolia (Optional)

If you want to deploy your own instance:

```bash
# Set your private key
export PRIVATE_KEY=your_private_key_here

# Deploy contracts
forge script script/Deploy.s.sol --rpc-url https://rpc.ankr.com/eth_sepolia --broadcast

# Update frontend/src/constants/contracts.ts with new addresses
```

### 3. Run the Frontend

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Connect MetaMask

1. Switch MetaMask to **Sepolia Testnet**
2. Ensure you have Sepolia ETH for gas
3. Connect your wallet via the dashboard

---

## 📜 Deployed Contracts (Sepolia Testnet)

| Contract | Address | Etherscan |
|----------|---------|-----------|
| MockUSDC | `0x231cfdb3ef3fcdd8ca58b9bac7d627975a9df4e8` | [View](https://sepolia.etherscan.io/address/0x231cfdb3ef3fcdd8ca58b9bac7d627975a9df4e8) |
| BondVault | `0x9f03b9845a905cdcd66ff3bfde147a38250aa351` | [View](https://sepolia.etherscan.io/address/0x9f03b9845a905cdcd66ff3bfde147a38250aa351) |

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| **ERC-4626 Standard** | Industry-standard tokenized vault interface for yield-bearing assets |
| **Yield Simulation** | Admin function to inject yield, demonstrating how bond interest increases share value |
| **Modern UI/UX** | Dark-themed dashboard with real-time balance updates and intuitive controls |
| **Web3 Integration** | Seamless wallet connection via RainbowKit with Wagmi hooks |
| **Sepolia Testnet** | Fully functional on Ethereum's test network for risk-free demonstration |

---

## 🛠️ Technology Stack

### Smart Contracts
- **Solidity 0.8.20** — Contract language
- **OpenZeppelin** — Audited contract libraries (ERC-20, ERC-4626, Ownable)
- **Foundry** — Development, testing, and deployment toolkit

### Frontend
- **Next.js 14** — React framework with App Router
- **TypeScript** — Type-safe development
- **Tailwind CSS** — Utility-first styling
- **Lucide Icons** — Modern icon library

### Web3
- **Wagmi v2** — React hooks for Ethereum
- **viem** — TypeScript Ethereum library
- **RainbowKit** — Wallet connection UI

---

## 🎯 Use Cases

1. **Retail Bond Access** — Enable small investors to participate in government bond yields
2. **DeFi Composability** — fBOND shares can be used as collateral in other protocols
3. **Transparent Finance** — All transactions and yields are visible on-chain
4. **Education** — Demonstrates ERC-4626 vault mechanics for learning purposes

---

## 📄 License

MIT License — Feel free to use, modify, and distribute.

---

**Built for IIT KGP Hackathon 2026** 🚀
