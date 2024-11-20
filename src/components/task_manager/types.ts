import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { Dispatch, SetStateAction } from "react";

export interface ITask {
  title: string;
  description: string;
  priority: number;
  addedDate: BN;
  dueDate: BN;
  isComplete: boolean;
  owner: PublicKey;
}

export interface ITasks {
  publicKey: string | PublicKey;
  account: ITask;
}

export interface IReceivedTaskData {
  currentTask: string;
  currentDescription: string;
  currentPriority: string;
  currentAddedDate: Date | null;
  currentDueDate: Date | null;
  currentIsCompleted: boolean;
  operation: "creating" | "editing";
}
