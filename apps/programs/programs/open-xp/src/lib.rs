#![allow(unexpected_cfgs)]
use anchor_lang::prelude::*;

pub mod constants;
pub mod errors;
pub mod instructions;
pub mod state;

use instructions::*;

declare_id!("7KjAvFx41EYsThCnMGkk5UFbze2aHjwXWxMHqm56bz8y");

#[program]
pub mod open_xp {
    use super::*;

    /// Initialize a new exam with a multi-sig threshold and encrypted paper S3 URI.
    ///
    /// Creates an `ExamState` PDA that tracks examiner approvals
    /// and gates access to encrypted exam content.
    pub fn initialize_exam(
        ctx: Context<InitializeExam>,
        exam_id: String,
        threshold: u8,
        examiners: Vec<Pubkey>,
        s3_uri: String,
    ) -> Result<()> {
        ctx.accounts
            .initialize_exam(exam_id, threshold, examiners, s3_uri, &ctx.bumps)
    }

    /// Approve an exam as an authorized examiner.
    ///
    /// Once the number of approvals meets the `multisig_threshold`,
    /// the exam transitions to `is_live = true`, allowing students
    /// to decrypt the exam paper via the AWS KMS integration.
    pub fn approve_exam(ctx: Context<ApproveExam>) -> Result<()> {
        ctx.accounts.approve_exam()
    }

    /// Submit an immutable SHA-256 hash of a student's answer payload.
    ///
    /// The hash is recorded on-chain as a tamper-proof receipt.
    /// The actual answers are stored off-chain in DynamoDB.
    /// Requires the exam to be live (`is_live == true`).
    pub fn submit_answer_hash(
        ctx: Context<SubmitAnswerHash>,
        answer_hash: String,
    ) -> Result<()> {
        ctx.accounts
            .submit_answer_hash(answer_hash, &ctx.bumps)
    }

    /// Anchor a Bedrock AI evaluation result (score + justification hash) on-chain.
    ///
    /// Called by the authority/backend grading wallet to guarantee
    /// immutable, tamper-proof academic grading receipts.
    pub fn record_evaluation(
        ctx: Context<RecordEvaluation>,
        evaluation_hash: String,
        score: u8,
    ) -> Result<()> {
        ctx.accounts.record_evaluation(evaluation_hash, score)
    }
}
