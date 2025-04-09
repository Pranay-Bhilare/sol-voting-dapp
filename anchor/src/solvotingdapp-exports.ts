// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import SolvotingdappIDL from '../target/idl/solvotingdapp.json'
import type { Solvotingdapp } from '../target/types/solvotingdapp'

// Re-export the generated IDL and type
export { Solvotingdapp, SolvotingdappIDL }

// The programId is imported from the program IDL.
export const SOLVOTINGDAPP_PROGRAM_ID = new PublicKey(SolvotingdappIDL.address)

// This is a helper function to get the Solvotingdapp Anchor program.
export function getSolvotingdappProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...SolvotingdappIDL, address: address ? address.toBase58() : SolvotingdappIDL.address } as Solvotingdapp, provider)
}

// This is a helper function to get the program ID for the Solvotingdapp program depending on the cluster.
export function getSolvotingdappProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Solvotingdapp program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return SOLVOTINGDAPP_PROGRAM_ID
  }
}
