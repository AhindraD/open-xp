use anchor_lang::prelude::*;

use crate::errors::OpenXpError;
use crate::state::*;

#[derive(Accounts)]
pub struct RecordEvaluation<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        seeds = [b"exam", exam_state.exam_id.as_bytes()],
        bump = exam_state.bump,
        constraint = exam_state.authority == authority.key() @ OpenXpError::Unauthorized,
    )]
    pub exam_state: Account<'info, ExamState>,

    #[account(
        mut,
        seeds = [b"answer", exam_state.key().as_ref(), answer_record.student.as_ref()],
        bump = answer_record.bump,
        constraint = !answer_record.is_evaluated @ OpenXpError::AlreadyEvaluated,
    )]
    pub answer_record: Account<'info, AnswerRecord>,
}

impl<'info> RecordEvaluation<'info> {
    pub fn record_evaluation(
        &mut self,
        evaluation_hash: String,
        score: u8,
    ) -> Result<()> {
        // Validate hash format (SHA-256 = 64 hex chars)
        require!(
            evaluation_hash.len() == 64,
            OpenXpError::InvalidEvaluationHash
        );
        require!(
            evaluation_hash.chars().all(|c| c.is_ascii_hexdigit()),
            OpenXpError::InvalidEvaluationHash
        );

        let clock = Clock::get()?;

        self.answer_record.evaluation_hash = evaluation_hash.clone();
        self.answer_record.score = score;
        self.answer_record.evaluated_at = clock.unix_timestamp;
        self.answer_record.is_evaluated = true;

        msg!(
            "Evaluation recorded for exam '{}' student {} — score: {}, evaluation_hash: {}",
            self.exam_state.exam_id,
            self.answer_record.student,
            score,
            evaluation_hash
        );

        Ok(())
    }
}
