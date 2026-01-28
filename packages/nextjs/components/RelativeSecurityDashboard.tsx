import React from "react";

interface PeerMetric {
  name: string;
  score: number;
  percentile: number;
}

export const RelativeSecurityDashboard = ({ projectScore }: { projectScore: number }) => {
  const peers: PeerMetric[] = [
    { name: "Euler Fork", score: 85, percentile: 92 },
    { name: "Badger Clone", score: 42, percentile: 15 },
    { name: "Base Stable", score: 98, percentile: 99 },
  ];

  const currentPercentile = (projectScore / 100) * 100;

  return (
    <div className="p-6 bg-base-200 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">🦞 Security Benchmarking</h2>
      <div className="flex flex-col gap-4">
        <div className="stats shadow">
          <div className="stat text-center">
            <div className="stat-title">Market Percentile</div>
            <div className="stat-value text-secondary">{currentPercentile.toFixed(1)}%</div>
            <div className="stat-desc">Top of DeFi protocols</div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full bg-base-100">
            <thead>
              <tr>
                <th>Peer Protocol</th>
                <th>Safety Score</th>
                <th>Percentile</th>
              </tr>
            </thead>
            <tbody>
              {peers.map(peer => (
                <tr key={peer.name}>
                  <td>{peer.name}</td>
                  <td>{peer.score}</td>
                  <td>{peer.percentile}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
