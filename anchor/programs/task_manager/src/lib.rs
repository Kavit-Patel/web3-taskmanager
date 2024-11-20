use anchor_lang::prelude::*;

declare_id!("D82UX2KFbcu9ztdkSE4GTYwuWNoGmDRupjQVJ1b9bodj");

#[program]
pub mod task_manager {
    use super::*;
    pub fn initialize_task(ctx: Context<InitializeTask>, input: TaskInput) -> Result<()> {
        let task_account = &mut ctx.accounts.user_account;
        msg!("ca {} and {}", task_account.owner, *ctx.accounts.owner.key);
        task_account.title = input.title;
        task_account.description = input.description;
        task_account.priority = input.priority;
        task_account.added_date = input.added_date;
        task_account.due_date = input.due_date;
        task_account.is_complete = input.is_complete;
        task_account.owner = *ctx.accounts.owner.key;
        msg!("Task Created : title {},description {},priority {},due_date {},is_complete {},owner {} ",task_account.title,task_account.description,task_account.priority,task_account.due_date,task_account.is_complete,task_account.owner);

        Ok(())
    }
    pub fn modify_task(ctx: Context<Modify>, input: TaskInput) -> Result<()> {
        let modify_account = &mut ctx.accounts.user_account;
        msg!(
            "ca {} and {}",
            modify_account.owner,
            *ctx.accounts.owner.key
        );
        require!(
            modify_account.owner == *ctx.accounts.owner.key,
            ErrorCode::Unauthorized
        );
        modify_account.title = input.title;
        modify_account.description = input.description;
        modify_account.priority = input.priority;
        modify_account.added_date = input.added_date;
        modify_account.due_date = input.due_date;
        modify_account.is_complete = input.is_complete;
        msg!("Task Modified : {} ", modify_account.title);
        Ok(())
    }
    pub fn complete_task(ctx: Context<Modify>, is_complete: bool) -> Result<()> {
        let complete_task = &mut ctx.accounts.user_account;
        msg!("ca {} and {}", complete_task.owner, *ctx.accounts.owner.key);
        complete_task.is_complete = is_complete;
        msg!("Task has been completed !");
        Ok(())
    }
    pub fn delete_task(ctx: Context<Modify>) -> Result<()> {
        require!(
            ctx.accounts.user_account.owner == *ctx.accounts.owner.key,
            ErrorCode::Unauthorized
        );
        ctx.accounts
            .user_account
            .close(ctx.accounts.owner.to_account_info())?;
        msg!("Account has been deleted !");
        Ok(())
    }

}
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct TaskInput {
    pub title: String,
    pub description: String,
    pub priority: u8,
    pub added_date: i64,
    pub due_date: i64,
    pub is_complete: bool,
    pub owner: Pubkey,
}

#[derive(Accounts)]
#[instruction(title:String)]
pub struct InitializeTask<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
    #[account(init,payer=owner,seeds=[owner.key().as_ref(),title.as_bytes()],bump,space=8 + AccountState::INIT_SPACE)]
    pub user_account: Account<'info, AccountState>,
}

#[derive(Accounts)]
pub struct Modify<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(mut,has_one=owner)]
    pub user_account: Account<'info, AccountState>,
}
#[account]
#[derive(InitSpace)]
pub struct AccountState {
    #[max_len(100)]
    pub title: String,
    #[max_len(200)]
    pub description: String,
    pub priority: u8,
    pub added_date: i64,
    pub due_date: i64,
    pub is_complete: bool,
    pub owner: Pubkey,
}
#[error_code]
pub enum ErrorCode {
    #[msg("You are not authorized to perform this action.")]
    Unauthorized,
}
