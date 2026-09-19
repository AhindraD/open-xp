use anchor_lang::prelude::*;

#[error_code]
pub enum OpenXpError {
    #[msg("Exam is not live — waiting for examiner approvals")]
    ExamNotLive,

    #[msg("This examiner has already approved the exam")]
    AlreadyApproved,

    #[msg("Signer is not an authorized examiner for this exam")]
    NotAnExaminer,

    #[msg("Exam is already live — cannot approve again")]
    ExamAlreadyLive,

    #[msg("Invalid threshold — must be >= 1 and <= number of examiners")]
    InvalidThreshold,

    #[msg("Answer has already been submitted for this exam")]
    AnswerAlreadySubmitted,

    #[msg("Invalid exam ID — must be non-empty and <= 64 characters")]
    InvalidExamId,

    #[msg("Examiner limit exceeded — maximum 10 examiners per exam")]
    ExaminerLimitExceeded,

    #[msg("Invalid answer hash — must be a 64-character hex string (SHA-256)")]
    InvalidAnswerHash,

    #[msg("Unauthorized — only the exam authority can perform this action")]
    Unauthorized,

    #[msg("Invalid S3 URI — must be <= 128 characters")]
    InvalidS3Uri,

    #[msg("Invalid evaluation hash — must be a 64-character hex string (SHA-256)")]
    InvalidEvaluationHash,

    #[msg("Answer has already been evaluated")]
    AlreadyEvaluated,
}
