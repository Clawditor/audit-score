export enum Severity {
  Critical = "Critical",
  High = "High", 
  Medium = "Medium",
  Low = "Low",
  Informational = "Informational"
}

export const weightScore = (issues: { severity: string }[]): number => {
  let penalty = 0;
  
  issues.forEach(issue => {
    switch (issue.severity) {
      case Severity.Critical:
        penalty += 40;
        break;
      case Severity.High:
        penalty += 25;
        break;
      case Severity.Medium:
        penalty += 10;
        break;
      case Severity.Low:
        penalty += 2;
        break;
      default:
        penalty += 0.5;
    }
  });

  return Math.max(0, 100 - penalty);
};
