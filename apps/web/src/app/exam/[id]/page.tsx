'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useWallet } from '@solana/wallet-adapter-react'
import { Navbar } from '@/components/layout/Navbar'
import { BackgroundGradients } from '@/components/layout/BackgroundGradients'
import { WalletGuard } from '@/components/common/WalletGuard'
import { ExamHeader } from '@/components/exam/ExamHeader'
import { ExamStepIndicator } from '@/components/exam/ExamStepIndicator'
import { ExamLockedState } from '@/components/exam/ExamLockedState'
import { ExamQuestionsForm } from '@/components/exam/ExamQuestionsForm'
import { ExamSubmissionReceipt } from '@/components/exam/ExamSubmissionReceipt'
import { ExamAIEvaluation } from '@/components/exam/ExamAIEvaluation'
import { Footer } from '@/components/layout/Footer'
import { useExamTaking } from '@/hooks/useExamTaking'
import { useExamEvaluation } from '@/hooks/useExamEvaluation'

export default function ExamPage() {
  const params = useParams()
  const examId = (params?.id as string) ?? 'CS101-FINAL-2026'
  const { connected, publicKey } = useWallet()
  const isWalletConnected = Boolean(connected || !!publicKey)

  const {
    step,
    isDecrypting,
    questions,
    answers,
    answerHash,
    txSignature,
    handleDecryptPaper,
    handleAnswerChange,
    handleSubmit,
  } = useExamTaking(examId)

  const { evaluation, isEvaluating, handleTriggerEvaluation } = useExamEvaluation(examId)

  return (
    <main className="min-h-screen flex flex-col justify-between">
      <BackgroundGradients />
      <Navbar showBackToDashboard maxWidth="max-w-5xl" />

      <div className="mx-auto max-w-5xl px-6 py-10 w-full flex-1">
        <ExamHeader examId={examId} />

        {!isWalletConnected ? (
          <WalletGuard
            title="Student Wallet Required"
            description="Connect your Solana wallet to decrypt questions in-memory and sign your cryptographic submission receipt."
          />
        ) : (
          <>
            <ExamStepIndicator currentStep={step} />

            {step === 'locked' ? (
              <ExamLockedState
                isDecrypting={isDecrypting}
                onDecrypt={handleDecryptPaper}
              />
            ) : step === 'complete' ? (
              <div className="space-y-8">
                <ExamSubmissionReceipt
                  answerHash={answerHash}
                  txSignature={txSignature}
                />
                <ExamAIEvaluation
                  evaluation={evaluation}
                  isEvaluating={isEvaluating}
                  onTriggerEvaluation={handleTriggerEvaluation}
                />
                <div className="flex justify-center pt-4 pb-8">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 rounded-xl bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground hover:bg-secondary/80 transition-all"
                  >
                    Return to Dashboard
                  </Link>
                </div>
              </div>
            ) : (
              <ExamQuestionsForm
                questions={questions}
                answers={answers}
                step={step}
                onAnswerChange={handleAnswerChange}
                onSubmit={handleSubmit}
              />
            )}
          </>
        )}
      </div>

      <Footer />
    </main>
  )
}
