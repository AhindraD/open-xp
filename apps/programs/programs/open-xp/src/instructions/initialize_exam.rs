use anchor_lang::prelude::*;

use crate::constants::*;
use crate::errors::OpenXpError;
use crate::state::*;

#[derive(Accounts)]
#[instruction(exam_id: String)]
pub struct InitializeExam<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        space = 8 + ExamState::INIT_SPACE,
        seeds = [b"exam", exam_id.as_bytes()],
        bump
    )]
    pub exam_state: Account<'info, ExamState>,

    pub system_program: Program<'info, System>,
}

impl<'info> InitializeExam<'info> {
    pub fn initialize_exam(
        &mut self,
        exam_id: String,
        threshold: u8,
        examiners: Vec<Pubkey>,
        s3_uri: String,
        bumps: &InitializeExamBumps,
    ) -> Result<()> {
        // Validate exam ID is not empty
        require!(!exam_id.is_empty(), OpenXpError::InvalidExamId);
        require!(
            exam_id.len() <= MAX_EXAM_ID_LENGTH,
            OpenXpError::InvalidExamId
        );

        // Validate S3 URI length
        require!(
            s3_uri.len() <= MAX_S3_URI_LENGTH,
            OpenXpError::InvalidS3Uri
        );

        // Validate examiner list
        require!(
            !examiners.is_empty(),
            OpenXpError::InvalidThreshold
        );
        require!(
            examiners.len() <= MAX_EXAMINERS,
            OpenXpError::ExaminerLimitExceeded
        );

        // Validate threshold
        require!(threshold >= 1, OpenXpError::InvalidThreshold);
        require!(
            threshold as usize <= examiners.len(),
            OpenXpError::InvalidThreshold
        );

        let clock = Clock::get()?;

        self.exam_state.set_inner(ExamState {
            exam_id,
            authority: self.authority.key(),
            examiners,
            multisig_threshold: threshold,
            current_approvals: Vec::new(),
            is_live: false,
            result_hash: String::new(),
            s3_uri,
            created_at: clock.unix_timestamp,
            bump: bumps.exam_state,
        });

        Ok(())
    }
}
