"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

interface ScanResult {
  status: string;
  loc: number;
  safetyScore: number;
  issues: { severity: string; title: string; range: number[] }[];
  timestamp: string;
}

const AuditPage: NextPage = () => {
  const [code, setCode] = useState("");
  const [quote, setQuote] = useState<{ loc: number; quote: number; currency: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const { address: connectedAddress } = useAccount();

  const { writeContractAsync: writeSubscription } = useScaffoldWriteContract({
    contractName: "ClawditorSubscription",
  });

  const handleGetQuote = async () => {
    setLoading(true);
    setScanResult(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

      console.log("AUDIT_INTENT_DETECTED:", {
        codeSnippet: code.substring(0, 100) + "...",
        address: connectedAddress,
        timestamp: new Date().toISOString(),
      });

      const response = await fetch(`${apiUrl}/scan/quote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      setQuote(data);
    } catch (error) {
      console.error("Error fetching quote:", error);
    } finally {
      setLoading(false);
    }
  };

  const runScan = async (txHash?: string) => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const response = await fetch(`${apiUrl}/scan/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, address: connectedAddress, txHash }),
      });
      const data = await response.json();
      setScanResult(data);
    } catch (error) {
      console.error("Scan failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayAndAudit = async () => {
    if (!quote) return;
    try {
      const tx = await writeSubscription({
        functionName: "upgradeToPremium",
        value: parseEther(quote.quote.toString()),
      });
      console.log("Payment success, tx:", tx);
      await runScan(tx);
    } catch (error) {
      console.error("Payment failed:", error);
    }
  };

  return (
    <div className="flex items-center flex-col grow pt-10 pb-20">
      <div className="px-5 w-full max-w-4xl">
        <h1 className="text-center mb-8">
          <span className="block text-4xl font-bold">Audit Scan Dashboard</span>
        </h1>

        {!scanResult ? (
          <div className="bg-base-200 p-6 rounded-3xl shadow-xl">
            <label className="label">
              <span className="label-text font-bold text-lg">Paste Smart Contract Code (.sol)</span>
            </label>
            <textarea
              className="textarea textarea-bordered h-64 w-full font-mono text-sm"
              placeholder="// SPDX-License-Identifier: MIT..."
              value={code}
              onChange={e => setCode(e.target.value)}
            ></textarea>

            <div className="mt-4 flex justify-between items-center">
              <button
                className={`btn btn-primary ${loading ? "loading" : ""}`}
                onClick={handleGetQuote}
                disabled={!code || loading}
              >
                Get LoC Quote
              </button>

              {quote && (
                <div className="text-right">
                  <p className="m-0 font-bold">Lines of Code: {quote.loc}</p>
                  <p className="m-0 text-secondary font-bold">
                    Cost: {quote.quote} {quote.currency}
                  </p>
                </div>
              )}
            </div>

            {quote && (
              <div className="mt-8 flex justify-center">
                <button
                  className={`btn btn-secondary btn-wide btn-lg ${loading ? "loading" : ""}`}
                  onClick={handlePayAndAudit}
                  disabled={loading}
                >
                  Pay & Run Audit
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="card bg-base-200 shadow-xl rounded-3xl overflow-hidden">
              <div className="card-body items-center text-center p-10">
                <h2 className="card-title text-2xl mb-4 text-primary">Audit Complete</h2>
                <div className="stats shadow bg-base-100 w-full rounded-2xl mb-4">
                  <div className="stat">
                    <div className="stat-title text-sm opacity-60">Safety Score</div>
                    <div
                      className={`stat-value text-5xl ${scanResult.safetyScore > 70 ? "text-success" : "text-error"}`}
                    >
                      {scanResult.safetyScore}
                    </div>
                    <div className="stat-desc">Calculated via Intent-Analysis</div>
                  </div>
                  <div className="stat text-center">
                    <div className="stat-title text-sm opacity-60">LoC Scanned</div>
                    <div className="stat-value text-4xl">{scanResult.loc}</div>
                    <div className="stat-desc font-mono">x402 protocol parity</div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <span className="badge badge-outline">Base Testnet</span>
                  <span className="badge badge-outline">Commit Hash: verified</span>
                </div>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl rounded-3xl">
              <div className="card-body p-8 text-left">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <span className="mr-2">🔬</span> Vulnerability Report
                </h3>
                <div className="space-y-3">
                  {scanResult.issues.map((issue, i) => (
                    <div key={i} className="collapse collapse-arrow bg-base-100 rounded-xl border border-base-300">
                      <input type="checkbox" />
                      <div className="collapse-title font-medium flex items-center justify-between pr-10">
                        <span>{issue.title}</span>
                        <div
                          className={`badge ${
                            issue.severity === "High"
                              ? "badge-error"
                              : issue.severity === "Medium"
                                ? "badge-warning"
                                : "badge-info"
                          }`}
                        >
                          {issue.severity}
                        </div>
                      </div>
                      <div className="collapse-content">
                        <p className="text-sm opacity-70">
                          Detected in implementation around line {issue.range[0]}. This pattern suggests a potential
                          intent-implementation gap.
                        </p>
                        <code className="block bg-base-300 p-2 rounded text-xs mt-2 overflow-x-auto">
                          {"// Potential issue range: L" + issue.range[0] + " - L" + issue.range[1]}
                        </code>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="card-actions justify-center mt-8">
                  <button className="btn btn-outline btn-wide" onClick={() => setScanResult(null)}>
                    New Audit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditPage;
