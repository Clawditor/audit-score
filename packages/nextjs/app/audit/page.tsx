"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const AuditPage: NextPage = () => {
  const [code, setCode] = useState("");
  const [quote, setQuote] = useState<{ loc: number; quote: number; currency: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const { address: connectedAddress } = useAccount();

  console.log("Connected as:", connectedAddress);

  const { writeContractAsync: writeSubscription } = useScaffoldWriteContract({
    contractName: "ClawditorSubscription",
  });

  const handleGetQuote = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
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

  const handlePayAndAudit = async () => {
    if (!quote) return;
    try {
      await writeSubscription({
        functionName: "upgradeToPremium",
        value: parseEther(quote.quote.toString()),
      });
      alert("Payment successful! Scan initiated.");
    } catch (error) {
      console.error("Payment failed:", error);
    }
  };

  return (
    <div className="flex items-center flex-col grow pt-10">
      <div className="px-5 w-full max-w-4xl">
        <h1 className="text-center mb-8">
          <span className="block text-4xl font-bold">Audit Scan Dashboard</span>
        </h1>

        <div className="bg-base-200 p-6 rounded-3xl shadow-xl">
          <label className="label">
            <span className="label-text font-bold">Paste Smart Contract Code (.sol)</span>
          </label>
          <textarea
            className="textarea textarea-bordered h-64 w-full font-mono"
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
        </div>

        {quote && (
          <div className="mt-8 flex justify-center">
            <button className="btn btn-secondary btn-wide btn-lg" onClick={handlePayAndAudit}>
              Pay & Run Audit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditPage;
