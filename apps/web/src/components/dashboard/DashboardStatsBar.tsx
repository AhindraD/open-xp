import { Clock, CheckCircle, Users } from 'lucide-react'
import { StatCard } from '@/components/common/StatCard'
import { ExamItem } from '@/data/mock'

interface DashboardStatsBarProps {
  exams: ExamItem[]
}

export function DashboardStatsBar({ exams }: DashboardStatsBarProps) {
  const total = exams.length
  const liveCount = exams.filter((e) => e.isLive).length
  const pendingCount = exams.filter((e) => !e.isLive).length

  return (
    <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard label="Total Exams" value={total} icon={Clock} />
      <StatCard label="Live &amp; Decryptable" value={liveCount} icon={CheckCircle} />
      <StatCard label="Pending Quorum" value={pendingCount} icon={Users} />
    </div>
  )
}
