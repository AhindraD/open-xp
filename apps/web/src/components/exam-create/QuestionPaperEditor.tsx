'use client'

import { CloudUpload, Lock } from 'lucide-react'

interface QuestionPaperEditorProps {
  paperContent: string
  onPaperContentChange: (val: string) => void
}

export function QuestionPaperEditor({
  paperContent,
  onPaperContentChange,
}: QuestionPaperEditorProps) {
  return (
    <div className="glass rounded-2xl p-6 border border-border/60 space-y-4">
      <div className="flex items-center justify-between border-b border-border/40 pb-3">
        <div className="flex items-center gap-2">
          <CloudUpload className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold">Question Paper (KMS Envelope Encrypted)</h2>
        </div>
        <span className="text-xs text-primary font-medium flex items-center gap-1">
          <Lock className="h-3.5 w-3.5" /> Zero-Leak Enforced
        </span>
      </div>

      <p className="text-xs text-muted-foreground">
        Enter the questions in JSON or plain text. The backend will encrypt this payload with an AWS
        KMS Data Key and store it in Amazon S3. The decryption key is locked until the Solana
        multisig threshold is reached.
      </p>

      <textarea
        value={paperContent}
        onChange={(e) => onPaperContentChange(e.target.value)}
        rows={7}
        className="w-full rounded-xl border border-border bg-background/50 p-4 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/40 resize-y"
      />
    </div>
  )
}
