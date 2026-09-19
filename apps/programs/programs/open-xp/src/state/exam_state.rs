use anchor_lang::prelude::*;

/// On-chain state for a trustless exam.
///
/// PDA seeds: `[b"exam", exam_id.as_bytes()]`
///
/// Tracks examiner approvals via multi-sig pattern.
/// Once `current_approvals.len() >= multisig_threshold`,
/// `is_live` flips to `true` and students can access the exam.
#[account]
#[derive(InitSpace)]
pub struct ExamState {
    /// Unique identifier for the exam (e.g., "CS101-FINAL-2026")
    #[max_len(64)]
    pub exam_id: String,

    /// The authority who initialized the exam
    pub authority: Pubkey,

    /// List of authorized examiner public keys
    #[max_len(10)]
    pub examiners: Vec<Pubkey>,

    /// Number of approvals required to go live
    pub multisig_threshold: u8,

    /// Examiners who have approved so far
    #[max_len(10)]
    pub current_approvals: Vec<Pubkey>,

    /// Whether the exam is live and accessible to students
    pub is_live: bool,

    /// Optional hash of the final results (set after grading)
    #[max_len(64)]
    pub result_hash: String,

    /// S3 URI of the encrypted exam paper (e.g., "s3://bucket/exams/CS101/paper.enc.json")
    #[max_len(128)]
    pub s3_uri: String,

    /// Unix timestamp when the exam was created
    pub created_at: i64,

    /// PDA bump seed
    pub bump: u8,
}
