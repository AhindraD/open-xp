import { Lock, Sparkles } from 'lucide-react'

interface StatusBadgeProps {
  isLive: boolean
}

export function StatusBadge({ isLive }: StatusBadgeProps) {
  if (isLive) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-none bg-zinc-900/90 px-2.5 py-0.5 text-[11px] font-mono font-medium text-emerald-400 border border-emerald-500/30">
        <span className="h-1.5 w-1.5 bg-emerald-400 animate-pulse" />
        LIVE // KMS UNLOCKED
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-none bg-zinc-900/90 px-2.5 py-0.5 text-[11px] font-mono font-medium text-amber-400 border border-amber-500/30">
      <Lock className="h-3 w-3" />
      LOCKED // PENDING QUORUM
    </span>
  )
}

export function LivePill() {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-none bg-zinc-900/90 px-2.5 py-1 text-[11px] font-mono font-medium text-zinc-200 border border-zinc-700">
      <span className="h-1.5 w-1.5 bg-emerald-400 animate-pulse" />
      ACTIVE // SOLANA ANCHORED
    </div>
  )
}

export function AdminPill() {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-none bg-zinc-900/90 px-2.5 py-1 text-[11px] font-mono font-medium text-zinc-200 border border-zinc-700">
      <Sparkles className="h-3 w-3 text-zinc-400" />
      ADMINISTRATION // PHASE A
    </div>
  )
}
