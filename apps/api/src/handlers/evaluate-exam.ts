import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import {
  BedrockRuntimeClient,
  ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { createHash } from "crypto";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider, Wallet } from "@coral-xyz/anchor";
import { BEDROCK_MODEL_ID, OPEN_XP_IDL, SEEDS } from "@repo/shared";

const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const bedrockClient = new BedrockRuntimeClient({});

const TABLE_NAME = process.env["EXAM_TABLE_NAME"] ?? "OpenXpExamTable";
const SOLANA_RPC_URL =
  process.env["SOLANA_RPC_URL"] ?? "https://api.devnet.solana.com";
const PROGRAM_ID = process.env["SOLANA_PROGRAM_ID"] ?? "";
const EVALUATOR_SECRET_KEY = process.env["EVALUATOR_SECRET_KEY"] ?? "";

interface EvaluateExamEvent {
  examId: string;
  studentWallet: string;
}

interface EvaluationOutput {
  score: number;
  rubric_match: Record<string, string>;
  justification: string;
}

/**
 * EvaluateExam Lambda Handler (Phase D: AI Grading Pipeline)
 *
 * 1. Fetches student answers from DynamoDB
 * 2. Invokes Amazon Bedrock (Claude 3.5 Sonnet) via Converse API with strict toolSpec schema
 * 3. Extracts structured evaluation: { score, rubric_match, justification }
 * 4. Computes deterministic SHA-256 EvaluationHash
 * 5. Updates DynamoDB with grading results and EvaluationHash
 * 6. Anchors EvaluationHash and score to Solana AnswerRecord via record_evaluation
 */
