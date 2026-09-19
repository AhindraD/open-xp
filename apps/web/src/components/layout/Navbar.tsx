'use client'

import Link from 'next/link'
import { Shield } from 'lucide-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

interface NavbarProps {
  showBackToDashboard?: boolean
  showAdminPortal?: boolean
  maxWidth?: string
}

export function Navbar({
  showBackToDashboard = false,
  showAdminPortal = false,
  maxWidth = 'max-w-7xl',
}: NavbarProps) {
  return (
    <nav className="glass sticky top-0 z-50 border-b border-border/50">
      <div className={`mx-auto flex ${maxWidth} items-center justify-between px-6 py-4`}>
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Open<span className="text-primary">-XP</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {showBackToDashboard && (
            <Link
              href="/dashboard"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
          )}

          {showAdminPortal && (
            <Link
              href="/exam/create"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              Admin Portal
            </Link>
          )}

          <WalletMultiButton />
        </div>
      </div>
    </nav>
  )
}
