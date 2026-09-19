'use client'

import { Bot, Sparkles, Award, Check, Loader2 } from 'lucide-react'
import { EvaluationResult } from '@/data/mock'

interface ExamAIEvaluationProps {
  evaluation: EvaluationResult | null
  isEvaluating: boolean
  onTriggerEvaluation: () => void
}

export function ExamAIEvaluation({
  evaluation,
  isEvaluating,
  onTriggerEvaluation,
}: ExamAIEvaluationProps) {
  return (
    <div className="rounded-none p-6 sm:p-8 border border-zinc-800 bg-[#0c0d10]/95">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-none bg-zinc-900 border border-zinc-700 text-zinc-200">
            <Bot className="h-5 w-5 text-zinc-300" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 border border-zinc-800 bg-zinc-900/80 px-2 py-0.5 rounded-none mb-1">
              <Sparkles className="h-3 w-3 text-zinc-400" />
              AWS BEDROCK // CLAUDE 3.5 SONNET
            </div>
            <h3 className="text-lg font-bold text-white">Transparent AI Grading Pipeline</h3>
          </div>
        </div>

        {!evaluation && (
          <button
            onClick={onTriggerEvaluation}
            disabled={isEvaluating}
            className="inline-flex items-center justify-center gap-2 rounded-none border border-white bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-zinc-200 hover:border-zinc-200 transition-all shadow-sm active:scale-[0.99] disabled:opacity-50 self-start sm:self-auto"
          >
            {isEvaluating ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-black" />
                <span>EVALUATING WITH BEDROCK...</span>
              </>
            ) : (
              <>
                <Award className="h-3.5 w-3.5 text-black" />
                <span>RUN AI EVALUATION</span>
              </>
            )}
          </button>
        )}
      </div>

      {evaluation ? (
        <div className="space-y-4 pt-2">
          {/* Score Banner */}
          <div className="rounded-none p-5 border border-zinc-700 bg-zinc-900/60 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                Final Evaluated Score
              </p>
              <p className="text-3xl font-mono font-extrabold text-white mt-1">
                {evaluation.score} <span className="text-sm font-sans text-zinc-500">/ 100</span>
              </p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1.5 rounded-none bg-zinc-900 px-2.5 py-1 text-[11px] font-mono text-emerald-400 border border-emerald-500/30">
                <Check className="h-3 w-3" />
                ON-CHAIN ANCHORED
              </span>
            </div>
          </div>

          {/* Justification */}
          <div className="rounded-none p-4 border border-zinc-800 bg-zinc-950/70">
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2">
              Academic Justification
            </p>
            <p className="text-xs leading-relaxed text-zinc-300 font-sans">{evaluation.justification}</p>
          </div>

          {/* Rubric Breakdown */}
          <div className="rounded-none p-4 border border-zinc-800 bg-zinc-950/70 space-y-2.5">
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Rubric Matches Per Question
            </p>
            {Object.entries(evaluation.rubricMatch).map(([qid, feedback]) => (
              <div key={qid} className="border-b border-zinc-800/80 pb-2 text-xs font-mono">
                <span className="text-zinc-200 font-bold">{qid}:</span>{' '}
                <span className="text-zinc-400">{feedback}</span>
              </div>
            ))}
          </div>

          {/* Evaluation Hash */}
          <div className="rounded-none p-4 border border-zinc-800 bg-zinc-950/70">
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">
              EvaluationHash (Anchored to AnswerRecord PDA)
            </p>
            <code className="text-xs text-zinc-300 font-mono break-all">
              {evaluation.evaluationHash}
            </code>
          </div>
        </div>
      ) : (
        <p className="text-xs font-mono text-zinc-500 leading-relaxed">
          Trigger the automated post-exam pipeline. Amazon Bedrock evaluates subjective answers
          using the Converse API with guaranteed strict schema return, and anchors the resulting
          EvaluationHash directly to your student Solana account.
        </p>
      )}
    </div>
  )
}
