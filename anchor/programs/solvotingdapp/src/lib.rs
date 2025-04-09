#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod solvotingdapp {
    use super::*;

  pub fn close(_ctx: Context<CloseSolvotingdapp>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.solvotingdapp.count = ctx.accounts.solvotingdapp.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.solvotingdapp.count = ctx.accounts.solvotingdapp.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeSolvotingdapp>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.solvotingdapp.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeSolvotingdapp<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Solvotingdapp::INIT_SPACE,
  payer = payer
  )]
  pub solvotingdapp: Account<'info, Solvotingdapp>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseSolvotingdapp<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub solvotingdapp: Account<'info, Solvotingdapp>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub solvotingdapp: Account<'info, Solvotingdapp>,
}

#[account]
#[derive(InitSpace)]
pub struct Solvotingdapp {
  count: u8,
}
