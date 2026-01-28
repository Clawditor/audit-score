# TODO - Audit Scan Development Tracker

## Current Status (Analysis)
- **Monorepo Structure:** Using Scaffold-ETH 2 layout (`packages/hardhat`, `packages/nextjs`, `packages/hono-server`).
- **PRD Alignment:** Keeping the `packages/*` structure as the canonical layout.
- **Core Features:** No implementation of x402 pay-per-line logic or $clawditor subscription contracts observed yet.

## Phase 1: Infrastructure & Structure
- [x] **Database Setup:** Create `packages/database` for Drizzle ORM with PostgreSQL schema for scan history and user tiers.
- [x] **Environment Configuration:** Set up `.env` templates for API keys, DB URLs, and Contract addresses.

## Phase 2: Core Web3 Logic ($clawditor & x402)
- [x] **Subscription Contract:**
  - Develop `$clawditor` token-based subscription logic in `packages/hardhat/contracts`.
  - Implement recurring access checks.
- [x] **x402 Integration:**
  - Implement LoC (Lines of Code) counter utility in `packages/hono-server`.
  - Integrate x402 payment flow for pay-per-line audits. (Initial quote endpoint)
- [x] **Scan Engine:** Connect the Hono API to the audit scanning logic (or analyzer tool). (Phase 3 Initial Mock)

## Phase 3: Dashboard & UX
- [x] **Connect Frontend to API:** Implement data fetching in `packages/nextjs` from `packages/hono-server`. (Full Cycle: Quote -> Pay -> Result)
- [x] **Safety Score Visualization:** Build components for the "Audit Safety Score" and advanced metrics.
- [x] **Deploy Contracts:** Set up deployment scripts for `ClawditorSubscription`.
- [x] **Wallet-Only Auth:** Finalize Wagmi/RainbowKit middleware for user sessions.

## Phase 4: Expansion & Advanced Features (Strategic)
- [x] **AI-Intent Matching:** Implement logic to compare NatSpec documentation against implementation logic to find "Intent-Implementation" gaps. (Initial Parser Engine)
- [ ] **Centralization Radar:** Map `onlyOwner` and admin roles to a visual heatmap on the dashboard.
- [ ] **Base On-Chain Registry:** Deploy a contract on Base to store audit report hashes for immutable verification.
- [ ] **x402 Micro-Tiers:** Update the pricing model to allow single-function or single-file audits using x402 headers.

## Critical Milestones (Current Priority)
1. **Package Setup:** Create `packages/database` and `packages/ui` to complete the monorepo structure.
2. **Contract Foundation:** Implementation of the `$clawditor` payment logic and subscription tier checking on-chain.
3. **x402 MVP:** End-to-end "LoC Count -> Payment Request -> Audit Trigger" flow.
