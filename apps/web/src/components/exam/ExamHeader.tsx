import { FileText } from 'lucide-react'
import { LivePill } from '@/components/common/StatusBadge'

interface ExamHeaderProps {
  examId: string
  description?: string
}

export function ExamHeader({
  examId,
  description = 'Zero-Trust Exam: The question paper is KMS envelope-encrypted in S3. Submit answers to DynamoDB and sign your SHA-256 receipt permanently on Solana.',
}: ExamHeaderProps) {
  return (
    <div className="rounded-none p-6 sm:p-8 mb-8 border border-zinc-800 bg-[#0c0d10]/95 relative">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-3">
            <LivePill />
          </div>
          <h1 className="text-2xl sm:text-3xl font-mono font-bold tracking-tight text-white">
            {examId}
          </h1>
          <p className="mt-2 text-xs text-zinc-400 max-w-2xl leading-relaxed">
            {description}
          </p>
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-none bg-zinc-900 border border-zinc-700 text-zinc-200">
          <FileText className="h-6 w-6 text-zinc-300" />
        </div>
      </div>
    </div>
  )
}
