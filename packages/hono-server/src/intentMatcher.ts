/**
 * Heuristic-driven Intent Matcher
 * Identifies logical gaps between NatSpec documentation and implementation.
 */

export interface IntentIssue {
  severity: "High" | "Medium" | "Low";
  title: string;
  description: string;
  line: number;
}

export const analyzeIntent = (code: string): IntentIssue[] => {
  const issues: IntentIssue[] = [];
  const lines = code.split("\n");

  // Heuristic 1: Ownership Mismatch
  // Finds @notice or @dev claiming availability while code uses onlyOwner
  const ownershipMismatch = (lineIdx: number) => {
    let context = "";
    for (let i = Math.max(0, lineIdx - 5); i < lineIdx; i++) {
      context += lines[i].toLowerCase();
    }

    if (context.includes("@notice") || context.includes("@dev")) {
      const isClaimingPublic = context.includes("anyone") || context.includes("public") || context.includes("any user");
      const isRestricted = lines[lineIdx].includes("onlyOwner") || lines[lineIdx].includes("onlyAdmin");

      if (isClaimingPublic && isRestricted) {
        issues.push({
          severity: "Medium",
          title: "Gap: Privilege/Documentation Drift",
          description: "Documentation suggests public access, but implementation is restricted via modifier.",
          line: lineIdx + 1,
        });
      }
    }
  };

  // Heuristic 2: Hidden State Changes
  // Finds @notice claiming 'view' or 'pure' behavior while implementation modifies state
  const stateMismatch = (lineIdx: number) => {
    let context = "";
    for (let i = Math.max(0, lineIdx - 5); i < lineIdx; i++) {
      context += lines[i].toLowerCase();
    }

    if (context.includes("view") || context.includes("pure")) {
      const line = lines[lineIdx];
      const isModifying = line.includes("=") && !line.includes("==") && !line.includes("!=");
      if (isModifying) {
        issues.push({
          severity: "High",
          title: "Gap: Unauthorized State Modification",
          description: "Function documented as non-state-changing (view/pure) but performs assignments.",
          line: lineIdx + 1,
        });
      }
    }
  };

  lines.forEach((line, idx) => {
    if (line.includes("function")) {
      ownershipMismatch(idx);
      stateMismatch(idx);
    }
  });

  return issues;
};
