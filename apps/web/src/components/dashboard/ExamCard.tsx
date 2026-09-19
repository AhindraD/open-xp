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
    <div className="group rounded-none p-6 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-600 border border-zinc-800 bg-[#0c0d10]/95 flex flex-col justify-between relative">
      <div>
        {/* Status Badge & Timestamp */}
        <div className="mb-4 flex items-center justify-between">
          <StatusBadge isLive={exam.isLive} />
          <span className="font-mono text-[10px] text-zinc-500">{exam.createdAt}</span>
        </div>

        {/* Content */}
        <h3 className="mb-2 text-base font-bold leading-snug text-white group-hover:text-zinc-200 transition-colors">
          {exam.title}
        </h3>
        <p className="mb-4 text-xs text-zinc-400 leading-relaxed line-clamp-2">
          {exam.description}
        </p>

        {/* Cryptographic Proof Badges */}
        <div className="mb-4 flex flex-wrap gap-2 text-[10px] text-zinc-400 font-mono">
          <span className="inline-flex items-center gap-1 rounded-none border border-zinc-800 bg-zinc-900/80 px-2 py-0.5">
            <Cloud className="h-3 w-3 text-zinc-300" /> S3 KMS ENCRYPTED
          </span>
          <span className="inline-flex items-center gap-1 rounded-none border border-zinc-800 bg-zinc-900/80 px-2 py-0.5">
            <Database className="h-3 w-3 text-zinc-300" /> SHA-256 HASH
          </span>
        </div>

        {/* Quorum Progress Meta */}
        <div className="mb-3 flex items-center justify-between text-xs font-mono text-zinc-400">
          <span className="flex items-center gap-1.5 font-medium">
            <Users className="h-3.5 w-3.5 text-zinc-400" />
            {exam.approvals} / {exam.threshold} Approvals Met
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
            className="inline-flex w-full items-center justify-center gap-2 rounded-none border border-white bg-white py-2.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-zinc-200 hover:border-zinc-200 transition-all shadow-sm active:scale-[0.99]"
          >
            ENTER EXAM &amp; DECRYPT PAPER <ArrowRight className="h-3.5 w-3.5" />
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
              className="inline-flex items-center justify-center rounded-none border border-zinc-700 bg-zinc-900 px-3.5 py-2.5 text-xs font-mono font-medium text-zinc-300 hover:bg-zinc-800 hover:border-zinc-500 hover:text-white transition-colors"
            >
              DETAILS
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
