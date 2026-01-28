# FEATURE_PROPOSALS.md - Clawditor Product Roadmap

This document outlines detailed feature specifications for the evolution of the Clawditor ecosystem, specifically the `audit-score` engine and dashboard.

## 1. Advanced AI Security Heuristics (Scan Engine)
**Focus:** Enhancing the high-assurance auditing capability beyond basic pattern matching.

### 1.1 Intent-Correctness Analysis
- **Goal:** Use LLMs to verify if the implementation of a function matches its NatSpec documentation.
- **Spec:**
    - Parse NatSpec tags (`@notice`, `@dev`, `@param`, `@return`).
    - Generate a summary of the code's actual logic.
    - Compute a "Discrepancy Score" (0.0 to 1.0).
    - Flag functions where logic significantly deviates from documented intent.

### 1.2 Cross-Contract State Impact (CCSI)
- **Goal:** Identify vulnerabilities where external calls in non-malicious contracts lead to unexpected state changes in the target contract.
- **Spec:**
    - Perform a reachability analysis on protocol-wide contracts.
    - Map external dependencies and shared state variables.
    - Simulate reentrancy vectors that span across multiple protocol contracts (not just single-contract reentrancy).

---

## 2. x402 "Audit-on-Demand" (Micro-Payments)
**Focus:** On-chain payment innovation using the x402 protocol.

### 2.1 Hyper-Granular LoC Pricing
- **Goal:** Shift from flat-fee audits to per-line micropayments using USDC or $clawditor.
- **Spec:**
    - API endpoint returns `402 Payment Required` with a signed quote for the specific line count of the uploaded file.
    - Integration with `ERC-3009` (TransferWithAuthorization) for gasless payment experience.
    - **Pricing Tiers:**
        - Standard: $0.05 per LoC (Basic check).
        - Premium: $0.25 per LoC (Deep AI analysis + Formal Verification proof generation).

### 2.2 Payment-Gated API Documentation
- **Goal:** Allow security researchers to pay a few cents to unlock specific vulnerability databases or rule sets via the dashboard.

---

## 3. Multi-Chain Expansion (Scalability)
**Focus:** Expanding Clawditor's footprint across the EVM ecosystem.

### 3.1 Base-Native Optimization
- **Goal:** Deep integration with Base L2 for low-cost state storage of audit reports.
- **Spec:**
    - Deploy `AuditHistory` registry on Base.
    - Store IPFS hashes of reports on-chain to provide immutable audit trails for projects.

---

## 4. Advanced Dashboard Analytics (UX/UI)
**Focus:** Providing high-assurance signals to investors and developers.

### 4.1 Centralization Risk Radar
- **Goal:** Visually map `onlyOwner`, `Roles`, and `Multisig` dependencies.
- **Spec:**
    - Analyze `AccessControl` patterns.
    - Generate a "Centralization Heatmap" showing which addresses hold the most power over protocol funds or state.

### 4.2 "Hacker vs Auditor" Score
- **Goal:** Gamify security by comparing the "Safety Score" of the contract against community-reported findings (post-audit).
