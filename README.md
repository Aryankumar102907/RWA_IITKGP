# 🏦 Fractional Tokenized Government Bond Platform (RWA)

## The Problem

Traditional government bonds remain one of the safest investment vehicles, yet they are largely **inaccessible to retail investors**. Minimum investments often start at $10,000 or more, settlement takes days, and there's no easy way to exit a position early without penalties.

This creates a significant barrier for everyday investors who want exposure to stable, government-backed yields — the same yields that institutional investors enjoy.

## Our Solution

This platform **tokenizes government bonds on the blockchain**, enabling:

- **Fractional ownership** — Invest with as little as $1
- **Instant liquidity** — Withdraw anytime, no lock-up periods
- **Transparent yields** — Interest distribution happens on-chain, visible to everyone
- **Real DeFi yields** — Integrated with Aave V3 for genuine yield generation

We implement the **ERC-4626 tokenized vault standard**, the industry-standard interface for yield-bearing tokens, ensuring maximum compatibility with the broader DeFi ecosystem.

---

## 🏗️ System Architecture

### Dual Architecture: Demo Mode & Production Mode

Our platform supports two operational modes:

![Architecture Diagram](assets/architecture.png)

#### Demo Mode (BondVault)
| Component | Role |
|-----------|------|
| **MockUSDC** | Test stablecoin for demonstration |
| **BondVault** | Admin-controlled yield simulation |
| **Dashboard** | User interface for all operations |

#### Production Mode (YieldBondVault + Aave V3)
| Component | Role |
|-----------|------|
| **Aave USDC** | Production stablecoin on Aave V3 |
| **YieldBondVault** | Real yield generation via Aave lending |
| **Aave Pool** | DeFi lending protocol providing yields |

---

## 💰 How Real Yield Works (Aave V3 Integration)

Unlike mock simulations, our **YieldBondVault** generates real yield through Aave V3:

```
User Deposits USDC → YieldBondVault → Aave V3 Pool (90%)
                                    ↓
                           Borrowers Pay Interest
                                    ↓
                        aUSDC Value Increases
                                    ↓
User Redeems yBOND → YieldBondVault ← USDC + Interest Profit
```

### Liquidity Buffer Strategy

To ensure **instant withdrawals** even when funds are invested:

| Allocation | Purpose |
|------------|---------|
| **10% Liquid** | Always available for instant withdrawals |
| **90% In Aave** | Earning yield from the lending pool |

When the buffer depletes, the vault automatically pulls from Aave to fulfill withdrawals.

---

## 🔄 Investment & Yield Cycle

The following sequence diagram illustrates the complete lifecycle:

![Sequence Diagram](assets/sequence.png)

### Phase 1: Investment
- User approves the vault to spend their USDC
- User deposits USDC into the vault
- Vault mints equivalent yBOND shares to the user
- **90% of USDC is automatically supplied to Aave**

### Phase 2: Yield Accrual
- Aave borrowers pay interest on their loans
- The aUSDC balance in our vault increases automatically
- **No admin action required** — yield is real and continuous

### Phase 3: Redemption
- User redeems their yBOND shares
- Vault pulls from Aave if liquid buffer is insufficient
- User receives USDC + accrued yield — **real profit**

---

## 📁 Project Structure

```
├── contracts/
│   ├── BondVault.sol           # Demo vault (admin-simulated yield)
│   ├── YieldBondVault.sol      # Production vault (Aave V3 yield)
│   ├── MockUSDC.sol            # Test stablecoin
│   └── interfaces/
│       ├── IPool.sol           # Aave V3 Pool interface
│       └── IAToken.sol         # Aave aToken interface
├── script/
│   ├── Deploy.s.sol            # Demo contracts deployment
│   └── DeployYieldVault.s.sol  # Aave-integrated vault deployment
├── frontend/
│   └── src/
│       ├── app/
│       └── constants/          # Contract addresses & ABIs
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

forge install
cd frontend && npm install
```

### 2. Run the Frontend

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Connect MetaMask

1. Switch MetaMask to **Sepolia Testnet**
2. Ensure you have Sepolia ETH for gas
3. Connect your wallet via the dashboard

---

## 📜 Deployed Contracts (Sepolia Testnet)

### Demo Contracts (Mock Yield Simulation)
| Contract | Address | Etherscan |
|----------|---------|-----------|
| MockUSDC | `0x231cfdb3ef3fcdd8ca58b9bac7d627975a9df4e8` | [View](https://sepolia.etherscan.io/address/0x231cfdb3ef3fcdd8ca58b9bac7d627975a9df4e8) |
| BondVault | `0x9f03b9845a905cdcd66ff3bfde147a38250aa351` | [View](https://sepolia.etherscan.io/address/0x9f03b9845a905cdcd66ff3bfde147a38250aa351) |

### Production Contracts (Aave V3 Real Yield)
| Contract | Address | Etherscan |
|----------|---------|-----------|
| YieldBondVault | `0xca1F1F003a964Cbe54312A141FE45c9387bBab0E` | [View](https://sepolia.etherscan.io/address/0xca1F1F003a964Cbe54312A141FE45c9387bBab0E) |
| Aave USDC | `0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8` | [View](https://sepolia.etherscan.io/address/0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8) |
| Aave Pool | `0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951` | [View](https://sepolia.etherscan.io/address/0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951) |

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| **ERC-4626 Standard** | Industry-standard tokenized vault interface |
| **Aave V3 Integration** | Real yield generation from DeFi lending |
| **Liquidity Buffer** | 10% liquid for instant withdrawals |
| **Dual Mode** | Demo simulation + Production Aave integration |
| **Modern UI/UX** | Dark-themed dashboard with real-time updates |
| **Web3 Ready** | RainbowKit + Wagmi for seamless wallet connection |

---

## 🛠️ Technology Stack

### Smart Contracts
- **Solidity 0.8.20** — Contract language
- **OpenZeppelin** — Audited libraries (ERC-20, ERC-4626, Ownable)
- **Aave V3** — DeFi lending protocol for yield generation
- **Foundry** — Development, testing, deployment

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

1. **Retail Bond Access** — Small investors can participate in yields previously reserved for institutions
2. **DeFi Composability** — yBOND shares can be used as collateral in other DeFi protocols
3. **Transparent Finance** — All transactions and yields are visible and verifiable on-chain
4. **Instant Liquidity** — No lock-up periods, withdraw anytime with real yields

---

## 📄 License

MIT License — Feel free to use, modify, and distribute.

---

**Built for IIT KGP Hackathon 2026** 🚀
