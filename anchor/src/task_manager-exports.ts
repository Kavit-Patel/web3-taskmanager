// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import TaskManagerIDL from '../target/idl/task_manager.json'
import type { TaskManager } from '../target/types/task_manager'

// Re-export the generated IDL and type
export { TaskManager, TaskManagerIDL }

// The programId is imported from the program IDL.
export const TASK_MANAGER_PROGRAM_ID = new PublicKey(TaskManagerIDL.address)

// This is a helper function to get the TaskManager Anchor program.
export function getTaskManagerProgram(provider: AnchorProvider) {
  return new Program(TaskManagerIDL as TaskManager, provider)
}

// This is a helper function to get the program ID for the TaskManager program depending on the cluster.
export function getTaskManagerProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the TaskManager program on devnet and testnet.
      return new PublicKey('CounNZdmsQmWh7uVngV9FXW2dZ6zAgbJyYsvBpqbykg')
    case 'mainnet-beta':
    default:
      return TASK_MANAGER_PROGRAM_ID
  }
}
