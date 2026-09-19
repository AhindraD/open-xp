import { z } from "zod";

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
  createdAt: z.number().int(),
  bump: z.number().int(),
});

/**
 * Schema for submitting answers to the API.
 */
export const SubmitAnswerSchema = z.object({
  examId: z.string().min(1, "Exam ID is required"),
  studentWallet: z.string().min(32, "Invalid wallet address"),
  answers: z.record(z.string(), z.string()),
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
 * Schema for exam result / grading output from Bedrock.
 */
export const ExamResultSchema = z.object({
  examId: z.string(),
  studentWallet: z.string(),
  score: z.number().min(0).max(100),
  feedback: z.record(z.string(), z.string()),
  gradedAt: z.number().int(),
  gradedBy: z.literal("bedrock-claude-3.5-sonnet"),
});

/**
 * Schema for fetching exam key request.
 */
export const FetchExamKeySchema = z.object({
  examId: z.string().min(1, "Exam ID is required"),
  studentWallet: z.string().min(32, "Invalid wallet address"),
});

export type InitializeExamInput = z.infer<typeof InitializeExamSchema>;
export type ExamState = z.infer<typeof ExamStateSchema>;
export type SubmitAnswerInput = z.infer<typeof SubmitAnswerSchema>;
export type SubmitAnswerResponse = z.infer<typeof SubmitAnswerResponseSchema>;
export type ExamResult = z.infer<typeof ExamResultSchema>;
export type FetchExamKeyInput = z.infer<typeof FetchExamKeySchema>;
