/**
 * Centralization Radar
 * Analyzes Solidity code to identify privileged roles and mapping risks.
 */

export interface RoleRisk {
  role: string;
  count: number;
  functions: string[];
}

export const analyzeCentralization = (code: string) => {
  const lines = code.split("\n");
  const privilegedFunctions: string[] = [];
  const roles: Set<string> = new Set();

  lines.forEach((line) => {
    // Detect functions restricted to roles
    const restrictionMatch = line.match(/function\s+(\w+).*?(onlyOwner|onlyAdmin|hasRole\(\w+\))/);
    if (restrictionMatch) {
      privilegedFunctions.push(restrictionMatch[1]);
      roles.add(restrictionMatch[2]);
    }
  });

  return {
    privilegedRatio: privilegedFunctions.length, // Placeholder for actual ratio logic
    roles: Array.from(roles),
    functions: privilegedFunctions
  };
};
