import { CheckCircle } from 'lucide-react'

interface ExamSubmissionReceiptProps {
  answerHash: string
  txSignature: string
}

export function ExamSubmissionReceipt({
  answerHash,
  txSignature,
}: ExamSubmissionReceiptProps) {
  return (
    <div className="glass rounded-2xl p-8 border border-border/60">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
          <CheckCircle className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Submission Anchored on Solana!</h2>
          <p className="text-xs text-muted-foreground">
            Your answers are secured off-chain with an immutable SHA-256 hash receipt on-chain.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass rounded-xl p-4 bg-background/40">
          <p className="text-xs font-semibold text-muted-foreground mb-1">
            Student Answer SHA-256 Hash
          </p>
          <code className="text-xs text-primary font-mono break-all">{answerHash}</code>
        </div>

        <div className="glass rounded-xl p-4 bg-background/40">
          <p className="text-xs font-semibold text-muted-foreground mb-1">
            Solana Transaction Signature
          </p>
          <code className="text-xs text-muted-foreground font-mono break-all">
            {txSignature || 'Confirmed on Devnet'}
          </code>
        </div>
      </div>
    </div>
  )
}
