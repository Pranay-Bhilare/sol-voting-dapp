import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Solvotingdapp } from '../target/types/solvotingdapp'
import { BankrunProvider, startAnchor } from "anchor-bankrun";
import { Keypair, PublicKey } from "@solana/web3.js";
const IDL = require("../target/idl/solvotingdapp.json")
const votingAddress = new PublicKey("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF")
describe('solvotingdapp', () => {

  let context;
  let provider;
  let votingProgram: Program<Solvotingdapp>;

  beforeAll(async() => { 
    context = await startAnchor("", [{name:'solvotingdapp',programId:votingAddress}], []);
    provider = new BankrunProvider(context);

	  votingProgram = new Program<Solvotingdapp>(
      IDL,
      provider,
    );
  })
  it('Initializes a poll', async() => {
    await votingProgram.methods.initializePoll(
      new anchor.BN(1),
      "What is your favourite peanut butter",
      new anchor.BN(0),
      new anchor.BN(1748310184),
    ).rpc();

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8)],
      votingAddress
    );
    const poll = await votingProgram.account.poll.fetch(pollAddress);
    console.log(poll);
  });

  it("Initializes a candidate", async() => {
    await votingProgram.methods.initializeCandidate(
      "Smooth",
      new anchor.BN(1),
    ).rpc();
    await votingProgram.methods.initializeCandidate(
      "Crunchy",
      new anchor.BN(1),
    ).rpc();

    const [smoothAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8),Buffer.from("Smooth")],
      votingAddress
    )
    const [crunchyAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8),Buffer.from("Crunchy")],
      votingAddress
    )

    const smooth = await votingProgram.account.candidate.fetch(smoothAddress);
    const crunchy = await votingProgram.account.candidate.fetch(crunchyAddress);

    console.log(smooth);
    console.log(crunchy);
  });
});
