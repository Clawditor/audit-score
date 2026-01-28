# PRD: Audit-Score Platform (Final)

## 1. Overview
The Audit-Score platform is a high-fidelity smart contract security dashboard and scanning engine. It introduces a novel utility-based payment model via **x402 (Pay-per-Line)** and a token-gated subscription model via **$clawditor**. The platform focuses on actionable security metrics, centralization risk mapping, and intent-implementation verification.

## 2. Goals
- **Monetize Security:** Implement x402 for granular, pay-as-you-go auditing and $clawditor for recurring premium access.
- **Visual Intelligence:** Provide a "Centralization Radar" to map privileged roles and a "Safety Score" for quick protocol assessment.
- **Deep Verification:** Detect deviations between NatSpec documentation (Intent) and Solidity implementation (Reality).
- **Benchmarking:** Enable Phase 5 "Market Intelligence" to compare protocol security across the DeFi ecosystem.

---

## 3. Core Features & User Stories

### US-001: File-Level x402 Auditing
**Description**: As a developer, I want to pay only for the specific files I've changed so that I can audit incrementally without full-repo costs.
**Acceptance Criteria**:
- [ ] Backend calculates LoC (Lines of Code) for individual `.sol` files.
- [ ] Frontend allows selection/deselection of specific files from a repository tree.
- [ ] x402 payment request is generated per-file at the specified `Rate`.
- [ ] Audit is triggered only for files with confirmed payment.

### US-002: AI-Intent Matching (Shadow Verification)
**Description**: As a security researcher, I want the AI to flag when code does something the documentation says it shouldn't (or vice versa).
**Acceptance Criteria**:
- [ ] AI engine parses NatSpec tags (`@notice`, `@dev`, `@param`, `@return`).
- [ ] AI generates a semantic summary of the "Expected Behavior" from docs.
- [ ] AI flags "Code-Comment Deviations" where logic contradicts current documentation.
- [ ] Output includes a "Deviation Severity" (Low/Medium/High).

### US-003: Centralization Radar (Comprehensive Risk UI)
**Description**: As an investor, I want to see a full map of who controls a protocol so I can assess rug-pull or governance risks.
**Acceptance Criteria**:
- [ ] Identify all `onlyOwner`, `AccessControl` roles, and Proxy Admin addresses.
- [ ] Display a relationship graph (Permission Map) of addresses to functions.
- [ ] Generate a "Centralization Heatmap" based on function-level privilege density.
- [ ] List "Critical Centralization Risks" (e.g., EOA as owner of a vault).

### US-004: Market Intelligence (Security Benchmarking)
**Description**: As a protocol founder, I want to see how my security score compares to industry peers.
**Acceptance Criteria**:
- [ ] Aggregator logic fetches scores from previously audited platform projects (or public datasets).
- [ ] UI displays "Security Percentile" (e.g., "Top 5% of DEXs on Base").
- [ ] Provide "Relative Benchmarking" charts comparing complexity vs. score.

---

## 4. Technical Requirements

### 4.1 Phase 4: Expansion
1.  **AI Integration**: Implement a dedicated service in `packages/hono-server` for processing file content against documentation.
2.  **Radar Engine**: Develop a static analysis module that traverses the AST (Abstract Syntax Tree) to extract all restricted modifiers and roles.
3.  **Base Registry**: Deploy a contract on Base to store audit report hashes for immutable verification of scores.

### 4.2 Phase 5: Market Intelligence
1.  **Benchmarking API**: Create a read-only endpoint that returns anonymized security statistics for similar protocol types.
2.  **Comparison UI**: Build a "Versus" component allowing users to compare two contract addresses side-by-side.

---

## 5. Non-Goals
- **Automated Remediation**: AI will suggest fixes in the UI, but Phase 5 will NOT focus on automated PR submission or on-chain code modification.
- **Cross-Chain Bridging**: Initial $clawditor payments and registry are restricted to Base and potentially Ethereum Mainnet.

## 6. Success Metrics
- **Verification Accuracy**: 90% detection rate of documented vs. implemented state logic.
- **Adoption**: Number of successful x402 transactions for file-level audits.
- **Retention**: $clawditor subscription renewals for premium "Market Intelligence" access.
