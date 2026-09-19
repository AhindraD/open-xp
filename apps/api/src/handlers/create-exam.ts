import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { KMSClient, GenerateDataKeyCommand } from "@aws-sdk/client-kms";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { createCipheriv, randomBytes } from "crypto";
import { CreateExamSchema } from "@repo/shared";

const kms = new KMSClient({});
const s3 = new S3Client({});
const ddbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddbClient);

const TABLE_NAME = process.env["EXAM_TABLE_NAME"] ?? "OpenXpExamTable";
const BUCKET_NAME = process.env["EXAM_BUCKET_NAME"] ?? "open-xp-exams";
const KMS_KEY_ID = process.env["KMS_KEY_ID"] ?? "";

/**
 * CreateExam Lambda Handler (Phase A: Pre-Exam)
 *
 * 1. Validates exam payload & question paper from Exam Admin
 * 2. Generates unique AES-256 data key via AWS KMS
 * 3. Encrypts question paper in-memory with AES-256-GCM
 * 4. Saves encrypted paper to Amazon S3
 * 5. Saves metadata & encrypted data key blob to DynamoDB
 * 6. Returns S3 URI and metadata for on-chain anchoring via Anchor initialize_exam
 */
export const handler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> => {
  try {
    const body = JSON.parse(event.body ?? "{}");
    const parsed = CreateExamSchema.safeParse(body);

    if (!parsed.success) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "Invalid request",
          details: parsed.error.flatten(),
        }),
      };
    }

    const { examId, title, description, threshold, examiners, paperContent } =
      parsed.data;
    const now = Math.floor(Date.now() / 1000);

    // 1. Generate unique AES-256 data key from KMS
    const generateKeyCommand = new GenerateDataKeyCommand({
      KeyId: KMS_KEY_ID,
      KeySpec: "AES_256",
      EncryptionContext: {
        exam_id: examId,
      },
    });

    const keyResponse = await kms.send(generateKeyCommand);
    if (!keyResponse.Plaintext || !keyResponse.CiphertextBlob) {
      throw new Error("Failed to generate KMS Data Key");
    }

    const plaintextKey = Buffer.from(keyResponse.Plaintext);
    const ciphertextBlob = Buffer.from(keyResponse.CiphertextBlob).toString(
      "base64",
    );

    // 2. Encrypt paper content in-memory using AES-256-GCM
    const iv = randomBytes(12); // 96-bit IV recommended for GCM
    const cipher = createCipheriv("aes-256-gcm", plaintextKey, iv);
    const encryptedData = Buffer.concat([
      cipher.update(paperContent, "utf8"),
      cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();

    const encryptedPayload = {
      examId,
      iv: iv.toString("base64"),
      authTag: authTag.toString("base64"),
      ciphertext: encryptedData.toString("base64"),
      createdAt: now,
    };

    // 3. Save encrypted paper to Amazon S3
    const s3Key = `exams/${examId}/paper.enc.json`;
    const s3Uri = `s3://${BUCKET_NAME}/${s3Key}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: s3Key,
        Body: JSON.stringify(encryptedPayload),
        ContentType: "application/json",
      }),
    );

    // 4. Save metadata and KMS ciphertext blob to DynamoDB
    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          exam_id: examId,
          student_wallet: "METADATA#EXAM",
          title,
          description,
          multisig_threshold: threshold,
          examiners,
          s3_uri: s3Uri,
          ciphertext_blob: ciphertextBlob,
          iv: iv.toString("base64"),
          auth_tag: authTag.toString("base64"),
          created_at: now,
          is_live: false,
        },
      }),
    );

    return {
      statusCode: 201,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        examId,
        s3Uri,
        ciphertextBlob,
        iv: iv.toString("base64"),
        authTag: authTag.toString("base64"),
        createdAt: now,
      }),
    };
  } catch (error) {
    console.error("CreateExam error:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
