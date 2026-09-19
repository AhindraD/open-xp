'use client'

import { Users, Plus, Trash2 } from 'lucide-react'

interface ExaminerQuorumListProps {
  examiners: string[]
  threshold: number
  onAddExaminer: () => void
  onRemoveExaminer: (index: number) => void
  onUpdateExaminer: (index: number, val: string) => void
  onThresholdChange: (val: number) => void
}

export function ExaminerQuorumList({
  examiners,
  threshold,
  onAddExaminer,
  onRemoveExaminer,
  onUpdateExaminer,
  onThresholdChange,
}: ExaminerQuorumListProps) {
  return (
    <div className="glass rounded-2xl p-6 border border-border/60 space-y-4">
      <div className="flex items-center justify-between border-b border-border/40 pb-3">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold">Examiner Multisig Quorum</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Threshold:</span>
          <input
            type="number"
            min={1}
            max={examiners.length || 1}
            value={threshold}
            onChange={(e) => onThresholdChange(parseInt(e.target.value) || 1)}
            className="w-16 rounded-lg border border-border bg-background/50 px-2 py-1 text-xs text-center font-bold font-mono focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <span className="text-xs text-muted-foreground">of {examiners.length}</span>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">
          The exam paper remains strictly locked until at least {threshold} of the authorized
          examiner public keys sign on-chain approvals.
        </p>

        {examiners.map((examiner, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground w-6 text-center">
              #{index + 1}
            </span>
            <input
              type="text"
              value={examiner}
              onChange={(e) => onUpdateExaminer(index, e.target.value)}
              placeholder="Solana Public Key (Base58)"
              className="flex-1 rounded-xl border border-border bg-background/50 px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              type="button"
              onClick={() => onRemoveExaminer(index)}
              className="p-2 text-muted-foreground hover:text-destructive transition-colors"
              title="Remove Examiner"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={onAddExaminer}
          className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
        >
          <Plus className="h-3.5 w-3.5" /> Add Examiner Key
        </button>
      </div>
    </div>
  )
}
