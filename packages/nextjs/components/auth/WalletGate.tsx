"use client";

import { useAccount } from "wagmi";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

/**
 * Higher-order component to protect pages requiring a connected wallet.
 */
export const WalletGate = ({ children }: { children: React.ReactNode }) => {
  const { isConnected, isConnecting } = useAccount();

  if (isConnecting) {
    return (
      <div className="flex justify-center items-center h-full pt-20">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex items-center flex-col grow pt-20">
        <div className="card w-96 bg-base-200 shadow-xl rounded-3xl">
          <div className="card-body items-center text-center p-10">
            <h2 className="card-title text-2xl mb-4">Authentication Required</h2>
            <p className="mb-6 opacity-70">
              Please connect your wallet to access the Audit Scan Dashboard and secure your on-chain detective
              workspace.
            </p>
            <div className="card-actions">
              <RainbowKitCustomConnectButton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
