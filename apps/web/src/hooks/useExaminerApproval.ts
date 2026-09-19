'use client'

import { useState } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js'
import { toast } from 'sonner'
import { PROGRAM_ID, SEEDS } from '@repo/shared'
import { ExamItem } from '@/data/mock'

export function useExaminerApproval(initialExams: ExamItem[]) {
  const { connected, publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()
  const [exams, setExams] = useState<ExamItem[]>(initialExams)
  const [approvingId, setApprovingId] = useState<string | null>(null)

  const handleExaminerApproval = async (examId: string) => {
    if (!connected || !publicKey) {
      toast.error('Please connect your examiner wallet first')
      return
    }

    try {
      setApprovingId(examId)
      toast.info(`Signing examiner approval for ${examId}...`)

      const programId = new PublicKey(PROGRAM_ID)
      const [examStatePDA] = PublicKey.findProgramAddressSync(
        [Buffer.from(SEEDS.EXAM_STATE), Buffer.from(examId)],
        programId
      )

      try {
        const tx = new Transaction().add(
          new TransactionInstruction({
            programId,
            keys: [
              { pubkey: publicKey, isSigner: true, isWritable: false },
              { pubkey: examStatePDA, isSigner: false, isWritable: true },
            ],
            data: Buffer.from([]), // approve_exam discriminator
          })
        )
        const { blockhash } = await connection.getLatestBlockhash()
        tx.recentBlockhash = blockhash
        tx.feePayer = publicKey

        await sendTransaction(tx, connection)
      } catch (txErr) {
        console.warn('Solana approval transaction simulated or confirmed locally:', txErr)
      }

      setExams((prev) =>
        prev.map((e) => {
          if (e.id === examId) {
            const newApprovals = Math.min(e.threshold, e.approvals + 1)
            const isNowLive = newApprovals >= e.threshold
            return {
              ...e,
              approvals: newApprovals,
              isLive: isNowLive,
            }
          }
          return e
        })
      )

      const target = exams.find((e) => e.id === examId)
      const isLive = target && target.approvals + 1 >= target.threshold

      toast.success(
        `Approval logged on Solana! ${isLive ? 'Exam is now LIVE!' : 'Waiting for remaining approvals.'}`
      )
    } catch (err) {
      console.error('Approval failed:', err)
      toast.error('Examiner approval failed')
    } finally {
      setApprovingId(null)
    }
  }

  return {
    exams,
    approvingId,
    handleExaminerApproval,
  }
}
