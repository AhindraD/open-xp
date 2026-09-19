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
      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary/20 border border-primary/30 py-2.5 text-xs font-semibold text-primary hover:bg-primary/30 transition-all disabled:opacity-50"
    >
      {isApproving ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Signing...
        </>
      ) : (
        <>
          <FileCheck2 className="h-3.5 w-3.5" />
          Approve as Examiner
        </>
      )}
    </button>
  )
}
