'use client'

import { ReactNode } from 'react'
import { KeyRound } from 'lucide-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

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
    <div className="glass flex flex-col items-center justify-center rounded-2xl py-20 border border-border/60 text-center px-6">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
        {icon || <KeyRound className="h-8 w-8 animate-pulse" />}
      </div>
      <h2 className="mb-2 text-xl font-bold text-foreground">{title}</h2>
      <p className="mb-6 text-sm text-muted-foreground max-w-md leading-relaxed">{description}</p>
      <WalletMultiButton />
    </div>
  )
}
