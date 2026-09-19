import Link from 'next/link'
import { ArrowRight, Users, Cloud, Database } from 'lucide-react'
import { StatusBadge } from '@/components/common/StatusBadge'
import { QuorumProgressBar } from '@/components/dashboard/QuorumProgressBar'
import { ExaminerApprovalButton } from '@/components/dashboard/ExaminerApprovalButton'
import { ExamItem } from '@/data/mock'

interface ExamCardProps {
  exam: ExamItem
  isApproving: boolean
  onApprove: (examId: string) => void
}

export function ExamCard({ exam, isApproving, onApprove }: ExamCardProps) {
  return (
    <div className="group glass rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 border border-border/60 flex flex-col justify-between">
      <div>
        {/* Status Badge & Timestamp */}
        <div className="mb-4 flex items-center justify-between">
          <StatusBadge isLive={exam.isLive} />
          <span className="text-xs text-muted-foreground">{exam.createdAt}</span>
        </div>

        {/* Content */}
        <h3 className="mb-2 text-lg font-bold leading-tight group-hover:text-primary transition-colors">
          {exam.title}
        </h3>
        <p className="mb-4 text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {exam.description}
        </p>

        {/* Cryptographic Proof Badges */}
        <div className="mb-4 flex flex-wrap gap-2 text-[11px] text-muted-foreground font-mono">
          <span className="inline-flex items-center gap-1 rounded bg-secondary/80 px-2 py-0.5">
            <Cloud className="h-3 w-3 text-primary" /> S3 Encrypted
          </span>
          <span className="inline-flex items-center gap-1 rounded bg-secondary/80 px-2 py-0.5">
            <Database className="h-3 w-3 text-primary" /> SHA-256 Hash
          </span>
        </div>

        {/* Quorum Progress Meta */}
        <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1 font-medium">
            <Users className="h-3.5 w-3.5 text-primary" />
            {exam.approvals} of {exam.threshold} Approvals Met
          </span>
          <span>{exam.questions} Questions</span>
        </div>

        {/* Progress Bar */}
        <div className="mb-5">
          <QuorumProgressBar approvals={exam.approvals} threshold={exam.threshold} />
        </div>
      </div>

      {/* Action Footer */}
      <div className="space-y-2 pt-2">
        {exam.isLive ? (
          <Link
            href={`/exam/${exam.id}`}
            id={`exam-card-${exam.id}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:brightness-110 transition-all hover:shadow-md hover:shadow-primary/20"
          >
            Enter Exam &amp; Decrypt Paper <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <ExaminerApprovalButton
              examId={exam.id}
              isApproving={isApproving}
              onApprove={onApprove}
            />
            <Link
              href={`/exam/${exam.id}`}
              className="inline-flex items-center justify-center rounded-xl bg-secondary px-3 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Details
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
