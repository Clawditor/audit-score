export interface IndustryPeer {
  name: string;
  category: string;
  exploitEra: string;
  safetyScore: number;
  percentile: number;
  mitigationStatus: "Resolved" | "Heuristic-Active" | "Vulnerable";
}

export const industryPeers: IndustryPeer[] = [
  {
    name: "Euler Finance",
    category: "Lending logic",
    exploitEra: "2023",
    safetyScore: 85,
    percentile: 92,
    mitigationStatus: "Heuristic-Active"
  },
  {
    name: "BadgerDAO",
    category: "Frontend Injection",
    exploitEra: "2021",
    safetyScore: 42,
    percentile: 15,
    mitigationStatus: "Heuristic-Active"
  },
  {
    name: "Standard Compound Fork",
    category: "DeFi Infrastructure",
    exploitEra: "2020-2022",
    safetyScore: 78,
    percentile: 65,
    mitigationStatus: "Resolved"
  }
];

export const calculatePercentile = (score: number): number => {
  const count = industryPeers.filter(p => p.safetyScore < score).length;
  return (count / industryPeers.length) * 100;
};
