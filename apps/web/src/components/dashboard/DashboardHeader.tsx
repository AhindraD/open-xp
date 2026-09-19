import Link from 'next/link'
import { Plus } from 'lucide-react'

interface DashboardHeaderProps {
  connected: boolean
}

export function DashboardHeader({ connected }: DashboardHeaderProps) {
  return (
    <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
            [SYSTEM CONSOLE]
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Examinations Registry</h1>
        <p className="mt-1 text-xs font-mono text-zinc-400">
          {connected
            ? 'Select an active exam, sign multisig approvals, or deploy a new trustless verification state.'
            : 'Connect your Solana wallet to participate as an authorized student or examiner.'}
        </p>
      </div>

      {connected && (
        <Link
          href="/exam/create"
          id="create-exam-btn"
          className="inline-flex items-center justify-center gap-2 rounded-none border border-white bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black transition-all hover:bg-zinc-200 hover:border-zinc-200 hover:-translate-y-0.5 shadow-sm active:scale-[0.99] self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Create Exam
        </Link>
      )}
    </div>
  )
}
