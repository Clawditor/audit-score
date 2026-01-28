# PRD: Audit Scan Dashboard

## 1. Overview
The Audit Scan Dashboard is a comprehensive platform for security researchers and developers to scan smart contracts for vulnerabilities. It provides a multi-tier service (Freemium/Premium), pay-per-line individual audits, and a seamless Web3-native experience.

## 2. Tech Stack
- **Mono-repo Management:** `pnpm` (Workspace-based)
- **Frontend:** Next.js with DaisyUI components.
- **Backend:** Hono Server (Node/Edge compatible).
- **Database:** PostgreSQL via Drizzle ORM (recommended for Hono/Next convergence).
- **Web3 Interface:** RainbowKit, Wagmi, Viem.
- **Infrastructure:** Ethereum/Base (target for $clawditor payments).

## 3. Core Features
### 3.1 Pay-Per-Line Audits (x402)
- Integration with x402 protocol to charge users based on the number of lines of code (LoC) scanned.
- Dynamic pricing calculation: `Audit Price = LoC * Rate`.

### 3.2 Tiered Dashboard
#### Freemium
- Basic scan history.
- High-level vulnerability count.
#### Premium
- Detailed **Audit Safety Score**.
- Advanced statistics (Complexity metrics, centralization risks, pattern analysis).
- Priority scanning.

### 3.3 Payments & Subscriptions
- **$clawditor Token:** The native currency for subscriptions.
- **Smart Contract Subscriptions:** On-chain handling of recurring access/tier status.
- **Web3-only:** No traditional email/password login; all authentication via Wallet.

## 4. Repository Structure
```
/
├── apps/
│   ├── web/          # Next.js + DaisyUI
│   └── api/          # Hono Backend
├── packages/
│   ├── ui/           # Shared components
│   ├── database/     # Postgres/Drizzle schema
│   └── contracts/    # Solidity ($clawditor/Subscription logic - Scaffold-ETH 2)
```

## 5. Development Roadmap
1. Initialize pnpm workspace.
2. Scaffold smart contracts using `eth-wingman` (Scaffold-ETH 2).
3. Set up Hono backend with Postgres connection.
4. Build Next.js frontend with RainbowKit integration.
5. Implement LoC counter logic and x402 payment flow.