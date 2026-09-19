import { CheckCircle } from 'lucide-react'

interface ExamSubmissionReceiptProps {
  answerHash: string
  txSignature: string
}

export function ExamSubmissionReceipt({ answerHash, txSignature }: ExamSubmissionReceiptProps) {
  return (
    <div className="rounded-none p-6 sm:p-8 border border-zinc-800 bg-[#0c0d10]/95">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-none bg-zinc-900 border border-zinc-700 text-zinc-100">
          <CheckCircle className="h-5 w-5 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Submission Anchored on Solana!</h2>
          <p className="text-xs font-mono text-zinc-400">
            Answers secured off-chain with an immutable cryptographic SHA-256 hash receipt on-chain.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-none p-4 border border-zinc-800 bg-zinc-950/70">
          <p className="text-[11px] font-mono uppercase text-zinc-500 mb-1.5">
            Student Answer SHA-256 Hash
          </p>
          <code className="text-xs text-zinc-200 font-mono break-all">{answerHash}</code>
        </div>

        <div className="rounded-none p-4 border border-zinc-800 bg-zinc-950/70">
          <p className="text-[11px] font-mono uppercase text-zinc-500 mb-1.5">
            Solana Transaction Signature
          </p>
          <code className="text-xs text-zinc-400 font-mono break-all">
            {txSignature || 'Confirmed on Devnet'}
          </code>
        </div>
      </div>
    </div>
  )
}
