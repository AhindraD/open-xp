'use client'

import { KeyRound, Loader2 } from 'lucide-react'

interface ExamLockedStateProps {
  isDecrypting: boolean
  onDecrypt: () => void
}

export function ExamLockedState({ isDecrypting, onDecrypt }: ExamLockedStateProps) {
  return (
    <div className="glass flex flex-col items-center justify-center rounded-2xl py-20 text-center p-6 border border-border/60">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
        <KeyRound className="h-10 w-10 text-primary" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Paper Locked &amp; Encrypted</h2>
      <p className="text-sm text-muted-foreground max-w-lg mb-8 leading-relaxed">
        The question paper is stored in Amazon S3 encrypted with an AWS KMS Data Key. Upon clicking below,
        the system will verify the on-chain Solana multisig approval, release the decryption key, and
        decrypt the questions purely in your browser&apos;s memory.
      </p>
      <button
        onClick={onDecrypt}
        disabled={isDecrypting}
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground hover:brightness-110 transition-all hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50"
      >
        {isDecrypting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Decrypting In-Memory...
          </>
        ) : (
          <>
            <KeyRound className="h-5 w-5" />
            Fetch KMS Key &amp; Decrypt Paper
          </>
        )}
      </button>
    </div>
  )
}
