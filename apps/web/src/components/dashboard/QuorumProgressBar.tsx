interface QuorumProgressBarProps {
  approvals: number
  threshold: number
}

export function QuorumProgressBar({ approvals, threshold }: QuorumProgressBarProps) {
  return (
    <div className="flex gap-1 w-full">
      {Array.from({ length: threshold }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-none transition-all duration-500 ${
            i < approvals
              ? 'bg-zinc-200 border border-white/20'
              : 'bg-zinc-800/80 border border-zinc-700/40'
          }`}
        />
      ))}
    </div>
  )
}
