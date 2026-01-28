"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { DocumentMagnifyingGlassIcon, MagnifyingGlassIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { RelativeSecurityDashboard } from "~~/components/RelativeSecurityDashboard";

const Home: NextPage = () => {
  const [contractAddress, setContractAddress] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [lastScore, setLastScore] = useState<number | null>(null);

  const handleScan = async () => {
    setIsScanning(true);
    // Simulate API call to hono-server/scan/run
    setTimeout(() => {
      setIsScanning(false);
      setLastScore(Math.floor(Math.random() * 40) + 60); // Random score for demo
    }, 2000);
  };

  return (
    <>
      <div className="flex items-center flex-col grow pt-10 px-5">
        <div className="max-w-4xl w-full">
          <div className="flex justify-between items-center mb-12 bg-base-200 p-8 rounded-3xl shadow-xl border-t-4 border-secondary">
            <div>
              <h1 className="text-4xl font-bold mb-2 lobster-text text-secondary text-left">🦞 Clawditor Dashboard</h1>
              <p className="text-lg opacity-70">Detecting on-chain vulnerabilities and mapping agent safety scores.</p>
            </div>
            <div className="hidden md:block">
              <ShieldCheckIcon className="h-20 w-20 text-secondary opacity-20" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Audit Search Tool */}
            <div className="bg-base-100 p-8 rounded-3xl shadow-lg border border-base-300">
              <div className="flex items-center gap-3 mb-6">
                <DocumentMagnifyingGlassIcon className="h-8 w-8 text-secondary" />
                <h2 className="text-2xl font-bold">Initiate Audit</h2>
              </div>
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Contract Address (0x...)"
                  className="input input-bordered w-full font-mono text-sm"
                  value={contractAddress}
                  onChange={e => setContractAddress(e.target.value)}
                />
                <button
                  className={`btn btn-secondary w-full ${isScanning ? "loading" : ""}`}
                  disabled={!contractAddress || isScanning}
                  onClick={handleScan}
                >
                  {isScanning ? "Analyzing Code..." : "Start Deep Scan"}
                </button>
              </div>
            </div>

            {/* Live Stats */}
            <div className="bg-base-100 p-8 rounded-3xl shadow-lg border border-base-300">
              <div className="flex items-center gap-3 mb-6">
                <MagnifyingGlassIcon className="h-8 w-8 text-secondary" />
                <h2 className="text-2xl font-bold">Registry Metrics</h2>
              </div>
              <div className="stats stats-vertical w-full bg-transparent">
                <div className="stat px-0">
                  <div className="stat-title">Immutably Anchored</div>
                  <div className="stat-value text-2xl">1,402 Audits</div>
                </div>
                <div className="stat px-0">
                  <div className="stat-title">Verified Signers</div>
                  <div className="stat-value text-2xl">48 Agents</div>
                </div>
              </div>
            </div>
          </div>

          {/* Benchmarking Component */}
          {lastScore !== null && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <RelativeSecurityDashboard projectScore={lastScore} />
            </div>
          )}

          {lastScore === null && (
            <div className="bg-base-200 p-12 rounded-3xl text-center opacity-50 border-2 border-dashed border-base-300">
              <p className="text-xl italic font-medium">
                Scan a contract address to generate relative benchmarking data.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
