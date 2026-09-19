use anchor_lang::prelude::*;

/// On-chain record of a student's answer submission.
///
/// PDA seeds: `[b"answer", exam_state.key(), student.key()]`
///
/// Stores the SHA-256 hash of the student's answer payload
/// as a tamper-proof receipt. The actual answers live in DynamoDB.
#[account]
#[derive(InitSpace)]
pub struct AnswerRecord {
    /// Reference to the exam this answer belongs to
    pub exam_state: Pubkey,

    /// The student's wallet public key
    pub student: Pubkey,

    /// SHA-256 hash of the answer JSON payload (64 hex chars)
    #[max_len(64)]
    pub answer_hash: String,

    /// Unix timestamp when the answer was submitted
    pub submitted_at: i64,

    /// SHA-256 hash of the Bedrock evaluation result (score + justification)
    #[max_len(64)]
    pub evaluation_hash: String,

    /// Final AI grade (0-100)
    pub score: u8,

    /// Unix timestamp when the evaluation was recorded
    pub evaluated_at: i64,

    /// Whether this submission has been evaluated
    pub is_evaluated: bool,

    /// PDA bump seed
    pub bump: u8,
}
