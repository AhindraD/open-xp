import { FileText } from 'lucide-react'

interface ExamMetadataFormProps {
  examId: string
  title: string
  description: string
  onExamIdChange: (val: string) => void
  onTitleChange: (val: string) => void
  onDescriptionChange: (val: string) => void
}

export function ExamMetadataForm({
  examId,
  title,
  description,
  onExamIdChange,
  onTitleChange,
  onDescriptionChange,
}: ExamMetadataFormProps) {
  return (
    <div className="rounded-none p-6 border border-zinc-800 bg-[#0c0d10]/95 space-y-4">
      <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-3">
        <FileText className="h-4 w-4 text-zinc-300" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-white">
          01 // Exam Metadata
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
            Exam ID (Immutable On-Chain Key)
          </label>
          <input
            type="text"
            value={examId}
            onChange={(e) => onExamIdChange(e.target.value)}
            required
            placeholder="e.g. CS101-FINAL-2026"
            className="w-full rounded-none border border-zinc-800 bg-zinc-950/80 px-3.5 py-2 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-400 transition-colors"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
            Exam Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            required
            placeholder="e.g. Computer Science 101 Final"
            className="w-full rounded-none border border-zinc-800 bg-zinc-950/80 px-3.5 py-2 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-400 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={2}
          placeholder="Brief overview of course syllabus and coverage..."
          className="w-full rounded-none border border-zinc-800 bg-zinc-950/80 px-3.5 py-2 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-400 transition-colors resize-none"
        />
      </div>
    </div>
  )
}
