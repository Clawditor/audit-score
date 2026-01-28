import { Hono } from "hono";
import { cors } from "hono/cors";
import { countLoC } from "./utils";
import { analyzeIntent } from "./intentMatcher";

const app = new Hono();

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

  const loc = countLoC(code);
  const safetyScore = Math.max(0, 100 - (allIssues.length * 15));

  return c.json({
    status: "completed",
    loc,
    safetyScore,
    issues: allIssues,
    timestamp: new Date().toISOString(),
    contractAddress: address,
    verified: !!txHash,
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

export default app;
