"use client";

import {
  getTaskManagerProgram,
  getTaskManagerProgramId,
} from "@project/anchor";
import { useConnection } from "@solana/wallet-adapter-react";
import { Cluster, PublicKey, SystemProgram } from "@solana/web3.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import toast from "react-hot-toast";
import { useCluster } from "../cluster/cluster-data-access";
import { useAnchorProvider } from "../solana/solana-provider";
import { useTransactionToast } from "../ui/ui-layout";
import { BN } from "bn.js";
import { useRouter } from "next/navigation";
import { ITask } from "./types";

export function useTaskManagerProgram() {
  const router = useRouter();
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getTaskManagerProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = getTaskManagerProgram(provider);

  const accounts = useQuery({
    queryKey: ["task_manager", "all", { cluster }],
    queryFn: () => program.account.accountState.all(),
    enabled: !!cluster && !!provider,
  });

  const getProgramAccount = useQuery({
    queryKey: ["get-program-account", { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const createEntry = useMutation<string, Error, ITask>({
    mutationKey: ["taskinput", "create", { cluster }],
    mutationFn: async ({
      title,
      description,
      priority,
      addedDate,
      dueDate,
      isComplete,
      owner,
    }) => {
      const [taskPda, bump] = await PublicKey.findProgramAddress(
        [owner.toBuffer(), Buffer.from(title)],
        program.programId
      );
      return program.methods
        .initializeTask({
          title,
          description,
          priority,
          addedDate,
          dueDate,
          isComplete,
          owner,
        })
        .accounts({
          owner,
          systemProgram: SystemProgram.programId,
          userAccount: taskPda,
        } as any)
        .rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      accounts.refetch();
      router.push("/all_tasks");
    },
    onError: (err) => {
      console.log("Error ", err);
      toast.error(`Error initializing task ${err.message}`);
    },
  });

  const updateEntry = useMutation<string, Error, ITask>({
    mutationKey: ["taskinput", "edit", { cluster }],
    mutationFn: async ({
      title,
      description,
      priority,
      addedDate,
      dueDate,
      isComplete,
      owner,
    }) => {
      const [taskPda, bump] = await PublicKey.findProgramAddress(
        [owner.toBuffer(), Buffer.from(title)],
        program.programId
      );
      return program.methods
        .modifyTask({
          title,
          description,
          priority,
          addedDate,
          dueDate,
          isComplete,
          owner,
        })
        .accounts({
          owner,
          systemProgram: SystemProgram.programId,
          userAccount: taskPda,
        } as any)
        .rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      accounts.refetch();
      router.push("/all_tasks");
    },
    onError: (err) => {
      console.log("Error ", err);
      toast.error(`Error initializing task ${err.message}`);
    },
  });

  const completeEntry = useMutation<string, Error, ITask>({
    mutationKey: ["taskinput", "edit", { cluster }],
    mutationFn: async ({
      title,
      description,
      priority,
      addedDate,
      dueDate,
      isComplete,
      owner,
    }) => {
      const [taskPda, bump] = await PublicKey.findProgramAddress(
        [owner.toBuffer(), Buffer.from(title)],
        program.programId
      );
      return program.methods
        .completeTask(isComplete)
        .accounts({
          owner,
          systemProgram: SystemProgram.programId,
          userAccount: taskPda,
        } as any)
        .rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      accounts.refetch();
      router.push("/all_tasks");
    },
    onError: (err) => {
      console.log("Error ", err);
      toast.error(`Error initializing task ${err.message}`);
    },
  });
  const deleteEntry = useMutation<string, Error, ITask>({
    mutationKey: ["taskinput", "edit", { cluster }],
    mutationFn: async ({
      title,
      description,
      priority,
      addedDate,
      dueDate,
      isComplete,
      owner,
    }) => {
      const [taskPda, bump] = await PublicKey.findProgramAddress(
        [owner.toBuffer(), Buffer.from(title)],
        program.programId
      );
      return program.methods
        .deleteTask()
        .accounts({
          owner,
          systemProgram: SystemProgram.programId,
          userAccount: taskPda,
        } as any)
        .rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      accounts.refetch();
      router.push("/all_tasks");
    },
    onError: (err) => {
      console.log("Error ", err);
      toast.error(`Error initializing task ${err.message}`);
    },
  });

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    createEntry,
    updateEntry,
    completeEntry,
    deleteEntry,
  };
}

export function useTaskManagerProgramAccount({
  account,
}: {
  account: PublicKey;
}) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, accounts } = useTaskManagerProgram();

  const accountQuery = useQuery({
    queryKey: ["task_manager", "fetch", { cluster, account }],
    queryFn: () => program.account.accountState.fetch(account),
  });

  return {
    accountQuery,
  };
}
