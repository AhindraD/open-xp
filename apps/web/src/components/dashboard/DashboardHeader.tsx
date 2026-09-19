import Link from 'next/link'
import { Plus } from 'lucide-react'

interface DashboardHeaderProps {
  connected: boolean
}

export function DashboardHeader({ connected }: DashboardHeaderProps) {
  return (
    <div className="mb-10 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Examinations Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {connected
            ? 'Select an active exam, review multisig approvals, or deploy a new trustless exam.'
            : 'Connect your wallet to participate as a student or authorized examiner.'}
        </p>
      </div>

      {connected && (
        <Link
          href="/exam/create"
          id="create-exam-btn"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25"
        >
          <Plus className="h-4 w-4" />
          Create Exam
        </Link>
      )}
    </div>
  )
}
