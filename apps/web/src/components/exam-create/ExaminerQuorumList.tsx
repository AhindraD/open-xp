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
    <div className="rounded-none p-6 border border-zinc-800 bg-[#0c0d10]/95 space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-zinc-300" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            02 // Examiner Multisig Quorum
          </h2>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
          <span>Threshold:</span>
          <input
            type="number"
            min={1}
            max={examiners.length || 1}
            value={threshold}
            onChange={(e) => onThresholdChange(parseInt(e.target.value) || 1)}
            className="w-14 rounded-none border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs text-center font-bold font-mono text-white focus:outline-none focus:border-zinc-400"
          />
          <span>of {examiners.length}</span>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-mono text-zinc-400 leading-relaxed">
          The exam paper remains strictly locked until at least {threshold} of the authorized
          examiner public keys sign on-chain approvals.
        </p>

        {examiners.map((examiner, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-500 w-6 text-center">#{index + 1}</span>
            <input
              type="text"
              value={examiner}
              onChange={(e) => onUpdateExaminer(index, e.target.value)}
              placeholder="Solana Public Key (Base58)"
              className="flex-1 rounded-none border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-400 transition-colors"
            />
            <button
              type="button"
              onClick={() => onRemoveExaminer(index)}
              className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
              title="Remove Examiner"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={onAddExaminer}
          className="mt-2 inline-flex items-center gap-1.5 rounded-none border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-mono text-zinc-300 hover:bg-zinc-800 hover:border-zinc-600 hover:text-white transition-all"
        >
          <Plus className="h-3.5 w-3.5" /> ADD EXAMINER KEY
        </button>
      </div>
    </div>
  )
}
