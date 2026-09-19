import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: number | string
  icon: LucideIcon
}

export function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <div className="glass rounded-none p-4 flex items-center gap-4 border border-zinc-800 bg-[#0c0d10]/90">
      <div className="flex h-10 w-10 items-center justify-center rounded-none bg-zinc-900 border border-zinc-700 text-zinc-100">
        <Icon className="h-5 w-5 text-zinc-300" />
      </div>
      <div>
        <p className="text-2xl font-mono font-bold text-white">{value}</p>
        <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">{label}</p>
      </div>
    </div>
  )
}
