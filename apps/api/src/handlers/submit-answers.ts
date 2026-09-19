import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { createHash } from "crypto";
import { SubmitAnswerSchema } from "@repo/shared";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env["EXAM_TABLE_NAME"] ?? "OpenXpExamTable";

/**
 * SubmitAnswers Lambda Handler
 *
 * 1. Validates the incoming answer payload via Zod schema
 * 2. Computes a SHA-256 hash of the JSON answers
 * 3. Saves the answers and metadata to DynamoDB
 * 4. Returns the hash for the client to submit on-chain
 */
export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    const body = JSON.parse(event.body ?? "{}");
    const parsed = SubmitAnswerSchema.safeParse(body);

    if (!parsed.success) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Invalid request",
          details: parsed.error.flatten(),
        }),
      };
    }

    const { examId, studentWallet, answers, attachments } = parsed.data;
    const now = Math.floor(Date.now() / 1000);

    // Compute SHA-256 hash of the answers JSON
    // The hash is deterministic: sorted keys ensure consistency
    const sortedAnswers = JSON.stringify(answers, Object.keys(answers).sort());
    const answerHash = createHash("sha256")
      .update(sortedAnswers)
      .digest("hex");

    // Save to DynamoDB
    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          exam_id: examId,
          student_wallet: studentWallet,
          answers,
          attachments: attachments ?? [],
          answer_hash: answerHash,
          submitted_at: now,
          graded: false,
        },
        // Prevent duplicate submissions
        ConditionExpression:
          "attribute_not_exists(exam_id) AND attribute_not_exists(student_wallet)",
      })
    );

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        examId,
        studentWallet,
        answerHash,
        submittedAt: now,
      }),
    };
  } catch (error: unknown) {
    console.error("SubmitAnswers error:", error);

    // Handle duplicate submission
    if (
      error instanceof Error &&
      error.name === "ConditionalCheckFailedException"
    ) {
      return {
        statusCode: 409,
        body: JSON.stringify({
          error: "Answers already submitted for this exam",
        }),
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
