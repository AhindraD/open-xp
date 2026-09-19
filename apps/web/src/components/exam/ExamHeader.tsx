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
    <div className="glass rounded-2xl p-8 mb-8 border border-border/60">
      <div className="flex items-start justify-between">
        <div>
          <div className="mb-3">
            <LivePill />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{examId}</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl leading-relaxed">
            {description}
          </p>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
          <FileText className="h-7 w-7 text-primary" />
        </div>
      </div>
    </div>
  )
}
