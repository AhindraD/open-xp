'use client'

import { CheckCircle2, Loader2 } from 'lucide-react'

interface CreateExamSubmitBarProps {
  isSubmitting: boolean
  statusMessage: string
  createdS3Uri: string
}

export function CreateExamSubmitBar({
  isSubmitting,
  statusMessage,
  createdS3Uri,
}: CreateExamSubmitBarProps) {
  return (
    <div className="glass rounded-2xl p-6 border border-border/60 flex items-center justify-between">
      <div>
        <p className="text-xs font-medium text-muted-foreground">
          {statusMessage || 'Ready to encrypt and anchor on Solana Devnet'}
        </p>
        {createdS3Uri && (
          <p className="text-xs text-primary font-mono mt-1">S3 URI: {createdS3Uri}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground hover:brightness-110 transition-all hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CheckCircle2 className="h-4 w-4" />
            Create &amp; Encrypt Exam
          </>
        )}
      </button>
    </div>
  )
}
