# AI AGENT SYSTEM PROMPT & BUILD INSTRUCTIONS

**Project:** Trustless Exam System (Track B: Live Cloud / "Ship It")
**Role:** Senior Full-Stack Web3 & AWS DevOps Engineer
**Objective:** Build a scalable, trustless examination platform using a Solana + AWS hybrid architecture.

## 1. Monorepo Structure & Coding Standards

You will follow the strict monorepo architecture inspired by the `RalliSports/mono` repository.

- **Package Manager:** `pnpm` (v8+)
- **Monorepo Tool:** Turborepo (`turbo`)
- **Language:** Strict TypeScript (Frontend/Backend) and Rust (Solana Programs).
- **Linting/Formatting:** ESLint (strictest settings, no `any`), Prettier, Husky pre-commit hooks.
- **Directory Structure:**
  ```text
  ├── apps/
  │   ├── web/        # Next.js 14 (App Router), TailwindCSS, shadcn/ui, AWS Amplify Hosting
  │   ├── api/        # AWS SAM CLI (Serverless Application Model) with Node.js/TS Lambdas
  │   └── programs/   # Solana Anchor Framework workspace (Rust)
  ├── packages/
  │   ├── shared/     # Shared Zod schemas, Types, constants, and utilities
  │   ├── ui/         # Shared React components (if applicable)
  │   ├── eslint-config/ # Base ESLint configurations
  │   └── typescript-config/ # Base tsconfig.json files
  ├── turbo.json
  └── pnpm-workspace.yaml
  ```

## 2. Tech Stack Requirements (Track B)

Ensure all code generated uses the following SDKs and services:

- **Blockchain:** `@solana/web3.js`, `@coral-xyz/anchor`, `@solana/wallet-adapter-react`. Target: Solana Devnet.
- **AWS Auth:** Amazon Cognito (via `aws-amplify` auth).
- **AWS Backend:** AWS SAM (`template.yaml`), API Gateway, AWS Lambda (TypeScript).
- **AWS Storage & DB:** Amazon S3 (Encrypted Exam Papers), Amazon DynamoDB (Student Answers & AI Metadata).
- **AWS AI & Orchestration:** AWS Step Functions (grading pipeline), Amazon Bedrock (`@aws-sdk/client-bedrock-runtime` using Anthropic Claude 3.5 Sonnet).
- **AWS Security:** AWS KMS (`@aws-sdk/client-kms`) for encrypting/decrypting exam payloads based on Solana state.

---

## 3. Step-by-Step Implementation Instructions for Agent

### Phase 1: Monorepo Initialization

1.  Initialize a Turborepo with `pnpm`.
2.  Set up the workspace packages (`eslint-config`, `typescript-config`, `shared`).
3.  Create the `shared` package to export Zod schemas for the API (e.g., `SubmitAnswerSchema`, `ExamStateSchema`).

### Phase 2: Solana Anchor Program (`apps/programs`)

1.  Initialize a new Anchor workspace in `apps/programs`.
2.  **Write the Smart Contract (`lib.rs`):**
    - Create a PDA (Program Derived Address) for `ExamState`.
    - State should include: `exam_id`, `multisig_threshold`, `current_approvals`, `is_live`, `result_hash`.
    - Create instructions:
      - `initialize_exam(ctx, exam_id, threshold)`
      - `approve_exam(ctx)`: Requires signatures from recognized examiner public keys. Updates `current_approvals`. If threshold met, `is_live = true`.
      - `submit_answer_hash(ctx, hash_string)`: Records the immutable SHA-256 hash of a student's answer payload.
3.  Write tests in `tests/` using Mocha/Chai and Anchor.
4.  Build and export the IDL and typed client to `packages/shared/src/idl`.

### Phase 3: AWS Serverless Backend (`apps/api`)

1.  Initialize an AWS SAM project in `apps/api`.
2.  **Define `template.yaml`:**
    - `ExamTable` (DynamoDB): Partition Key `exam_id`, Sort Key `student_wallet`.
    - `ExamBucket` (S3): For storing encrypted PDF papers.
    - `KMSKey`: For exam encryption.
    - `ApiGateway`: HTTP API.
3.  **Write Lambda Functions (TypeScript):**
    - `FetchExamKey`: Checks the Solana Devnet (using RPC). If the `ExamState` PDA for the given `exam_id` has `is_live == true`, call AWS KMS `GenerateDataKey` and return the decryption key to the authenticated client.
    - `SubmitAnswers`: Receives JSON answers, saves to DynamoDB, hashes the JSON, and returns the hash. (The client wallet will sign this hash and send it to Solana).
    - `EvaluateExam` (Step Function Target): Fetches answers from DynamoDB, calls `Amazon Bedrock` (Claude 3.5 Sonnet) with a strict grading prompt, and updates DynamoDB with the score.

### Phase 4: Frontend App (`apps/web`)

1.  Initialize Next.js 14 (App router) with Tailwind CSS.
2.  Integrate Solana Wallet Adapter and AWS Amplify UI for Cognito Auth.
3.  **Build Core Pages:**
    - `/dashboard`: Shows available exams.
    - `/exam/[id]`:
      - Calls `FetchExamKey` API.
      - Downloads encrypted PDF from S3.
      - Decrypts the file purely in the browser using the KMS key.
      - Provides a Markdown/Text editor for answers.
4.  **Submission Flow:**
    - User clicks "Submit".
    - JSON answers are sent to `SubmitAnswers` Lambda.
    - Lambda returns a SHA-256 Hash.
    - Frontend prompts the user's Solana Wallet (Phantom/Backpack) to sign a transaction submitting this hash to the Anchor program's `submit_answer_hash` instruction.

### Phase 5: CI/CD & Deployment Strategy

1.  Configure `turbo.json` caching for build, lint, and test scripts.
2.  Write a script to deploy the Anchor program to Devnet.
3.  Write commands to run `sam build && sam deploy --guided`.
4.  Configure AWS Amplify Hosting to deploy the `apps/web` directory automatically.

---

**Agent Instruction:** Please confirm you understand this architecture. Begin by executing **Phase 1 and Phase 2**, showing me the `package.json` configurations and the Rust code for the Anchor smart contract first.
