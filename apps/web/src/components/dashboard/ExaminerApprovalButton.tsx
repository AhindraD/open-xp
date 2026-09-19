'use client'

import { FileCheck2, Loader2 } from 'lucide-react'

interface ExaminerApprovalButtonProps {
  examId: string
  isApproving: boolean
  onApprove: (examId: string) => void
}

export function ExaminerApprovalButton({
  examId,
  isApproving,
  onApprove,
}: ExaminerApprovalButtonProps) {
  return (
    <button
      onClick={() => onApprove(examId)}
      disabled={isApproving}
      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-none bg-zinc-900 border border-zinc-700 py-2.5 text-xs font-mono font-medium text-zinc-200 hover:bg-zinc-800 hover:border-zinc-500 hover:text-white transition-all disabled:opacity-50"
    >
      {isApproving ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-400" />
          <span>SIGNING MULTISIG...</span>
        </>
      ) : (
        <>
          <FileCheck2 className="h-3.5 w-3.5 text-zinc-400" />
          <span>APPROVE AS EXAMINER</span>
        </>
      )}
    </button>
  )
}
