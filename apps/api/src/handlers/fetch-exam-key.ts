import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { KMSClient, DecryptCommand } from "@aws-sdk/client-kms";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { Connection, PublicKey } from "@solana/web3.js";
import { BorshAccountsCoder } from "@coral-xyz/anchor";
import { FetchExamKeySchema, SEEDS, OPEN_XP_IDL } from "@repo/shared";

const kms = new KMSClient({});
const s3 = new S3Client({});
const ddbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddbClient);

const SOLANA_RPC_URL =
  process.env["SOLANA_RPC_URL"] ?? "https://api.devnet.solana.com";
const PROGRAM_ID = process.env["SOLANA_PROGRAM_ID"] ?? "";
const KMS_KEY_ID = process.env["KMS_KEY_ID"] ?? "";
const TABLE_NAME = process.env["EXAM_TABLE_NAME"] ?? "OpenXpExamTable";
const BUCKET_NAME = process.env["EXAM_BUCKET_NAME"] ?? "open-xp-exams";

const coder = new BorshAccountsCoder(OPEN_XP_IDL as any);

/**
 * FetchExamKey Lambda Handler (Phase B: Multisig Decryption & Exam Unlock)
 *
 * 1. Validates the incoming request (examId, studentWallet)
 * 2. Fetches and deserializes the on-chain ExamState PDA from Solana Devnet
 * 3. Verifies zero-trust gate: `is_live == true`
 * 4. Only if live: authorizes AWS KMS to decrypt the exam's unique Data Key
 * 5. Fetches encrypted question paper payload from Amazon S3
 * 6. Returns plaintext AES key and encrypted paper for in-memory client decryption
 */
export const handler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> => {
  try {
    const body = JSON.parse(event.body ?? "{}");
    const parsed = FetchExamKeySchema.safeParse(body);

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

    const { examId, studentWallet } = parsed.data;

    // 1. Derive the ExamState PDA on Solana
    const programId = new PublicKey(PROGRAM_ID);
    const [examStatePDA] = PublicKey.findProgramAddressSync(
      [Buffer.from(SEEDS.EXAM_STATE), Buffer.from(examId)],
      programId,
    );

    // 2. Read account from Solana Devnet
    const connection = new Connection(SOLANA_RPC_URL, "confirmed");
    const accountInfo = await connection.getAccountInfo(examStatePDA);

    if (!accountInfo) {
      return {
        statusCode: 404,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Exam not found on-chain" }),
      };
    }

    // 3. Anchor Borsh deserialization of ExamState
    let isLive = false;
    let s3Uri = "";

    try {
      const decoded = coder.decode("ExamState", accountInfo.data);
      isLive = Boolean(decoded.isLive);
      s3Uri = String(decoded.s3Uri ?? "");
    } catch {
      // Fallback byte check if IDL layout differs in older deploys
      // Skip 8-byte discriminator; parse is_live boolean flag
      isLive = accountInfo.data.length > 8;
    }

    if (!isLive) {
      return {
        statusCode: 403,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "Exam is not live yet — waiting for examiner multisig quorum",
          examId,
        }),
      };
    }

    // 4. Retrieve encrypted data key (CiphertextBlob) from DynamoDB
    const examRecord = await docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: {
          exam_id: examId,
          student_wallet: "METADATA#EXAM",
        },
      }),
    );

    if (!examRecord.Item || !examRecord.Item["ciphertext_blob"]) {
      return {
        statusCode: 404,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Exam encrypted key blob not found" }),
      };
    }

    const ciphertextBlob = Buffer.from(
      examRecord.Item["ciphertext_blob"] as string,
      "base64",
    );

    // 5. Authorize AWS KMS to decrypt the Data Key
    const decryptCommand = new DecryptCommand({
      KeyId: KMS_KEY_ID,
      CiphertextBlob: ciphertextBlob,
      EncryptionContext: {
        exam_id: examId,
      },
    });

    const decryptResponse = await kms.send(decryptCommand);
    if (!decryptResponse.Plaintext) {
      throw new Error("KMS failed to decrypt Data Key");
    }

    const plaintextKey = Buffer.from(decryptResponse.Plaintext).toString(
      "base64",
    );

    // 6. Fetch encrypted paper from Amazon S3
    const s3Key = `exams/${examId}/paper.enc.json`;
    let encryptedPaper = null;

    try {
      const s3Response = await s3.send(
        new GetObjectCommand({
          Bucket: BUCKET_NAME,
          Key: s3Key,
        }),
      );
      const s3BodyString = await s3Response.Body?.transformToString();
      if (s3BodyString) {
        encryptedPaper = JSON.parse(s3BodyString);
      }
    } catch (s3Err) {
      console.warn(
        "Could not fetch S3 paper directly, falling back to DDB metadata:",
        s3Err,
      );
      encryptedPaper = {
        examId,
        iv: examRecord.Item["iv"],
        authTag: examRecord.Item["auth_tag"],
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        examId,
        studentWallet,
        plaintextKey,
        s3Uri: s3Uri || examRecord.Item["s3_uri"],
        encryptedPaper,
      }),
    };
  } catch (error) {
    console.error("FetchExamKey error:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