export const handler = async (event: EvaluateExamEvent) => {
  const { examId, studentWallet } = event;

  try {
    // 1. Fetch student answers from DynamoDB
    const getResult = await docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: {
          exam_id: examId,
          student_wallet: studentWallet,
        },
      })
    );

    if (!getResult.Item) {
      throw new Error(
        `No answers found for exam ${examId}, student ${studentWallet}`
      );
    }

    if (getResult.Item["graded"]) {
      return {
        statusCode: 200,
        message: "Already graded",
        score: getResult.Item["score"],
        evaluationHash: getResult.Item["evaluation_hash"],
        justification: getResult.Item["justification"],
      };
    }

    const answers = getResult.Item["answers"] as Record<string, string>;

    // 2. Format answers for grading prompt
    const formattedAnswers = Object.entries(answers)
      .map(([question, answer]) => `Question ID: ${question}\nStudent Answer: ${answer}`)
      .join("\n\n---\n\n");

    const promptText = `You are an expert university examiner grading a subjective examination.
Evaluate the following student answers with academic rigor, fairness, and consistency.

STUDENT SUBMISSION:
${formattedAnswers}

GRADING CRITERIA:
- Accuracy & correctness of core concepts
- Completeness of explanations
- Clarity and logical reasoning
- Deduct points for factual errors or omitted core principles

Use the submit_evaluation tool to record the final score (0-100), rubric matches per question, and overall academic justification.`;

    // 3. Call Amazon Bedrock Claude 3.5 Sonnet via Converse API with strict toolSpec
    const converseCommand = new ConverseCommand({
      modelId: BEDROCK_MODEL_ID,
      messages: [
        {
          role: "user",
          content: [{ text: promptText }],
        },
      ],
      toolConfig: {
        tools: [
          {
            toolSpec: {
              name: "submit_evaluation",
              description:
                "Submit guaranteed structured exam evaluation matching Track B strict schema",
              inputSchema: {
                json: {
                  type: "object",
                  properties: {
                    score: {
                      type: "number",
                      description: "Final numeric score between 0 and 100",
                    },
                    rubric_match: {
                      type: "object",
                      description:
                        "Criteria match evaluation for each question ID",
                      additionalProperties: { type: "string" },
                    },
                    justification: {
                      type: "string",
                      description:
                        "Detailed academic justification for the evaluation",
                    },
                  },
                  required: ["score", "rubric_match", "justification"],
                },
              },
            },
          },
        ],
        toolChoice: {
          tool: {
            name: "submit_evaluation",
          },
        },
      },
      inferenceConfig: {
        temperature: 0.0, // Strict deterministic output
        maxTokens: 2048,
      },
    });

    const bedrockResponse = await bedrockClient.send(converseCommand);

    // Extract tool use content
    const contentBlocks = bedrockResponse.output?.message?.content ?? [];
    const toolUseBlock = contentBlocks.find((b) => b.toolUse !== undefined);

    let evaluation: EvaluationOutput;
    if (toolUseBlock?.toolUse?.input) {
      evaluation = toolUseBlock.toolUse.input as unknown as EvaluationOutput;
    } else {
      // Fallback parser if plain text returned
      const textContent = contentBlocks.find((b) => b.text)?.text ?? "{}";
      evaluation = JSON.parse(textContent) as EvaluationOutput;
    }

    const score = Math.min(100, Math.max(0, Math.round(evaluation.score)));
    const rubricMatch = evaluation.rubric_match ?? {};
    const justification = evaluation.justification ?? "Graded by Amazon Bedrock Claude 3.5 Sonnet";

    // 4. Compute deterministic SHA-256 EvaluationHash
    const deterministicEvaluation = {
      examId,
      studentWallet,
      score,
      rubric_match: rubricMatch,
      justification,
    };
    const serialized = JSON.stringify(
      deterministicEvaluation,
      Object.keys(deterministicEvaluation).sort()
    );
    const evaluationHash = createHash("sha256").update(serialized).digest("hex");
    const now = Math.floor(Date.now() / 1000);

    // 5. Update DynamoDB with evaluation results
    await docClient.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: {
          exam_id: examId,
          student_wallet: studentWallet,
        },
        UpdateExpression:
          "SET #score = :score, #rubric = :rubric, #justification = :justification, #evalHash = :evalHash, #graded = :graded, #gradedAt = :gradedAt, #gradedBy = :gradedBy",
        ExpressionAttributeNames: {
          "#score": "score",
          "#rubric": "rubric_match",
          "#justification": "justification",
          "#evalHash": "evaluation_hash",
          "#graded": "graded",
          "#gradedAt": "graded_at",
          "#gradedBy": "graded_by",
        },
        ExpressionAttributeValues: {
          ":score": score,
          ":rubric": rubricMatch,
          ":justification": justification,
          ":evalHash": evaluationHash,
          ":graded": true,
          ":gradedAt": now,
          ":gradedBy": BEDROCK_MODEL_ID,
        },
      })
    );

    // 6. Anchor EvaluationHash to Solana if backend evaluator keypair is configured
    let onChainAnchored = false;
    let txSignature: string | undefined;

    if (EVALUATOR_SECRET_KEY) {
      try {
        const secretKeyBytes = Buffer.from(EVALUATOR_SECRET_KEY, "base64");
        const evaluatorKeypair = Keypair.fromSecretKey(secretKeyBytes);
        const connection = new Connection(SOLANA_RPC_URL, "confirmed");
        const wallet = new Wallet(evaluatorKeypair);
        const provider = new AnchorProvider(connection, wallet, {
          commitment: "confirmed",
        });
        const program = new Program(OPEN_XP_IDL as any, provider);

        const programId = new PublicKey(PROGRAM_ID);
        const [examStatePDA] = PublicKey.findProgramAddressSync(
          [Buffer.from(SEEDS.EXAM_STATE), Buffer.from(examId)],
          programId
        );
        const studentPubkey = new PublicKey(studentWallet);
        const [answerRecordPDA] = PublicKey.findProgramAddressSync(
          [
            Buffer.from(SEEDS.ANSWER_RECORD),
            examStatePDA.toBuffer(),
            studentPubkey.toBuffer(),
          ],
          programId
        );

        txSignature = await (program.methods as any)
          .recordEvaluation(evaluationHash, score)
          .accounts({
            authority: evaluatorKeypair.publicKey,
            examState: examStatePDA,
            answerRecord: answerRecordPDA,
          })
          .signers([evaluatorKeypair])
          .rpc();

        onChainAnchored = true;
      } catch (solanaErr) {
        console.warn("Could not anchor evaluation on Solana directly:", solanaErr);
      }
    }

    return {
      statusCode: 200,
      examId,
      studentWallet,
      score,
      rubricMatch,
      justification,
      evaluationHash,
      gradedAt: now,
      onChainAnchored,
      txSignature,
    };
  } catch (error) {
    console.error("EvaluateExam error:", error);
    throw error;
  }
};
