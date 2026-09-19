import { z } from "zod";

/**
 * Schema for exam creation (Phase A: Admin upload & KMS encryption)
 */
export const CreateExamSchema = z.object({
  examId: z.string().min(1, "Exam ID is required").max(64, "Max 64 characters"),
  title: z.string().min(1, "Title is required").max(128, "Max 128 characters"),
  description: z.string().min(1, "Description is required"),
  threshold: z.number().int().min(1, "Threshold must be at least 1"),
  examiners: z
    .array(z.string().min(32, "Invalid public key"))
    .min(1, "At least one examiner is required")
    .max(10, "Maximum 10 examiners allowed"),
  paperContent: z.string().min(1, "Question paper content is required"),
});

export const CreateExamResponseSchema = z.object({
  examId: z.string(),
  s3Uri: z.string(),
  ciphertextBlob: z.string(),
  iv: z.string(),
  authTag: z.string(),
  createdAt: z.number().int(),
});

/**
 * Schema for initializing an exam on-chain.
 */
export const InitializeExamSchema = z.object({
  examId: z.string().min(1, "Exam ID is required"),
  threshold: z.number().int().min(1, "Threshold must be at least 1"),
  examiners: z
    .array(z.string().min(32, "Invalid public key"))
    .min(1, "At least one examiner is required")
    .max(10, "Maximum 10 examiners allowed"),
  s3Uri: z.string().min(1, "S3 URI is required").max(128, "Max 128 characters"),
});

/**
 * Schema for the on-chain ExamState account data.
 */
export const ExamStateSchema = z.object({
  examId: z.string(),
  authority: z.string(),
  examiners: z.array(z.string()),
  multisigThreshold: z.number().int(),
  currentApprovals: z.array(z.string()),
  isLive: z.boolean(),
  resultHash: z.string().nullable(),
  s3Uri: z.string(),
  createdAt: z.number().int(),
  bump: z.number().int(),
});

/**
 * Schema for the on-chain AnswerRecord account data.
 */
export const AnswerRecordSchema = z.object({
  examState: z.string(),
  student: z.string(),
  answerHash: z.string().length(64),
  submittedAt: z.number().int(),
  evaluationHash: z.string(),
  score: z.number().int().min(0).max(100),
  evaluatedAt: z.number().int(),
  isEvaluated: z.boolean(),
  bump: z.number().int(),
});

/**
 * Schema for submitting answers to the API.
 */
export const SubmitAnswerSchema = z.object({
  examId: z.string().min(1, "Exam ID is required"),
  studentWallet: z.string().min(32, "Invalid wallet address"),
  answers: z.record(z.string(), z.string()),
  attachments: z.array(z.string()).optional(),
});

/**
 * Schema for the answer submission response from the API.
 */
export const SubmitAnswerResponseSchema = z.object({
  examId: z.string(),
  studentWallet: z.string(),
  answerHash: z.string().length(64, "SHA-256 hash must be 64 hex characters"),
  submittedAt: z.number().int(),
});

/**
 * Bedrock Converse API Strict Tool Schema (Phase D)
 * Exact format mandated by Track B architecture reference
 */
export const BedrockEvaluationSchema = z.object({
  score: z.number().min(0).max(100),
  rubric_match: z.record(z.string(), z.string()),
  justification: z.string().min(1),
});

/**
 * Schema for full evaluation result including cryptographic hash and metadata.
 */
export const EvaluationResultSchema = z.object({
  examId: z.string(),
  studentWallet: z.string(),
  score: z.number().min(0).max(100),
  rubric_match: z.record(z.string(), z.string()),
  justification: z.string(),
  evaluationHash: z.string().length(64),
  evaluatedAt: z.number().int(),
  evaluatedBy: z.string(),
  onChainAnchored: z.boolean(),
  txSignature: z.string().optional(),
});

/**
 * Schema for recording evaluation on Solana Anchor program.
 */
export const RecordEvaluationSchema = z.object({
  examId: z.string().min(1, "Exam ID is required"),
  studentWallet: z.string().min(32, "Invalid wallet address"),
  evaluationHash: z
    .string()
    .length(64, "SHA-256 hash must be 64 hex characters"),
  score: z.number().int().min(0).max(100),
});

/**
 * Schema for fetching exam key request (Phase B)
 */
export const FetchExamKeySchema = z.object({
  examId: z.string().min(1, "Exam ID is required"),
  studentWallet: z.string().min(32, "Invalid wallet address"),
});

export const FetchExamKeyResponseSchema = z.object({
  examId: z.string(),
  plaintextKey: z.string(), // base64
  s3Uri: z.string(),
  encryptedPaper: z.object({
    iv: z.string(),
    authTag: z.string(),
    ciphertext: z.string(),
  }),
});

export type CreateExamInput = z.infer<typeof CreateExamSchema>;
export type CreateExamResponse = z.infer<typeof CreateExamResponseSchema>;
export type InitializeExamInput = z.infer<typeof InitializeExamSchema>;
export type ExamState = z.infer<typeof ExamStateSchema>;
export type AnswerRecord = z.infer<typeof AnswerRecordSchema>;
export type SubmitAnswerInput = z.infer<typeof SubmitAnswerSchema>;
export type SubmitAnswerResponse = z.infer<typeof SubmitAnswerResponseSchema>;
export type BedrockEvaluation = z.infer<typeof BedrockEvaluationSchema>;
export type EvaluationResult = z.infer<typeof EvaluationResultSchema>;
export type RecordEvaluationInput = z.infer<typeof RecordEvaluationSchema>;
export type FetchExamKeyInput = z.infer<typeof FetchExamKeySchema>;
export type FetchExamKeyResponse = z.infer<typeof FetchExamKeyResponseSchema>;
