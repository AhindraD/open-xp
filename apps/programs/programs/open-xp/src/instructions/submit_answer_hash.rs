use anchor_lang::prelude::*;

use crate::errors::OpenXpError;
use crate::state::*;

#[derive(Accounts)]
pub struct SubmitAnswerHash<'info> {
    #[account(mut)]
    pub student: Signer<'info>,

    #[account(
        seeds = [b"exam", exam_state.exam_id.as_bytes()],
        bump = exam_state.bump,
        constraint = exam_state.is_live @ OpenXpError::ExamNotLive,
    )]
    pub exam_state: Account<'info, ExamState>,

    #[account(
        init,
        payer = student,
        space = 8 + AnswerRecord::INIT_SPACE,
        seeds = [b"answer", exam_state.key().as_ref(), student.key().as_ref()],
        bump
    )]
    pub answer_record: Account<'info, AnswerRecord>,

    pub system_program: Program<'info, System>,
}

impl<'info> SubmitAnswerHash<'info> {
    pub fn submit_answer_hash(
        &mut self,
        answer_hash: String,
        bumps: &SubmitAnswerHashBumps,
    ) -> Result<()> {
        // Validate hash format (SHA-256 = 64 hex chars)
        require!(
            answer_hash.len() == 64,
            OpenXpError::InvalidAnswerHash
        );
        require!(
            answer_hash.chars().all(|c| c.is_ascii_hexdigit()),
            OpenXpError::InvalidAnswerHash
        );

        let clock = Clock::get()?;

        self.answer_record.set_inner(AnswerRecord {
            exam_state: self.exam_state.key(),
            student: self.student.key(),
            answer_hash: answer_hash.clone(),
            submitted_at: clock.unix_timestamp,
            evaluation_hash: String::new(),
            score: 0,
            evaluated_at: 0,
            is_evaluated: false,
            bump: bumps.answer_record,
        });

        msg!(
            "Answer hash submitted for exam '{}' by student {}",
            self.exam_state.exam_id,
            self.student.key()
        );

        Ok(())
    }
}
