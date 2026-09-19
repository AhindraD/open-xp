'use client'

import { KeyRound, Loader2 } from 'lucide-react'

interface ExamLockedStateProps {
  isDecrypting: boolean
  onDecrypt: () => void
}

export function ExamLockedState({ isDecrypting, onDecrypt }: ExamLockedStateProps) {
  return (
    <div className="rounded-none py-20 text-center p-8 border border-zinc-800 bg-[#0c0d10]/95 flex flex-col items-center justify-center relative">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-none bg-zinc-900 border border-zinc-700 text-zinc-200">
        <KeyRound className="h-8 w-8 text-zinc-300" />
      </div>
      <h2 className="text-xl sm:text-2xl font-bold mb-2 text-white">
        Paper Locked &amp; Encrypted
      </h2>
      <p className="text-xs text-zinc-400 max-w-lg mb-8 leading-relaxed font-mono">
        The question paper is stored in Amazon S3 encrypted with an AWS KMS Data Key. Verification
        requires on-chain Solana multisig approval before the decryption key is released in-memory.
      </p>
      <button
        onClick={onDecrypt}
        disabled={isDecrypting}
        className="inline-flex items-center justify-center gap-2 rounded-none border border-white bg-white px-8 py-4 text-xs font-bold uppercase tracking-wider text-black hover:bg-zinc-200 hover:border-zinc-200 transition-all shadow-md active:scale-[0.99] disabled:opacity-50"
      >
        {isDecrypting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-black" />
            <span>DECRYPTING IN-MEMORY...</span>
          </>
        ) : (
          <>
            <KeyRound className="h-4 w-4 text-black" />
            <span>FETCH KMS KEY &amp; DECRYPT PAPER</span>
          </>
        )}
      </button>
    </div>
  )
}
