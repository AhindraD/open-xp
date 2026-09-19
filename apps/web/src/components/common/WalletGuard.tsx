'use client'

import { ReactNode } from 'react'
import { KeyRound } from 'lucide-react'
import { WalletButton } from '@/components/common/WalletButton'

interface WalletGuardProps {
  title?: string
  description?: string
  icon?: ReactNode
}

export function WalletGuard({
  title = 'Wallet Connection Required',
  description = 'Connect your Solana wallet (Phantom or Backpack) to continue with this action.',
  icon,
}: WalletGuardProps) {
  return (
    <div className="glass flex flex-col items-center justify-center rounded-none py-20 border border-zinc-800 bg-[#0c0d10]/90 text-center px-6">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-none bg-zinc-900 border border-zinc-700 text-zinc-100">
        {icon || <KeyRound className="h-7 w-7 text-zinc-300 animate-pulse" />}
      </div>
      <h2 className="mb-2 text-xl font-bold tracking-tight text-white">{title}</h2>
      <p className="mb-6 text-xs font-mono text-zinc-400 max-w-md leading-relaxed">{description}</p>
      <WalletButton />
    </div>
  )
}
