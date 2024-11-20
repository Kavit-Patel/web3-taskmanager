"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletButton } from "../solana/solana-provider";

import { useCluster } from "../cluster/cluster-data-access";
import { TaskListDisplay } from "./task_manager-display-ui";

export default function AllTaskFeature() {
  const { cluster } = useCluster();
  const { publicKey } = useWallet();

  return publicKey ? (
    <div className="w-full flex justify-center items-center">
      <TaskListDisplay />
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <WalletButton />
        </div>
      </div>
    </div>
  );
}
