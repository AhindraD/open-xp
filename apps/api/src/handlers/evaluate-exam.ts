import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { BEDROCK_MODEL_ID } from "@repo/shared";

const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const bedrockClient = new BedrockRuntimeClient({});

const TABLE_NAME = process.env["EXAM_TABLE_NAME"] ?? "OpenXpExamTable";

interface EvaluateExamEvent {
  examId: string;
  studentWallet: string;
}

interface BedrockResponse {
  content: Array<{ text: string }>;
}

/**
 * EvaluateExam Lambda Handler (Step Function Target)
 *
 * 1. Fetches student answers from DynamoDB
 * 2. Calls Amazon Bedrock (Claude 3.5 Sonnet) with a strict grading prompt
 * 3. Updates DynamoDB with the score and feedback
 */
export const handler = async (event: EvaluateExamEvent) => {
  const { examId, studentWallet } = event;

  try {
    // Fetch answers from DynamoDB
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

    const answers = getResult.Item["answers"] as Record<string, string>;

    if (getResult.Item["graded"]) {
      return {
        statusCode: 200,
        message: "Already graded",
        score: getResult.Item["score"],
      };
    }

    // Format answers for the grading prompt
    const formattedAnswers = Object.entries(answers)
      .map(([question, answer]) => `Question: ${question}\nAnswer: ${answer}`)
      .join("\n\n---\n\n");

    // Construct the grading prompt
    const gradingPrompt = `You are a strict, fair, and consistent exam grader for a university-level examination.

GRADING INSTRUCTIONS:
1. Evaluate each answer independently on correctness, completeness, and clarity.
2. Assign a score from 0 to 100 for the overall exam.
3. Provide brief feedback for each question.
4. Be consistent — identical answers must receive identical scores.
5. Do NOT consider writing style, only factual accuracy and completeness.

EXAM ANSWERS TO GRADE:

${formattedAnswers}

RESPONSE FORMAT (JSON only, no markdown):
{
  "score": <number 0-100>,
  "feedback": {
    "<question_id>": "<brief feedback>"
  }
}`;

    // Call Bedrock Claude 3.5 Sonnet
    const invokeCommand = new InvokeModelCommand({
      modelId: BEDROCK_MODEL_ID,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 4096,
        messages: [
          {
            role: "user",
            content: gradingPrompt,
          },
        ],
        temperature: 0.0, // Deterministic grading
      }),
    });

    const bedrockResponse = await bedrockClient.send(invokeCommand);
    const responseBody = JSON.parse(
      new TextDecoder().decode(bedrockResponse.body)
    ) as BedrockResponse;

    const gradingResult = JSON.parse(
      responseBody.content[0]?.text ?? "{}"
    ) as {
      score: number;
      feedback: Record<string, string>;
    };

    const now = Math.floor(Date.now() / 1000);

    // Update DynamoDB with grading results
    await docClient.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: {
          exam_id: examId,
          student_wallet: studentWallet,
        },
        UpdateExpression:
          "SET #score = :score, #feedback = :feedback, #graded = :graded, #gradedAt = :gradedAt, #gradedBy = :gradedBy",
        ExpressionAttributeNames: {
          "#score": "score",
          "#feedback": "feedback",
          "#graded": "graded",
          "#gradedAt": "graded_at",
          "#gradedBy": "graded_by",
        },
        ExpressionAttributeValues: {
          ":score": gradingResult.score,
          ":feedback": gradingResult.feedback,
          ":graded": true,
          ":gradedAt": now,
          ":gradedBy": BEDROCK_MODEL_ID,
        },
      })
    );

    return {
      statusCode: 200,
      examId,
      studentWallet,
      score: gradingResult.score,
      feedback: gradingResult.feedback,
      gradedAt: now,
    };
  } catch (error) {
    console.error("EvaluateExam error:", error);
    throw error; // Let Step Functions handle the retry
  }
};
