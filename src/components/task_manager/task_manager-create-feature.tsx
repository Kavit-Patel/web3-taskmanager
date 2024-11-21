"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletButton } from "../solana/solana-provider";
import { AppHero } from "../ui/ui-layout";
import { TaskManagerCreate } from "./task_manager-create-ui";
import { useCluster } from "../cluster/cluster-data-access";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { ITask } from "./types";

export default function TaskManagerFeature() {
  const { cluster } = useCluster();
  const { publicKey } = useWallet();
  const url = useSearchParams();
  const [editData, setEditData] = useState<ITask | null>(() => {
    const data = url.get("data");
    if (data && typeof data === "string") {
      try {
        return JSON.parse(data);
      } catch (error) {
        return null;
      }
    }
    return null;
  });
  return publicKey ? (
    <div className="w-full mt-24 md:mt-0">
      <AppHero
        title="TaskManager"
        subtitle={
          cluster.active
            ? `Tasks are currently Stored on solana ${cluster.name} network`
            : " "
        }
      >
        {editData ? (
          <TaskManagerCreate
            currentTask={editData.title}
            currentDescription={editData.description}
            currentPriority={editData.priority.toString()}
            currentAddedDate={new Date(editData.addedDate.toString())}
            currentDueDate={new Date(editData.dueDate.toString())}
            currentIsCompleted={editData.isComplete}
            operation="editing"
          />
        ) : (
          <TaskManagerCreate
            currentTask=""
            currentDescription=""
            currentPriority=""
            currentAddedDate={null}
            currentDueDate={null}
            currentIsCompleted={false}
            operation="creating"
          />
        )}
      </AppHero>
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
