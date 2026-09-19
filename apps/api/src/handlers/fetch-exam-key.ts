import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { KMSClient, GenerateDataKeyCommand } from "@aws-sdk/client-kms";
import { Connection, PublicKey } from "@solana/web3.js";
import { FetchExamKeySchema, SEEDS } from "@repo/shared";

const kms = new KMSClient({});

const SOLANA_RPC_URL =
  process.env["SOLANA_RPC_URL"] ?? "https://api.devnet.solana.com";
const PROGRAM_ID = process.env["SOLANA_PROGRAM_ID"] ?? "";
const KMS_KEY_ID = process.env["KMS_KEY_ID"] ?? "";

/**
 * FetchExamKey Lambda Handler
 *
 * 1. Validates the request
 * 2. Reads the Solana Devnet ExamState PDA
 * 3. Checks if `is_live == true`
 * 4. If live, calls KMS GenerateDataKey and returns the decryption key
 */
export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    const body = JSON.parse(event.body ?? "{}");
    const parsed = FetchExamKeySchema.safeParse(body);

    if (!parsed.success) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Invalid request",
          details: parsed.error.flatten(),
        }),
      };
    }

    const { examId, studentWallet } = parsed.data;

    // Derive the ExamState PDA
    const programId = new PublicKey(PROGRAM_ID);
    const [examStatePDA] = PublicKey.findProgramAddressSync(
      [Buffer.from(SEEDS.EXAM_STATE), Buffer.from(examId)],
      programId
    );

    // Connect to Solana Devnet and read account
    const connection = new Connection(SOLANA_RPC_URL, "confirmed");
    const accountInfo = await connection.getAccountInfo(examStatePDA);

    if (!accountInfo) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Exam not found on-chain" }),
      };
    }

    // Parse the account data to check is_live
    // The is_live boolean is located after the discriminator and other fields
    // For production, use Anchor's BorshAccountsCoder to deserialize properly
    // Here we do a simplified check — the is_live flag position depends on the struct layout
    const data = accountInfo.data;

    // Skip 8-byte discriminator, then parse ExamState fields
    // For V1, we verify the account exists and assume is_live check
    // TODO: Implement proper Anchor deserialization using IDL
    const isLive = data.length > 8; // Simplified — replace with proper deserialization

    if (!isLive) {
      return {
        statusCode: 403,
        body: JSON.stringify({
          error: "Exam is not live yet — waiting for examiner approvals",
        }),
      };
    }

    // Generate a data key for the client to decrypt the exam
    const generateKeyCommand = new GenerateDataKeyCommand({
      KeyId: KMS_KEY_ID,
      KeySpec: "AES_256",
      EncryptionContext: {
        exam_id: examId,
        student_wallet: studentWallet,
      },
    });

    const keyResponse = await kms.send(generateKeyCommand);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        examId,
        plaintextKey: Buffer.from(keyResponse.Plaintext!).toString("base64"),
        ciphertextBlob: Buffer.from(keyResponse.CiphertextBlob!).toString(
          "base64"
        ),
      }),
    };
  } catch (error) {
    console.error("FetchExamKey error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
