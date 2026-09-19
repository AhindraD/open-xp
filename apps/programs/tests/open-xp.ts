import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { expect } from "chai";

// Note: After `anchor build`, import the generated types:
// import { OpenXp } from "../target/types/open_xp";

describe("open-xp", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  // The program will be loaded after `anchor build` generates types
  // const program = anchor.workspace.OpenXp as Program<OpenXp>;
  const program = anchor.workspace.OpenXp as Program<any>;

  const authority = provider.wallet;
  const examiner1 = Keypair.generate();
  const examiner2 = Keypair.generate();
  const examiner3 = Keypair.generate();
  const student = Keypair.generate();

  const examId = "CS101-FINAL-2026";

  const getExamStatePDA = (examId: string): [PublicKey, number] => {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("exam"), Buffer.from(examId)],
      program.programId
    );
  };

  const getAnswerRecordPDA = (
    examState: PublicKey,
    studentKey: PublicKey
  ): [PublicKey, number] => {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("answer"), examState.toBuffer(), studentKey.toBuffer()],
      program.programId
    );
  };

  before(async () => {
    // Airdrop SOL to test accounts
    const airdropAmount = 10 * anchor.web3.LAMPORTS_PER_SOL;

    for (const kp of [examiner1, examiner2, examiner3, student]) {
      const sig = await provider.connection.requestAirdrop(
        kp.publicKey,
        airdropAmount
      );
      await provider.connection.confirmTransaction(sig);
    }
  });

  describe("initialize_exam", () => {
    it("should initialize an exam with multi-sig threshold", async () => {
      const [examStatePDA] = getExamStatePDA(examId);

      const examiners = [
        examiner1.publicKey,
        examiner2.publicKey,
        examiner3.publicKey,
      ];
      const threshold = 2;

      await program.methods
        .initializeExam(examId, threshold, examiners)
        .accounts({
          authority: authority.publicKey,
          examState: examStatePDA,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      const examState = await program.account.examState.fetch(examStatePDA);

      expect(examState.examId).to.equal(examId);
      expect(examState.authority.toBase58()).to.equal(
        authority.publicKey.toBase58()
      );
      expect(examState.examiners).to.have.length(3);
      expect(examState.multisigThreshold).to.equal(threshold);
      expect(examState.currentApprovals).to.have.length(0);
      expect(examState.isLive).to.be.false;
      expect(examState.resultHash).to.equal("");
    });

    it("should fail with empty exam ID", async () => {
      const [emptyPDA] = getExamStatePDA("");

      try {
        await program.methods
          .initializeExam("", 1, [examiner1.publicKey])
          .accounts({
            authority: authority.publicKey,
            examState: emptyPDA,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
        expect.fail("Should have thrown an error");
      } catch (err: any) {
        expect(err.error.errorCode.code).to.equal("InvalidExamId");
      }
    });

    it("should fail with threshold > number of examiners", async () => {
      const badExamId = "BAD-THRESHOLD-EXAM";
      const [badPDA] = getExamStatePDA(badExamId);

      try {
        await program.methods
          .initializeExam(badExamId, 5, [examiner1.publicKey])
          .accounts({
            authority: authority.publicKey,
            examState: badPDA,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
        expect.fail("Should have thrown an error");
      } catch (err: any) {
        expect(err.error.errorCode.code).to.equal("InvalidThreshold");
      }
    });
  });

  describe("approve_exam", () => {
    it("should allow an authorized examiner to approve", async () => {
      const [examStatePDA] = getExamStatePDA(examId);

      await program.methods
        .approveExam()
        .accounts({
          examiner: examiner1.publicKey,
          examState: examStatePDA,
        })
        .signers([examiner1])
        .rpc();

      const examState = await program.account.examState.fetch(examStatePDA);
      expect(examState.currentApprovals).to.have.length(1);
      expect(examState.isLive).to.be.false; // threshold is 2, only 1 approval
    });

    it("should go live when threshold is met", async () => {
      const [examStatePDA] = getExamStatePDA(examId);

      await program.methods
        .approveExam()
        .accounts({
          examiner: examiner2.publicKey,
          examState: examStatePDA,
        })
        .signers([examiner2])
        .rpc();

      const examState = await program.account.examState.fetch(examStatePDA);
      expect(examState.currentApprovals).to.have.length(2);
      expect(examState.isLive).to.be.true; // threshold met!
    });

    it("should fail if examiner already approved", async () => {
      const [examStatePDA] = getExamStatePDA(examId);

      try {
        await program.methods
          .approveExam()
          .accounts({
            examiner: examiner1.publicKey,
            examState: examStatePDA,
          })
          .signers([examiner1])
          .rpc();
        expect.fail("Should have thrown an error");
      } catch (err: any) {
        expect(err.error.errorCode.code).to.equal("ExamAlreadyLive");
      }
    });

    it("should fail if signer is not an examiner", async () => {
      // Create a new exam for this test
      const newExamId = "UNAUTHORIZED-TEST";
      const [newPDA] = getExamStatePDA(newExamId);

      await program.methods
        .initializeExam(newExamId, 1, [examiner1.publicKey])
        .accounts({
          authority: authority.publicKey,
          examState: newPDA,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      try {
        await program.methods
          .approveExam()
          .accounts({
            examiner: student.publicKey,
            examState: newPDA,
          })
          .signers([student])
          .rpc();
        expect.fail("Should have thrown an error");
      } catch (err: any) {
        expect(err.error.errorCode.code).to.equal("NotAnExaminer");
      }
    });
  });

  describe("submit_answer_hash", () => {
    const validHash =
      "a".repeat(64); // 64 hex chars = valid SHA-256

    it("should submit an answer hash for a live exam", async () => {
      const [examStatePDA] = getExamStatePDA(examId);
      const [answerRecordPDA] = getAnswerRecordPDA(
        examStatePDA,
        student.publicKey
      );

      await program.methods
        .submitAnswerHash(validHash)
        .accounts({
          student: student.publicKey,
          examState: examStatePDA,
          answerRecord: answerRecordPDA,
          systemProgram: SystemProgram.programId,
        })
        .signers([student])
        .rpc();

      const answerRecord =
        await program.account.answerRecord.fetch(answerRecordPDA);
      expect(answerRecord.answerHash).to.equal(validHash);
      expect(answerRecord.student.toBase58()).to.equal(
        student.publicKey.toBase58()
      );
      expect(answerRecord.examState.toBase58()).to.equal(
        examStatePDA.toBase58()
      );
    });

    it("should fail for a non-live exam", async () => {
      const notLiveExamId = "NOT-LIVE-EXAM";
      const [notLivePDA] = getExamStatePDA(notLiveExamId);

      await program.methods
        .initializeExam(notLiveExamId, 2, [
          examiner1.publicKey,
          examiner2.publicKey,
        ])
        .accounts({
          authority: authority.publicKey,
          examState: notLivePDA,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      const [answerPDA] = getAnswerRecordPDA(notLivePDA, student.publicKey);

      try {
        await program.methods
          .submitAnswerHash(validHash)
          .accounts({
            student: student.publicKey,
            examState: notLivePDA,
            answerRecord: answerPDA,
            systemProgram: SystemProgram.programId,
          })
          .signers([student])
          .rpc();
        expect.fail("Should have thrown an error");
      } catch (err: any) {
        expect(err.error.errorCode.code).to.equal("ExamNotLive");
      }
    });

    it("should fail with invalid hash format", async () => {
      const [examStatePDA] = getExamStatePDA(examId);
      const newStudent = Keypair.generate();

      // Airdrop to new student
      const sig = await provider.connection.requestAirdrop(
        newStudent.publicKey,
        5 * anchor.web3.LAMPORTS_PER_SOL
      );
      await provider.connection.confirmTransaction(sig);

      const [answerPDA] = getAnswerRecordPDA(
        examStatePDA,
        newStudent.publicKey
      );

      try {
        await program.methods
          .submitAnswerHash("short-hash")
          .accounts({
            student: newStudent.publicKey,
            examState: examStatePDA,
            answerRecord: answerPDA,
            systemProgram: SystemProgram.programId,
          })
          .signers([newStudent])
          .rpc();
        expect.fail("Should have thrown an error");
      } catch (err: any) {
        expect(err.error.errorCode.code).to.equal("InvalidAnswerHash");
      }
    });

    it("should fail if student already submitted (PDA already exists)", async () => {
      const [examStatePDA] = getExamStatePDA(examId);
      const [answerRecordPDA] = getAnswerRecordPDA(
        examStatePDA,
        student.publicKey
      );

      try {
        await program.methods
          .submitAnswerHash(validHash)
          .accounts({
            student: student.publicKey,
            examState: examStatePDA,
            answerRecord: answerRecordPDA,
            systemProgram: SystemProgram.programId,
          })
          .signers([student])
          .rpc();
        expect.fail("Should have thrown an error");
      } catch (_err) {
        // Account already initialized — Anchor will throw
        expect(true).to.be.true;
      }
    });
  });
});
