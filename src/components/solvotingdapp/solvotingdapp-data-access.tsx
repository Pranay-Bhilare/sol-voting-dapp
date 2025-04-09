'use client'

import { getSolvotingdappProgram, getSolvotingdappProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'

export function useSolvotingdappProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getSolvotingdappProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getSolvotingdappProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['solvotingdapp', 'all', { cluster }],
    queryFn: () => program.account.solvotingdapp.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['solvotingdapp', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ solvotingdapp: keypair.publicKey }).signers([keypair]).rpc(),
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

export function useSolvotingdappProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useSolvotingdappProgram()

  const accountQuery = useQuery({
    queryKey: ['solvotingdapp', 'fetch', { cluster, account }],
    queryFn: () => program.account.solvotingdapp.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['solvotingdapp', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ solvotingdapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['solvotingdapp', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ solvotingdapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['solvotingdapp', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ solvotingdapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['solvotingdapp', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ solvotingdapp: account }).rpc(),
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
