"use client";

import { useState } from "react";

interface X402PaymentProps {
  auditId: number;
  feeUSD: number;
  receiverAddress: string;
  onSuccess: (txHash: string) => void;
}

export default function X402Payment({ auditId, feeUSD, receiverAddress, onSuccess }: X402PaymentProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const simulatePayment = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulation of a wallet transaction
      console.log(`Sending ${feeUSD} USDC to ${receiverAddress}...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const fakeTxHash = "0x" + Math.random().toString(16).slice(2) + "deadbeef";
      
      // Notify backend
      const res = await fetch("http://localhost:3001/api/confirm-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auditId, txHash: fakeTxHash }),
      });
      
      if (!res.ok) throw new Error("Backend confirmation failed");
      
      onSuccess(fakeTxHash);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900 rounded-xl animate-in fade-in slide-in-from-bottom-4">
      <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2">Payment Required</h3>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-xs text-blue-700/70 dark:text-blue-300/70 uppercase font-bold tracking-wider">Estimated Fee</p>
          <p className="text-2xl font-mono text-blue-900 dark:text-blue-50">${feeUSD.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-blue-700/70 dark:text-blue-300/70 uppercase font-bold tracking-wider">Method</p>
          <p className="text-lg text-blue-900 dark:text-blue-50">USDC (x402)</p>
        </div>
      </div>
      
      {error && (
        <p className="text-red-500 text-sm mb-4">Error: {error}</p>
      )}

      <button 
        onClick={simulatePayment}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
      >
        {loading ? "Processing Transaction..." : "Pay & Scan Now"}
      </button>
      
      <p className="text-[10px] text-center mt-4 text-blue-800/50 dark:text-blue-200/50">
        Receiver: {receiverAddress}
      </p>
    </div>
  );
}
