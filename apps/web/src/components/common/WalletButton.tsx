'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import {
  Wallet,
  LogOut,
  Copy,
  ExternalLink,
  Check,
  ChevronDown,
  Loader2,
  ShieldCheck,
} from 'lucide-react'
import { toast } from 'sonner'

interface WalletButtonProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function WalletButton({ className = '', size = 'md' }: WalletButtonProps) {
  const [mounted, setMounted] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [balance, setBalance] = useState<number | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { publicKey, connected, connecting, disconnect, wallet, connect } = useWallet()

  const { setVisible } = useWalletModal()
  const { connection } = useConnection()

  // Prevent SSR hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownOpen])

  const pubkeyString = useMemo(() => {
    return publicKey ? publicKey.toBase58() : ''
  }, [publicKey])

  const truncatedAddress = useMemo(() => {
    if (!pubkeyString) return ''
    return `${pubkeyString.slice(0, 4)}...${pubkeyString.slice(-4)}`
  }, [pubkeyString])

  const isActuallyConnected = mounted && (connected || !!publicKey) && !!publicKey

  // Fetch SOL balance on devnet
  useEffect(() => {
    if (!publicKey || !connection) {
      setBalance(null)
      return
    }
    let isCancelled = false
    connection
      .getBalance(publicKey)
      .then((lamports) => {
        if (!isCancelled) {
          setBalance(lamports / LAMPORTS_PER_SOL)
        }
      })
      .catch(() => {
        // Fallback silently if RPC is throttled
      })

    return () => {
      isCancelled = true
    }
  }, [publicKey, connection])

  const handleConnectClick = async () => {
    if (wallet) {
      try {
        await connect()
      } catch {
        setVisible(true)
      }
    } else {
      setVisible(true)
    }
  }

  const handleCopy = async () => {
    if (!pubkeyString) return
    try {
      await navigator.clipboard.writeText(pubkeyString)
      setCopied(true)
      toast.success('Public Key copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy to clipboard')
    }
  }

  const handleDisconnect = async () => {
    try {
      setDropdownOpen(false)
      await disconnect()
      toast.info('Wallet disconnected')
    } catch (err) {
      console.error(err)
    }
  }

  // Before client hydration completes
  if (!mounted) {
    return (
      <button
        type="button"
        disabled
        className={`inline-flex items-center justify-center gap-2 rounded-none border border-zinc-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-black opacity-90 ${className}`}
      >
        <Wallet className="h-3.5 w-3.5" />
        <span>Connect Wallet</span>
      </button>
    )
  }

  // Connecting State
  if (connecting) {
    return (
      <button
        type="button"
        disabled
        className={`inline-flex items-center justify-center gap-2 rounded-none border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-300 opacity-80 cursor-wait ${className}`}
      >
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        <span>Connecting...</span>
      </button>
    )
  }

  // Connected State: Display user public key
  if (isActuallyConnected) {
    return (
      <div className="relative inline-block text-left" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setDropdownOpen((prev) => !prev)}
          className={`group flex items-center gap-2.5 rounded-none border border-zinc-700/80 bg-zinc-900/90 hover:bg-zinc-800 hover:border-zinc-500 backdrop-blur-md px-3 py-1.5 text-xs font-medium transition-all shadow-sm ${className}`}
        >
          {/* Mechanical square status indicator */}
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 bg-emerald-400"></span>
          </span>

          {/* User Public Key */}
          <span className="font-mono text-xs font-medium text-zinc-200">{truncatedAddress}</span>

          {balance !== null && (
            <span className="hidden sm:inline-block rounded-none bg-zinc-800/80 px-1.5 py-0.5 text-[10px] font-mono text-zinc-300 border border-zinc-700/60">
              {balance.toFixed(2)} SOL
            </span>
          )}

          <ChevronDown
            className={`h-3 w-3 text-zinc-400 transition-transform duration-200 group-hover:text-white ${
              dropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-72 origin-top-right rounded-none border border-zinc-800 bg-[#0c0d10]/98 p-3 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in-50 zoom-in-95">
            {/* Header / Account info */}
            <div className="flex items-center gap-2.5 border-b border-zinc-800/80 pb-3 mb-2 px-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-none bg-zinc-800 border border-zinc-700 text-zinc-200">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-semibold text-white">
                    {wallet?.adapter.name || 'Solana Wallet'}
                  </p>
                  <span className="rounded-none bg-zinc-800 px-1.5 py-0.5 text-[9px] font-mono text-emerald-400 border border-emerald-500/30">
                    DEVNET
                  </span>
                </div>
                <p className="font-mono text-[11px] text-zinc-400 truncate">{pubkeyString}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-1">
              {/* Copy Address */}
              <button
                type="button"
                onClick={handleCopy}
                className="flex w-full items-center justify-between rounded-none px-2.5 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800/80 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-zinc-400" />
                  )}
                  <span>{copied ? 'Copied to Clipboard' : 'Copy Public Key'}</span>
                </div>
                <span className="font-mono text-[10px] text-zinc-500">{truncatedAddress}</span>
              </button>

              {/* View on Solana Explorer */}
              <a
                href={`https://explorer.solana.com/address/${pubkeyString}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-between rounded-none px-2.5 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800/80 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-3.5 w-3.5 text-zinc-400" />
                  <span>View on Explorer</span>
                </div>
                <span className="font-mono text-[10px] text-zinc-500">Devnet ↗</span>
              </a>

              {/* Disconnect */}
              <div className="pt-1 mt-1 border-t border-zinc-800/80">
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="flex w-full items-center gap-2 rounded-none px-2.5 py-2 text-xs font-medium text-red-400 hover:bg-red-950/30 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Disconnect</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Disconnected State
  return (
    <button
      type="button"
      onClick={handleConnectClick}
      className={`inline-flex items-center justify-center gap-2 rounded-none border border-zinc-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-black shadow-sm hover:bg-zinc-200 active:scale-[0.98] transition-all ${className}`}
    >
      <Wallet className="h-3.5 w-3.5" />
      <span>Connect Wallet</span>
    </button>
  )
}
