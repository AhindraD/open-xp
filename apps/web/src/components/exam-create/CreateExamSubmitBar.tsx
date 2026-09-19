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
    <div className="rounded-none p-6 border border-zinc-800 bg-[#0c0d10]/95 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <p className="text-xs font-mono text-zinc-400">
          {statusMessage || 'READY TO ENCRYPT AND ANCHOR ON SOLANA DEVNET'}
        </p>
        {createdS3Uri && (
          <p className="text-xs text-zinc-300 font-mono mt-1">S3 URI: {createdS3Uri}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center gap-2 rounded-none border border-white bg-white px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-zinc-200 hover:border-zinc-200 transition-all shadow-md active:scale-[0.99] disabled:opacity-50 self-start sm:self-auto"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-black" />
            <span>PROCESSING...</span>
          </>
        ) : (
          <>
            <CheckCircle2 className="h-4 w-4 text-black" />
            <span>CREATE &amp; ENCRYPT EXAM</span>
          </>
        )}
      </button>
    </div>
  )
}
