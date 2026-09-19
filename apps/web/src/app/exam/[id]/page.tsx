'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  Shield,
  ArrowLeft,
  Send,
  CheckCircle,
  Lock,
  FileText,
  Hash,
  Loader2,
  AlertTriangle,
} from 'lucide-react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { toast } from 'sonner'

type SubmissionStep = 'answering' | 'submitting-api' | 'signing-tx' | 'complete'

export default function ExamPage() {
  const params = useParams()
  const examId = params.id as string
  const { connected, publicKey } = useWallet()
  const { connection } = useConnection()

  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [step, setStep] = useState<SubmissionStep>('answering')
  const [answerHash, setAnswerHash] = useState<string>('')

  // Mock questions for V1
  const questions = [
    {
      id: 'q1',
      text: 'Explain the time complexity of a binary search algorithm and when it is most effective.',
    },
    {
      id: 'q2',
      text: 'Describe the difference between a stack and a queue. Provide real-world examples of each.',
    },
    {
      id: 'q3',
      text: 'What is a hash table? Explain how collisions are handled using chaining vs open addressing.',
    },
    {
      id: 'q4',
      text: 'Explain the concept of dynamic programming. Provide an example problem and its optimal substructure.',
    },
  ]

  const handleAnswerChange = useCallback((questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }, [])

  const handleSubmit = async () => {
    if (!connected || !publicKey) {
      toast.error('Please connect your wallet first')
      return
    }

    const unanswered = questions.filter((q) => !answers[q.id]?.trim())
    if (unanswered.length > 0) {
      toast.error(`Please answer all questions (${unanswered.length} remaining)`)
      return
    }

    try {
      // Step 1: Submit to API
      setStep('submitting-api')
      toast.info('Submitting answers to API...')

      // In production, this calls the SubmitAnswers Lambda
      // const response = await fetch(API_URL + '/exam/submit', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     examId,
      //     studentWallet: publicKey.toBase58(),
      //     answers,
      //   }),
      // })

      // Mock API response for V1
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const mockHash = Array.from(
        { length: 64 },
        () => Math.floor(Math.random() * 16).toString(16),
      ).join('')

      setAnswerHash(mockHash)
      toast.success('Answers saved! Now sign the on-chain transaction.')

      // Step 2: Sign on-chain transaction
      setStep('signing-tx')

      // In production, this sends a Solana transaction to submit_answer_hash
      // const tx = await program.methods
      //   .submitAnswerHash(mockHash)
      //   .accounts({ ... })
      //   .rpc()

      await new Promise((resolve) => setTimeout(resolve, 2000))

      setStep('complete')
      toast.success('Answer hash recorded on Solana! 🎉')
    } catch (error) {
      console.error('Submission error:', error)
      toast.error('Submission failed. Please try again.')
      setStep('answering')
    }
  }

  return (
    <main className="min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.72_0.19_160_/_0.04),transparent_50%)]" />
      </div>

      {/* Navigation */}
      <nav className="glass sticky top-0 z-50 border-b border-border/50">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <WalletMultiButton />
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* Exam Header */}
        <div className="glass rounded-2xl p-8 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary border border-primary/20">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                LIVE
              </div>
              <h1 className="text-3xl font-bold tracking-tight">{examId}</h1>
              <p className="mt-2 text-muted-foreground">
                Answer all questions below. Your answers will be hashed and recorded on-chain.
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
              <FileText className="h-7 w-7 text-primary" />
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mt-8 flex items-center gap-2">
            {[
              { label: 'Write Answers', key: 'answering' as const },
              { label: 'Submit to API', key: 'submitting-api' as const },
              { label: 'Sign on Solana', key: 'signing-tx' as const },
              { label: 'Complete', key: 'complete' as const },
            ].map((s, i) => {
              const stepOrder = ['answering', 'submitting-api', 'signing-tx', 'complete']
              const currentIndex = stepOrder.indexOf(step)
              const thisIndex = stepOrder.indexOf(s.key)
              const isActive = thisIndex === currentIndex
              const isDone = thisIndex < currentIndex

              return (
                <div key={s.key} className="flex items-center gap-2 flex-1">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                      isDone
                        ? 'bg-primary text-primary-foreground'
                        : isActive
                          ? 'bg-primary/20 text-primary border-2 border-primary'
                          : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    {isDone ? <CheckCircle className="h-4 w-4" /> : i + 1}
                  </div>
                  <span
                    className={`text-xs font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}
                  >
                    {s.label}
                  </span>
                  {i < 3 && <div className={`flex-1 h-0.5 rounded ${isDone ? 'bg-primary' : 'bg-border'}`} />}
                </div>
              )
            })}
          </div>
        </div>

        {/* Wallet Guard */}
        {!connected ? (
          <div className="glass flex flex-col items-center justify-center rounded-2xl py-20">
            <Lock className="mb-4 h-12 w-12 text-muted-foreground" />
            <h2 className="mb-2 text-xl font-bold">Wallet Required</h2>
            <p className="mb-6 text-muted-foreground">Connect your Solana wallet to access this exam.</p>
            <WalletMultiButton />
          </div>
        ) : step === 'complete' ? (
          /* Success State */
          <div className="glass flex flex-col items-center justify-center rounded-2xl py-20">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 border border-primary/20 animate-pulse-glow">
              <CheckCircle className="h-10 w-10 text-primary" />
            </div>
            <h2 className="mb-2 text-2xl font-bold">Submission Complete!</h2>
            <p className="mb-4 text-muted-foreground">
              Your answers have been recorded on the Solana blockchain.
            </p>
            <div className="glass mt-4 rounded-xl p-4 max-w-lg w-full">
              <p className="mb-2 text-xs text-muted-foreground font-medium">Answer Hash (SHA-256)</p>
              <code className="block break-all text-sm text-primary font-mono">{answerHash}</code>
            </div>
            <Link
              href="/dashboard"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
            >
              Return to Dashboard
            </Link>
          </div>
        ) : (
          /* Questions */
          <div className="space-y-6">
            {questions.map((question, index) => (
              <div key={question.id} className="glass rounded-2xl p-6">
                <div className="mb-4 flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                    {index + 1}
                  </span>
                  <p className="text-base font-medium leading-relaxed">{question.text}</p>
                </div>
                <textarea
                  id={`answer-${question.id}`}
                  value={answers[question.id] ?? ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  disabled={step !== 'answering'}
                  placeholder="Write your answer here..."
                  className="w-full resize-none rounded-xl border border-border bg-background/50 px-4 py-3 text-sm leading-relaxed placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all disabled:opacity-50 min-h-[120px]"
                  rows={5}
                />
              </div>
            ))}

            {/* Submit Button */}
            <div className="flex justify-end pt-4 pb-10">
              <button
                id="submit-exam-btn"
                onClick={handleSubmit}
                disabled={step !== 'answering'}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground transition-all hover:brightness-110 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {step === 'answering' ? (
                  <>
                    <Send className="h-5 w-5" />
                    Submit & Sign On-Chain
                  </>
                ) : step === 'submitting-api' ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Submitting to API...
                  </>
                ) : (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Awaiting Wallet Signature...
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
