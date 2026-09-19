use anchor_lang::prelude::*;

use crate::errors::OpenXpError;
use crate::state::*;

#[derive(Accounts)]
pub struct ApproveExam<'info> {
    #[account(mut)]
    pub examiner: Signer<'info>,

    #[account(
        mut,
        seeds = [b"exam", exam_state.exam_id.as_bytes()],
        bump = exam_state.bump,
    )]
    pub exam_state: Account<'info, ExamState>,
}

impl<'info> ApproveExam<'info> {
    pub fn approve_exam(&mut self) -> Result<()> {
        let exam = &mut self.exam_state;
        let examiner_key = self.examiner.key();

        // Exam must not already be live
        require!(!exam.is_live, OpenXpError::ExamAlreadyLive);

        // Signer must be in the authorized examiners list
        require!(
            exam.examiners.contains(&examiner_key),
            OpenXpError::NotAnExaminer
        );

        // Signer must not have already approved
        require!(
            !exam.current_approvals.contains(&examiner_key),
            OpenXpError::AlreadyApproved
        );

        // Record approval
        exam.current_approvals.push(examiner_key);

        // Check if threshold is met
        if exam.current_approvals.len() >= exam.multisig_threshold as usize {
            exam.is_live = true;
            msg!(
                "Exam '{}' is now LIVE! Threshold of {} approvals met.",
                exam.exam_id,
                exam.multisig_threshold
            );
        } else {
            msg!(
                "Exam '{}': {}/{} approvals collected.",
                exam.exam_id,
                exam.current_approvals.len(),
                exam.multisig_threshold
            );
        }

        Ok(())
    }
}
