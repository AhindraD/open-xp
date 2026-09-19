/**
 * Open-XP Shared Constants
 *
 * Central source of truth for program IDs, seeds, and API paths.
 */

/** Solana program ID — update after `anchor deploy` */
export const PROGRAM_ID = "7KjAvFx41EYsThCnMGkk5UFbze2aHjwXWxMHqm56bz8y";

/** PDA seed constants (must match Anchor program) */
export const SEEDS = {
  EXAM_STATE: "exam",
  ANSWER_RECORD: "answer",
} as const;

/** Maximum number of examiners per exam */
export const MAX_EXAMINERS = 10;

/** Solana cluster configuration */
export const SOLANA_CLUSTER = "devnet" as const;
export const SOLANA_RPC_URL = "https://api.devnet.solana.com";

/** API Gateway paths */
export const API_PATHS = {
  CREATE_EXAM: "/exam/create",
  FETCH_EXAM_KEY: "/exam/key",
  SUBMIT_ANSWERS: "/exam/submit",
  EVALUATE_EXAM: "/exam/evaluate",
  GET_RESULTS: "/exam/results",
} as const;

/** DynamoDB table name (from SAM template) */
export const DYNAMO_TABLE_NAME = "OpenXpExamTable";

/** S3 bucket for encrypted exam papers */
export const S3_BUCKET_PREFIX = "open-xp-exams";

/** Bedrock model ID for grading */
export const BEDROCK_MODEL_ID =
  "anthropic.claude-3-5-sonnet-20241022-v2:0" as const;
