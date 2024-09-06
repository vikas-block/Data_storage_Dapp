use anchor_lang::prelude::*;

declare_id!("HKJNVFBAz9sTejCWaiGyttQvVBHGDr3KTbyLWcNEjiez");

#[program]
pub mod storage_project {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        
        let initial_account = &mut ctx.accounts.initial_account;
        initial_account.value=20;
        
        Ok(())
    }
    pub fn update_value(ctx: Context<UpdateValue>,value :u64)->Result<()>{

        let storage_account = &mut ctx.accounts.storage_account;
        storage_account.value=value;
        Ok(())
    }


}

#[derive(Accounts)]
pub struct Initialize<'info>{
       
    #[account(mut)]
    pub user : Signer<'info>,

        #[account(
            init , 
            payer = user ,
            space=9000
        )]
        pub  initial_account : Account<'info,Init>,
        // #[account(mut)]
        // pub user : Signer<'info>,
        pub system_program :Program<'info,System>,
}


#[derive(Accounts)]
pub struct  UpdateValue<'info >{

    #[account(mut)]
    pub storage_account : Account<'info, Init>,
}

#[account]
pub struct Init{
    pub value: u64,
}
