"use client";

import { useState } from "react";
import Image from "next/image";
import X402Payment from "@/components/X402Payment";

export default function Home() {
  const [sourceCode, setSourceCode] = useState("");
  const [auditInfo, setAuditInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [paymentTx, setPaymentTx] = useState<string | null>(null);

  const handlePrepare = async () => {
    setLoading(true);
    setPaymentTx(null);
    try {
      const res = await fetch("http://localhost:3001/api/prepare-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceCode, address: "0x123..." }),
      });
      const data = await res.json();
      setAuditInfo(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (txHash: string) => {
    setPaymentTx(txHash);
    setAuditInfo((prev: any) => ({ ...prev, status: "paid" }));
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 dark:bg-black font-sans">
      <header className="w-full max-w-5xl py-8 flex justify-between items-center px-6">
        <div className="flex items-center gap-2">
          <Image src="/vercel.svg" alt="Logo" width={24} height={24} className="dark:invert" />
          <span className="font-bold text-xl tracking-tight">CLAWDITOR</span>
        </div>
        <button className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg font-medium text-sm">
          Connect Wallet
        </button>
      </header>

      <main className="flex flex-col w-full max-w-4xl px-6 gap-8 py-12">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Lobster-grade Logic Checks
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg">
            Upload your Solidity code for automated deep analysis and security scoring.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-1 shadow-sm">
          <textarea
            className="w-full h-64 p-4 bg-transparent outline-none text-sm font-mono resize-none text-zinc-800 dark:text-zinc-200"
            placeholder="Paste your smart contract here..."
            value={sourceCode}
            onChange={(e) => setSourceCode(e.target.value)}
          />
          <div className="p-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
            <span className="text-xs text-zinc-500 font-mono">
              {sourceCode.split("\n").filter(l => l.trim()).length} lines detected
            </span>
            <button
              onClick={handlePrepare}
              disabled={loading || !sourceCode}
              className="bg-zinc-900 dark:bg-white text-white dark:text-black px-6 py-2 rounded-lg font-semibold text-sm disabled:opacity-50"
            >
              {loading ? "Calculating..." : "Prepare Audit"}
            </button>
          </div>
        </div>

        {auditInfo && auditInfo.status === "payment_pending" && (
          <X402Payment 
            auditId={auditInfo.auditId}
            feeUSD={auditInfo.feeUSD}
            receiverAddress={auditInfo.receiverAddress}
            onSuccess={handlePaymentSuccess}
          />
        )}

        {paymentTx && (
          <div className="p-6 bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900 rounded-xl animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-green-900 dark:text-green-100 mb-2">Payment Confirmed!</h3>
            <p className="text-sm text-green-800 dark:text-green-200 mb-4">
              Analysis in progress for Audit #{auditInfo.auditId}. Transaction: 
              <span className="font-mono ml-1 underline">{paymentTx.slice(0, 10)}...</span>
            </p>
            <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full animate-progress-fast" style={{ width: '60%' }}></div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
