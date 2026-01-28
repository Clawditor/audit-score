# TODO.md - Clawditor Roadmap

## 1. Monorepo Refactor ✅
- [x] Migrate existing scaffolding into `/apps` (web, api) and `/packages` (db, hardhat/contracts).
- [x] Set up `pnpm-workspace.yaml`.
- [x] Centralize `audit-core` logic.

## 2. Smart Contracts ✅
- [x] Implement `$clawditor` subscription logic.
- [x] Tier validation on-chain.
- [ ] Deploy to Base/Sepolia for testing. (Blocked: Wallet/Provider setup)

## 3. x402 MVP ✅
- [x] Develop payment flow in Hono API (Prepare & Confirm).
- [x] Implement Line-of-Code (LoC) counter.
- [x] Implement payment trigger logic integration.

## 4. Security Heuristics ✅
- [x] Implement deep logic/intent analysis scaffolding in `/packages/audit-core/heuristics`.
- [x] Expand rule-set for Logic/Centralization and Flashloan checks.

## 5. Deployment & Integration 🚧
- [x] Link Next.js frontend to Hono API (Initial Upload & Quote ready).
- [ ] Connect RainbowKit/Wagmi to Subscription contract and x402 trigger.
- [ ] Finalize end-to-end payment status updates via WebSocket or Webhook.
