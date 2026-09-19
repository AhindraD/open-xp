interface QuorumProgressBarProps {
  approvals: number
  threshold: number
}

export function QuorumProgressBar({ approvals, threshold }: QuorumProgressBarProps) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: threshold }).map((_, i) => (
        <div
          key={i}
          className={`h-2 flex-1 rounded-full transition-all duration-500 ${
            i < approvals
              ? 'bg-primary shadow-sm shadow-primary/40'
              : 'bg-border/60'
          }`}
        />
      ))}
    </div>
  )
}
