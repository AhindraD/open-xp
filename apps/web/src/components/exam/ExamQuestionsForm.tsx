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
      <div className="rounded-none p-3.5 border border-zinc-800 bg-[#0c0d10]/90 flex items-center justify-between text-xs font-mono text-zinc-400">
        <span className="flex items-center gap-2">
          <Cloud className="h-4 w-4 text-zinc-300" /> IN-MEMORY DECRYPTED // ZERO PERSISTENCE
        </span>
        <span>{questions.length} SUBJECTIVE QUESTIONS</span>
      </div>

      {questions.map((q, idx) => (
        <div key={q.id} className="rounded-none p-6 border border-zinc-800 bg-[#0c0d10]/95">
          <div className="flex items-start gap-3 mb-4">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-none bg-zinc-900 border border-zinc-700 text-xs font-mono font-bold text-zinc-200">
              {idx + 1}
            </span>
            <p className="text-sm font-medium text-white leading-relaxed">{q.text}</p>
          </div>

          <textarea
            id={`answer-${q.id}`}
            value={answers[q.id] ?? ''}
            onChange={(e) => onAnswerChange(q.id, e.target.value)}
            disabled={step !== 'answering'}
            placeholder="Enter your comprehensive subjective answer here..."
            rows={5}
            className="w-full resize-none rounded-none border border-zinc-800 bg-zinc-950/80 p-4 text-sm font-sans leading-relaxed text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-400 transition-all disabled:opacity-50 min-h-[130px]"
          />
        </div>
      ))}

      {/* Submit Button */}
      <div className="flex justify-end pt-4 pb-8">
        <button
          id="submit-exam-btn"
          onClick={onSubmit}
          disabled={step !== 'answering'}
          className="inline-flex items-center justify-center gap-2 rounded-none border border-white bg-white px-8 py-4 text-xs font-bold uppercase tracking-wider text-black hover:bg-zinc-200 hover:border-zinc-200 transition-all shadow-md active:scale-[0.99] disabled:opacity-50"
        >
          {step === 'answering' ? (
            <>
              <Send className="h-4 w-4 text-black" />
              <span>SUBMIT TO DYNAMODB &amp; SIGN ON-CHAIN</span>
            </>
          ) : step === 'submitting-api' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-black" />
              <span>SAVING TO DYNAMODB...</span>
            </>
          ) : (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-black" />
              <span>AWAITING SOLANA SIGNATURE...</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
