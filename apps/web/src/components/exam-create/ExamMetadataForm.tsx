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
    <div className="glass rounded-2xl p-6 border border-border/60 space-y-4">
      <div className="flex items-center gap-2 border-b border-border/40 pb-3">
        <FileText className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-bold">Exam Metadata</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
            Exam ID (Immutable On-Chain Key)
          </label>
          <input
            type="text"
            value={examId}
            onChange={(e) => onExamIdChange(e.target.value)}
            required
            placeholder="e.g. CS101-FINAL-2026"
            className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
            Exam Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            required
            placeholder="e.g. Computer Science 101 Final"
            className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={2}
          className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
        />
      </div>
    </div>
  )
}
