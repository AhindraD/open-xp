import Link from 'next/link'
import { Shield } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border/50 py-10 text-center text-xs text-muted-foreground">
      <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          <span className="font-semibold text-foreground">Open-XP</span>
          <span>• Track B Live Cloud</span>
        </div>
        <p>Zero-Trust Academic &amp; Certification Infrastructure on Solana + AWS.</p>
        <div className="flex gap-4">
          <Link href="/dashboard" className="hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <Link href="/exam/create" className="hover:text-foreground transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
