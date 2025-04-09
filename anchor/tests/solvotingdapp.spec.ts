import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair } from '@solana/web3.js'
import { Solvotingdapp } from '../target/types/solvotingdapp'

describe('solvotingdapp', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Solvotingdapp as Program<Solvotingdapp>

  const solvotingdappKeypair = Keypair.generate()

  it('Initialize Solvotingdapp', async () => {
    await program.methods
      .initialize()
      .accounts({
        solvotingdapp: solvotingdappKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([solvotingdappKeypair])
      .rpc()

    const currentCount = await program.account.solvotingdapp.fetch(solvotingdappKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Solvotingdapp', async () => {
    await program.methods.increment().accounts({ solvotingdapp: solvotingdappKeypair.publicKey }).rpc()

    const currentCount = await program.account.solvotingdapp.fetch(solvotingdappKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Solvotingdapp Again', async () => {
    await program.methods.increment().accounts({ solvotingdapp: solvotingdappKeypair.publicKey }).rpc()

    const currentCount = await program.account.solvotingdapp.fetch(solvotingdappKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Solvotingdapp', async () => {
    await program.methods.decrement().accounts({ solvotingdapp: solvotingdappKeypair.publicKey }).rpc()

    const currentCount = await program.account.solvotingdapp.fetch(solvotingdappKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set solvotingdapp value', async () => {
    await program.methods.set(42).accounts({ solvotingdapp: solvotingdappKeypair.publicKey }).rpc()

    const currentCount = await program.account.solvotingdapp.fetch(solvotingdappKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the solvotingdapp account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        solvotingdapp: solvotingdappKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.solvotingdapp.fetchNullable(solvotingdappKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
