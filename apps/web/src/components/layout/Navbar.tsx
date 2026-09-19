'use client'

import Link from 'next/link'
import { Shield } from 'lucide-react'
import { WalletButton } from '@/components/common/WalletButton'

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
    <nav className="sticky top-0 z-50 border-b border-zinc-800/80 bg-[#050507]/80 backdrop-blur-md">
      <div className={`mx-auto flex ${maxWidth} items-center justify-between px-6 py-3.5`}>
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center border border-zinc-700/80 bg-zinc-900 text-zinc-100 group-hover:border-zinc-500 transition-colors">
            <Shield className="h-4.5 w-4.5 text-zinc-200" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight text-white">
              OPEN<span className="text-zinc-400">-XP</span>
            </span>
            <span className="hidden sm:inline-block border border-zinc-800 bg-zinc-900/60 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400">
              DEVNET
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          {showBackToDashboard && (
            <Link
              href="/dashboard"
              className="text-xs font-mono font-medium text-zinc-400 hover:text-white transition-colors border border-transparent hover:border-zinc-800 px-2.5 py-1.5"
            >
              ← DASHBOARD
            </Link>
          )}

          {showAdminPortal && (
            <Link
              href="/exam/create"
              className="text-xs font-mono font-medium text-zinc-400 hover:text-white transition-colors border border-transparent hover:border-zinc-800 px-2.5 py-1.5"
            >
              ADMIN PORTAL
            </Link>
          )}

          <WalletButton />
        </div>
      </div>
    </nav>
  )
}
