export interface IntentMismatch {
  title: string;
  natspec: string;
  actual: string;
  severity: "High" | "Medium" | "Low";
  line: number;
}

/**
 * AI-Intent Matcher (Experimental Phase 4)
 * Analyzes Solidity code to find friction between NatSpec comments and code logic.
 */
export const analyzeIntent = (code: string): IntentMismatch[] => {
  const mismatches: IntentMismatch[] = [];
  
  // Rule 1: "onlyOwner" keyword detection vs "@notice Caller must be owner"
  const onlyOwnerPattern = /function\s+(\w+).*onlyOwner/gs;
  const natspecOwnerPattern = /\/\*\*[\s\S]*?@notice.*owner.*?\*\/\s*function\s+(\w+)/gs;

  // This is a placeholder for real AI/heuristic parsing
  // In Phase 4, we'll implement a proper tokenizer to map these groups accurately.
  
  // Example detection logic:
  if (code.includes("@notice") && code.includes("onlyOwner")) {
    const natspecMatch = code.match(/@notice\s+(.*?)\n/);
    if (natspecMatch && natspecMatch[1].toLowerCase().includes("non-owner") && code.includes("onlyOwner")) {
      mismatches.push({
        title: "Intent-Implementation Gap: Ownership",
        natspec: "Claimed accessibility for non-owners",
        actual: "Implementation restricted to onlyOwner",
        severity: "Medium",
        line: 15 // Mock line
      });
    }
  }

  return mismatches;
};
