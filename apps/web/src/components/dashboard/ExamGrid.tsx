import { ExamCard } from '@/components/dashboard/ExamCard'
import { ExamItem } from '@/data/mock'

interface ExamGridProps {
  exams: ExamItem[]
  approvingId: string | null
  onApprove: (examId: string) => void
}

export function ExamGrid({ exams, approvingId, onApprove }: ExamGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {exams.map((exam) => (
        <ExamCard
          key={exam.id}
          exam={exam}
          isApproving={approvingId === exam.id}
          onApprove={onApprove}
        />
      ))}
    </div>
  )
}
