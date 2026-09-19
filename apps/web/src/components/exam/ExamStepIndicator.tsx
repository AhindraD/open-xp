import { Check } from 'lucide-react'

export type SubmissionStep = 'locked' | 'answering' | 'submitting-api' | 'signing-tx' | 'complete'

interface ExamStepIndicatorProps {
  currentStep: SubmissionStep
}

const STEPS = [
  { label: 'KMS Decrypt', key: 'locked' as const },
  { label: 'Write Answers', key: 'answering' as const },
  { label: 'Submit to API', key: 'submitting-api' as const },
  { label: 'Sign on Solana', key: 'signing-tx' as const },
  { label: 'AI Evaluation', key: 'complete' as const },
]

export function ExamStepIndicator({ currentStep }: ExamStepIndicatorProps) {
  const stepOrder = ['locked', 'answering', 'submitting-api', 'signing-tx', 'complete']
  const currentIndex = stepOrder.indexOf(currentStep)

  return (
    <div className="flex items-center gap-2 mb-8 border border-zinc-800 bg-[#0c0d10]/80 p-3">
      {STEPS.map((s, i) => {
        const thisIndex = stepOrder.indexOf(s.key)
        const isActive = thisIndex === currentIndex
        const isDone = thisIndex < currentIndex

        return (
          <div key={s.key} className="flex items-center gap-2 flex-1">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-none text-[11px] font-mono font-bold transition-all ${
                isDone
                  ? 'bg-white text-black border border-white'
                  : isActive
                    ? 'bg-zinc-800 text-white border border-zinc-400'
                    : 'bg-zinc-900 text-zinc-600 border border-zinc-800'
              }`}
            >
              {isDone ? <Check className="h-3 w-3" /> : i + 1}
            </div>
            <span
              className={`text-[11px] font-mono hidden sm:inline ${
                isActive ? 'text-white font-semibold' : 'text-zinc-500'
              }`}
            >
              {s.label}
            </span>
            {i < STEPS.length - 1 && (
              <div
                className={`flex-1 h-[1px] rounded-none transition-colors ${
                  isDone ? 'bg-zinc-300' : 'bg-zinc-800'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
