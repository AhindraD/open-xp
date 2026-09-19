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
    <div className="rounded-none p-6 border border-zinc-800 bg-[#0c0d10]/95 space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2">
          <CloudUpload className="h-4 w-4 text-zinc-300" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">03 // Question Paper (KMS Envelope Encrypted)</h2>
        </div>
        <span className="text-[10px] font-mono text-zinc-300 border border-zinc-700 bg-zinc-900 px-2 py-0.5 rounded-none flex items-center gap-1">
          <Lock className="h-3 w-3 text-zinc-400" /> ZERO-LEAK ENFORCED
        </span>
      </div>

      <p className="text-xs font-mono text-zinc-400 leading-relaxed">
        Enter the questions in JSON or plain text. The backend will encrypt this payload with an AWS
        KMS Data Key and store it in Amazon S3. The decryption key is locked until the Solana
        multisig threshold is reached.
      </p>

      <textarea
        value={paperContent}
        onChange={(e) => onPaperContentChange(e.target.value)}
        rows={7}
        placeholder="[&#10;  { &quot;id&quot;: &quot;q1&quot;, &quot;text&quot;: &quot;...&quot; }&#10;]"
        className="w-full rounded-none border border-zinc-800 bg-zinc-950/80 p-4 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-400 transition-colors resize-y"
      />
    </div>
  )
}
