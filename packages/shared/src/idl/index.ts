/**
 * Anchor IDL representation for the Open-XP Smart Contract.
 * Program ID: 7KjAvFx41EYsThCnMGkk5UFbze2aHjwXWxMHqm56bz8y
 */

export const OPEN_XP_IDL = {
  version: "0.1.0",
  name: "open_xp",
  instructions: [
    {
      name: "initializeExam",
      accounts: [
        { name: "authority", isMut: true, isSigner: true },
        { name: "examState", isMut: true, isSigner: false },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [
        { name: "examId", type: "string" },
        { name: "threshold", type: "u8" },
        { name: "examiners", type: { vec: "publicKey" } },
        { name: "s3Uri", type: "string" },
      ],
    },
    {
      name: "approveExam",
      accounts: [
        { name: "examiner", isMut: false, isSigner: true },
        { name: "examState", isMut: true, isSigner: false },
      ],
      args: [],
    },
    {
      name: "submitAnswerHash",
      accounts: [
        { name: "student", isMut: true, isSigner: true },
        { name: "examState", isMut: false, isSigner: false },
        { name: "answerRecord", isMut: true, isSigner: false },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [{ name: "answerHash", type: "string" }],
    },
    {
      name: "recordEvaluation",
      accounts: [
        { name: "authority", isMut: true, isSigner: true },
        { name: "examState", isMut: false, isSigner: false },
        { name: "answerRecord", isMut: true, isSigner: false },
      ],
      args: [
        { name: "evaluationHash", type: "string" },
        { name: "score", type: "u8" },
      ],
    },
  ],
  accounts: [
    {
      name: "ExamState",
      type: {
        kind: "struct",
        fields: [
          { name: "examId", type: "string" },
          { name: "authority", type: "publicKey" },
          { name: "examiners", type: { vec: "publicKey" } },
          { name: "multisigThreshold", type: "u8" },
          { name: "currentApprovals", type: { vec: "publicKey" } },
          { name: "isLive", type: "bool" },
          { name: "resultHash", type: "string" },
          { name: "s3Uri", type: "string" },
          { name: "createdAt", type: "i64" },
          { name: "bump", type: "u8" },
        ],
      },
    },
    {
      name: "AnswerRecord",
      type: {
        kind: "struct",
        fields: [
          { name: "examState", type: "publicKey" },
          { name: "student", type: "publicKey" },
          { name: "answerHash", type: "string" },
          { name: "submittedAt", type: "i64" },
          { name: "evaluationHash", type: "string" },
          { name: "score", type: "u8" },
          { name: "evaluatedAt", type: "i64" },
          { name: "isEvaluated", type: "bool" },
          { name: "bump", type: "u8" },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: "ExamNotLive",
      msg: "Exam is not live — waiting for examiner approvals",
    },
    {
      code: 6001,
      name: "AlreadyApproved",
      msg: "This examiner has already approved the exam",
    },
    {
      code: 6002,
      name: "NotAnExaminer",
      msg: "Signer is not an authorized examiner for this exam",
    },
    {
      code: 6003,
      name: "ExamAlreadyLive",
      msg: "Exam is already live — cannot approve again",
    },
    {
      code: 6004,
      name: "InvalidThreshold",
      msg: "Invalid threshold — must be >= 1 and <= number of examiners",
    },
    {
      code: 6005,
      name: "AnswerAlreadySubmitted",
      msg: "Answer has already been submitted for this exam",
    },
    {
      code: 6006,
      name: "InvalidExamId",
      msg: "Invalid exam ID — must be non-empty and <= 64 characters",
    },
    {
      code: 6007,
      name: "ExaminerLimitExceeded",
      msg: "Examiner limit exceeded — maximum 10 examiners per exam",
    },
    {
      code: 6008,
      name: "InvalidAnswerHash",
      msg: "Invalid answer hash — must be a 64-character hex string (SHA-256)",
    },
    {
      code: 6009,
      name: "Unauthorized",
      msg: "Unauthorized — only the exam authority can perform this action",
    },
    {
      code: 6010,
      name: "InvalidS3Uri",
      msg: "Invalid S3 URI — must be <= 128 characters",
    },
    {
      code: 6011,
      name: "InvalidEvaluationHash",
      msg: "Invalid evaluation hash — must be a 64-character hex string (SHA-256)",
    },
    {
      code: 6012,
      name: "AlreadyEvaluated",
      msg: "Answer has already been evaluated",
    },
  ],
} as const;

export type OpenXpIDL = typeof OPEN_XP_IDL;
export const IDL = OPEN_XP_IDL;
