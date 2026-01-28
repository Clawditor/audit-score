import { Hono } from "hono";
import { cors } from "hono/cors";
import { createPublicClient, createWalletClient, http, keccak256, toHex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import { countLoC } from "./utils";
import { analyzeIntent } from "./intentMatcher";
import { analyzeCentralization } from "./centralizationRadar";

const app = new Hono();

// AuditRegistry ABI (minimal for registerAudit)
const AUDIT_REGISTRY_ABI = [
  {
    inputs: [
      { name: "contractAddress", type: "address" },
      { name: "reportHash", type: "bytes32" },
    ],
    name: "registerAudit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "contractAddress", type: "address" }],
    name: "getAuditHash",
    outputs: [{ name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// Registry address (to be set after deployment)
const AUDIT_REGISTRY_ADDRESS = process.env.AUDIT_REGISTRY_ADDRESS as `0x${string}` | undefined;

app.use("/*", cors());

// Mock vulnerability list for Phase 3 Scan Engine placeholder
const MOCK_ISSUES = [
  { severity: "High", title: "Potential Reentrancy", range: [10, 15] },
  { severity: "Medium", title: "Unprotected Mint", range: [45, 46] },
  { severity: "Low", title: "Floating Pragma", range: [1, 1] },
];

app.get("/", (c) => {
  return c.text("Audit Score API - Active");
});

/**
 * Scan Execution Endpoint
 */
app.post("/scan/run", async (c) => {
  const { code, address, txHash } = await c.req.json();
  
  // Real intent analysis (Phase 4)
  const intentIssues = analyzeIntent(code);
  
  // Combine native analyzer issues with intent issues
  const allIssues = [
    ...MOCK_ISSUES,
    ...intentIssues.map(i => ({ 
      severity: i.severity, 
      title: i.title, 
      range: [i.line, i.line] 
    }))
  ];

  // Centralization analysis
  const centralization = analyzeCentralization(code);
  
  const loc = countLoC(code);
  const safetyScore = Math.max(0, 100 - (allIssues.length * 15));

  // Generate report hash for on-chain registry
  const reportData = JSON.stringify({
    loc,
    safetyScore,
    issueCount: allIssues.length,
    timestamp: new Date().toISOString(),
  });
  const reportHash = keccak256(toHex(reportData));

  return c.json({
    status: "completed",
    loc,
    safetyScore,
    issues: allIssues,
    centralization,
    timestamp: new Date().toISOString(),
    contractAddress: address,
    verified: !!txHash,
    reportHash,
  });
});

/**
 * Handle Code Upload & LoC Quote
 * In a real x402 flow, this would return the 402 Payment Required 
 * header pointing to a payment URL or Lightning invoice / On-chain address.
 */
app.post("/scan/quote", async (c) => {
  const { code } = await c.req.json();
  const loc = countLoC(code);
  const ratePerLine = 0.0001; // Example rate in ETH or $clawditor
  const quote = loc * ratePerLine;

  return c.json({
    loc,
    quote,
    currency: "ETH",
    paymentRequired: true,
  });
});

/**
 * Register Audit Hash On-Chain
 * Pushes a report hash to the AuditRegistry contract.
 */
app.post("/registry/register", async (c) => {
  const { contractAddress, reportHash } = await c.req.json();

  if (!AUDIT_REGISTRY_ADDRESS) {
    return c.json({ error: "Registry not configured" }, 500);
  }

  const privateKey = process.env.REGISTRY_PRIVATE_KEY as `0x${string}`;
  if (!privateKey) {
    return c.json({ error: "Registry signer not configured" }, 500);
  }

  const account = privateKeyToAccount(privateKey);
  const walletClient = createWalletClient({
    account,
    chain: baseSepolia,
    transport: http(),
  });

  const hash = await walletClient.writeContract({
    address: AUDIT_REGISTRY_ADDRESS,
    abi: AUDIT_REGISTRY_ABI,
    functionName: "registerAudit",
    args: [contractAddress as `0x${string}`, reportHash as `0x${string}`],
  });

  return c.json({
    success: true,
    txHash: hash,
    contractAddress,
    reportHash,
  });
});

/**
 * Get Audit Hash from Registry
 */
app.get("/registry/:address", async (c) => {
  const address = c.req.param("address");

  if (!AUDIT_REGISTRY_ADDRESS) {
    return c.json({ error: "Registry not configured" }, 500);
  }

  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(),
  });

  const hash = await publicClient.readContract({
    address: AUDIT_REGISTRY_ADDRESS,
    abi: AUDIT_REGISTRY_ABI,
    functionName: "getAuditHash",
    args: [address as `0x${string}`],
  });

  return c.json({
    contractAddress: address,
    reportHash: hash,
    hasAudit: hash !== "0x0000000000000000000000000000000000000000000000000000000000000000",
  });
});

export default app;
