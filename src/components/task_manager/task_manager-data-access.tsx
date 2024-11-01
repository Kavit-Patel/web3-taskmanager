'use client'

import {getTaskManagerProgram, getTaskManagerProgramId} from '@project/anchor'
import {useConnection} from '@solana/wallet-adapter-react'
import {Cluster, Keypair, PublicKey} from '@solana/web3.js'
import {useMutation, useQuery} from '@tanstack/react-query'
import {useMemo} from 'react'
import toast from 'react-hot-toast'
import {useCluster} from '../cluster/cluster-data-access'
import {useAnchorProvider} from '../solana/solana-provider'
import {useTransactionToast} from '../ui/ui-layout'

export function useTaskManagerProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getTaskManagerProgramId(cluster.network as Cluster), [cluster])
  const program = getTaskManagerProgram(provider)

  const accounts = useQuery({
    queryKey: ['task_manager', 'all', { cluster }],
    queryFn: () => program.account.task_manager.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['task_manager', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ task_manager: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useTaskManagerProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useTaskManagerProgram()

  const accountQuery = useQuery({
    queryKey: ['task_manager', 'fetch', { cluster, account }],
    queryFn: () => program.account.task_manager.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['task_manager', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ task_manager: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['task_manager', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ task_manager: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['task_manager', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ task_manager: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['task_manager', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ task_manager: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
