import { Hono } from "hono";
import { countLoC } from "./utils";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Audit Score API - Active");
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
