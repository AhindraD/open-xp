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
    <div className="glass rounded-2xl p-8 border border-border/60">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
            <Bot className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full mb-1">
              <Sparkles className="h-3 w-3" />
              AWS BEDROCK • CLAUDE 3.5 SONNET
            </div>
            <h3 className="text-xl font-bold">Transparent AI Grading Pipeline</h3>
          </div>
        </div>

        {!evaluation && (
          <button
            onClick={onTriggerEvaluation}
            disabled={isEvaluating}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:brightness-110 transition-all disabled:opacity-50"
          >
            {isEvaluating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Evaluating with Bedrock...
              </>
            ) : (
              <>
                <Award className="h-4 w-4" />
                Run AI Evaluation
              </>
            )}
          </button>
        )}
      </div>

      {evaluation ? (
        <div className="space-y-6 pt-2">
          {/* Score Banner */}
          <div className="glass rounded-xl p-6 border border-primary/30 bg-primary/5 flex items-center justify-between">
            <div>
              <p className="text-xs text-primary font-semibold uppercase tracking-wider">
                Final Evaluated Score
              </p>
              <p className="text-4xl font-extrabold text-foreground mt-1">
                {evaluation.score} <span className="text-lg text-muted-foreground">/ 100</span>
              </p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary border border-primary/30">
                <Check className="h-3.5 w-3.5" />
                On-Chain Anchored
              </span>
            </div>
          </div>

          {/* Justification */}
          <div className="glass rounded-xl p-5 border border-border/40">
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
              Academic Justification
            </p>
            <p className="text-sm leading-relaxed text-foreground/90">{evaluation.justification}</p>
          </div>

          {/* Rubric Breakdown */}
          <div className="glass rounded-xl p-5 border border-border/40 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase">
              Rubric Matches Per Question
            </p>
            {Object.entries(evaluation.rubricMatch).map(([qid, feedback]) => (
              <div key={qid} className="border-b border-border/30 pb-2 text-xs">
                <span className="font-mono text-primary font-bold">{qid}:</span>{' '}
                <span className="text-muted-foreground">{feedback}</span>
              </div>
            ))}
          </div>

          {/* Evaluation Hash */}
          <div className="glass rounded-xl p-4 bg-background/40">
            <p className="text-xs font-semibold text-muted-foreground mb-1">
              EvaluationHash (Anchored to AnswerRecord PDA)
            </p>
            <code className="text-xs text-primary font-mono break-all">
              {evaluation.evaluationHash}
            </code>
          </div>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground leading-relaxed">
          Trigger the automated post-exam pipeline. Amazon Bedrock evaluates subjective answers
          using the Converse API with guaranteed strict schema return, and anchors the resulting
          EvaluationHash directly to your student Solana account.
        </p>
      )}
    </div>
  )
}
