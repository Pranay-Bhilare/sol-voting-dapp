import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Solvotingdapp } from '../target/types/solvotingdapp'
import { BankrunProvider, startAnchor } from "anchor-bankrun";
import { Keypair, PublicKey } from "@solana/web3.js";
const IDL = require("../target/idl/solvotingdapp.json")
const votingAddress = new PublicKey("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF")
describe('solvotingdapp', () => {
  it('Initializes a poll', async() => {
    const context = await startAnchor("", [{name:'solvotingdapp',programId:votingAddress}], []);
    const provider = new BankrunProvider(context);

	  const votingProgram = new Program<Solvotingdapp>(
      IDL,
      provider,
    );

    await votingProgram.methods.initializePoll(
      new anchor.BN(1),
      "What is your favourite peanut butter",
      new anchor.BN(0),
      new anchor.BN(1748310184),
    ).rpc();
  });
});
