import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: number | string
  icon: LucideIcon
}

export function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <div className="glass rounded-xl p-5 flex items-center gap-4 border border-border/60">
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}
