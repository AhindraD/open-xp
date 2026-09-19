import Link from 'next/link'
import { Shield } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-zinc-800/80 bg-[#050507]/90 py-10 text-xs text-zinc-400">
      <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center border border-zinc-700/60 bg-zinc-900 text-zinc-300">
            <Shield className="h-3.5 w-3.5" />
          </div>
          <span className="font-bold text-zinc-200">OPEN-XP</span>
          <span className="text-zinc-600">/</span>
          <span className="font-mono text-[11px] text-zinc-500">SOLANA + AWS KMS</span>
        </div>
        <p className="font-mono text-[11px] text-zinc-500">
          Zero-Trust Academic Infrastructure. In-Memory Decryption &amp; On-Chain Anchored Proofs.
        </p>
        <div className="flex gap-4 font-mono text-[11px]">
          <Link href="/dashboard" className="text-zinc-400 hover:text-white transition-colors">
            [DASHBOARD]
          </Link>
          <Link href="/exam/create" className="text-zinc-400 hover:text-white transition-colors">
            [ADMIN]
          </Link>
        </div>
      </div>
    </footer>
  )
}
