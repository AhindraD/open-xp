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

  const {
    publicKey,
    connected,
    connecting,
    disconnect,
    wallet,
    connect,
  } = useWallet()

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
        className={`inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground opacity-90 ${className}`}
      >
        <Wallet className="h-4 w-4" />
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
        className={`inline-flex items-center justify-center gap-2 rounded-xl bg-primary/80 px-4 py-2.5 text-sm font-semibold text-primary-foreground opacity-80 cursor-wait ${className}`}
      >
        <Loader2 className="h-4 w-4 animate-spin" />
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
          className={`group flex items-center gap-2.5 rounded-xl border border-border/80 bg-background/80 hover:bg-accent/40 backdrop-blur-md px-3.5 py-2 text-sm font-medium transition-all shadow-sm hover:border-primary/40 ${className}`}
        >
          {/* Glowing Status indicator */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
          </span>

          {/* User Public Key */}
          <span className="font-mono text-xs font-semibold text-foreground">
            {truncatedAddress}
          </span>

          {balance !== null && (
            <span className="hidden sm:inline-block rounded-md bg-secondary/80 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground border border-border/40">
              {balance.toFixed(2)} SOL
            </span>
          )}

          <ChevronDown
            className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 group-hover:text-foreground ${
              dropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-72 origin-top-right rounded-2xl border border-border/80 bg-popover/95 p-3 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in-50 zoom-in-95">
            {/* Header / Account info */}
            <div className="flex items-center gap-2.5 border-b border-border/60 pb-3 mb-2 px-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-semibold text-foreground">
                    {wallet?.adapter.name || 'Solana Wallet'}
                  </p>
                  <span className="rounded bg-emerald-500/10 px-1.5 py-0.2 text-[9px] font-semibold text-emerald-500 border border-emerald-500/20">
                    Devnet
                  </span>
                </div>
                <p className="font-mono text-[11px] text-muted-foreground truncate">
                  {pubkeyString}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-1">
              {/* Copy Address */}
              <button
                type="button"
                onClick={handleCopy}
                className="flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium text-foreground hover:bg-accent/60 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                  <span>{copied ? 'Copied to Clipboard' : 'Copy Public Key'}</span>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {truncatedAddress}
                </span>
              </button>

              {/* View on Solana Explorer */}
              <a
                href={`https://explorer.solana.com/address/${pubkeyString}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium text-foreground hover:bg-accent/60 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>View on Explorer</span>
                </div>
                <span className="text-[10px] text-muted-foreground">Devnet ↗</span>
              </a>

              {/* Disconnect */}
              <div className="pt-1 mt-1 border-t border-border/50">
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
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
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:brightness-110 active:scale-95 transition-all ${className}`}
    >
      <Wallet className="h-4 w-4" />
      <span>Connect Wallet</span>
    </button>
  )
}
