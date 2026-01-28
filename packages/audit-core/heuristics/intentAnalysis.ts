import { Issue, Severity, Category } from '../types';

/**
 * Heuristic: Logical Intent Analysis - "Centralization of Power"
 * Detects patterns where a single owner/admin has broad destructive power 
 * without time-locks or multi-sig requirements.
 */
export const centralizationHeuristic = (ast: any): Issue[] => {
  const issues: Issue[] = [];
  
  // Implementation logic:
  // Walk through function definitions.
  // Identify functions tagged with 'onlyOwner' (assuming OpenZeppelin style).
  // Flag if they perform critical state changes (pausing, emergency withdrawals, upgrades).
  
  const walk = (node: any) => {
    if (!node) return;

    if (node.type === 'FunctionDefinition' && node.modifiers) {
      const isOnlyOwner = node.modifiers.some((m: any) => 
        m.name === 'onlyOwner' || m.name === 'onlyAdmin'
      );

      if (isOnlyOwner) {
        const criticalNames = ['withdraw', 'pause', 'unpause', 'kill', 'selfdestruct', 'upgradeTo'];
        if (criticalNames.some(name => node.name.toLowerCase().includes(name))) {
          issues.push({
            title: 'Significant Centralization Risk',
            description: `The function '${node.name}' is restricted to the owner only and performs a critical operation. Consider using a Multi-sig or Timelock.`,
            severity: Severity.Medium,
            category: Category.L, // Using Logic/Centralization
            line: node.loc?.start?.line || 0
          });
        }
      }
    }

    // Recursively walk through children nodes
    for (const key in node) {
      if (typeof node[key] === 'object') {
        walk(node[key]);
      }
    }
  };

  walk(ast);
  return issues;
};

/**
 * Heuristic: Economic Logic - "Flash Loan Vulnerability" (Twap Check)
 */
export const flashloanHeuristic = (ast: any): Issue[] => {
  const issues: Issue[] = [];
  
  // High-level Logic:
  // 1. Detect calls to Pair/Oracle 'getReserves' or 'latestAnswer'
  // 2. Map if results are used in division/multiplication for minting/burning
  // 3. Flag if no 'twap' or 'delay' variable is present in the contract context
  
  const walk = (node: any) => {
    if (!node) return;

    if (node.type === 'FunctionCall' && node.expression?.name === 'getReserves') {
      issues.push({
        title: 'Potential Flash Loan Dependency',
        description: 'Direct usage of getReserves() for spot price calculation is vulnerable to flash loan manipulation.',
        severity: Severity.High,
        category: Category.H,
        line: node.loc?.start?.line || 0
      });
    }

    for (const key in node) {
      if (typeof node[key] === 'object') {
        walk(node[key]);
      }
    }
  };

  walk(ast);
  return issues;
};
