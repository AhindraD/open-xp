import { Lock, Sparkles } from 'lucide-react'

interface StatusBadgeProps {
  isLive: boolean
}

export function StatusBadge({ isLive }: StatusBadgeProps) {
  if (isLive) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary border border-primary/20">
        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        LIVE • KMS UNLOCKED
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-chart-4/10 px-3 py-1 text-xs font-semibold text-chart-4 border border-chart-4/20">
      <Lock className="h-3 w-3" />
      LOCKED • PENDING QUORUM
    </span>
  )
}

export function LivePill() {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary border border-primary/20">
      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
      ACTIVE • SOLANA ANCHORED
    </div>
  )
}

export function AdminPill() {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary border border-primary/20">
      <Sparkles className="h-3.5 w-3.5" />
      ADMINISTRATION • PHASE A
    </div>
  )
}
