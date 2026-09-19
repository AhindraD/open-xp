'use client'

import { Cloud, Send, Loader2 } from 'lucide-react'
import { Question } from '@/data/mock'
import { SubmissionStep } from './ExamStepIndicator'

interface ExamQuestionsFormProps {
  questions: Question[]
  answers: Record<string, string>
  step: SubmissionStep
  onAnswerChange: (questionId: string, value: string) => void
  onSubmit: () => void
}

export function ExamQuestionsForm({
  questions,
  answers,
  step,
  onAnswerChange,
  onSubmit,
}: ExamQuestionsFormProps) {
  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-4 border border-border/60 flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <Cloud className="h-4 w-4 text-primary" /> Questions Decrypted In-Memory (Zero disk persistence)
        </span>
        <span>{questions.length} Subjective Questions</span>
      </div>

      {questions.map((q, idx) => (
        <div key={q.id} className="glass rounded-2xl p-6 border border-border/60">
          <div className="flex items-start gap-3 mb-4">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
              {idx + 1}
            </span>
            <p className="text-sm font-medium leading-relaxed">{q.text}</p>
          </div>

          <textarea
            id={`answer-${q.id}`}
            value={answers[q.id] ?? ''}
            onChange={(e) => onAnswerChange(q.id, e.target.value)}
            disabled={step !== 'answering'}
            placeholder="Enter your comprehensive subjective answer here..."
            rows={5}
            className="w-full resize-none rounded-xl border border-border bg-background/50 p-4 text-sm leading-relaxed placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all disabled:opacity-50 min-h-[130px]"
          />
        </div>
      ))}

      {/* Submit Button */}
      <div className="flex justify-end pt-4 pb-8">
        <button
          id="submit-exam-btn"
          onClick={onSubmit}
          disabled={step !== 'answering'}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground hover:brightness-110 transition-all hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50"
        >
          {step === 'answering' ? (
            <>
              <Send className="h-4 w-4" />
              Submit to DynamoDB &amp; Sign On-Chain
            </>
          ) : step === 'submitting-api' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving to DynamoDB...
            </>
          ) : (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Awaiting Solana Wallet Signature...
            </>
          )}
        </button>
      </div>
    </div>
  )
}
