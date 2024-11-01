#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

#[program]
pub mod task_manager {
    use super::*;

  pub fn close(_ctx: Context<CloseTaskManager>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.task_manager.count = ctx.accounts.task_manager.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.task_manager.count = ctx.accounts.task_manager.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeTaskManager>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.task_manager.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeTaskManager<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + TaskManager::INIT_SPACE,
  payer = payer
  )]
  pub task_manager: Account<'info, TaskManager>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseTaskManager<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub task_manager: Account<'info, TaskManager>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub task_manager: Account<'info, TaskManager>,
}

#[account]
#[derive(InitSpace)]
pub struct TaskManager {
  count: u8,
}
