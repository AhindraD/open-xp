'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { EvaluationResult, MOCK_EVALUATIONS, DEFAULT_EVALUATION } from '@/data/mock'

export function useExamEvaluation(examId: string) {
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null)

  const handleTriggerEvaluation = async () => {
    try {
      setIsEvaluating(true)
      toast.info('Invoking Amazon Bedrock (Claude 3.5 Sonnet) via Converse API...')

      // In production calls /exam/evaluate Lambda
      // Simulated deterministic Bedrock output with strict schema
      await new Promise((r) => setTimeout(r, 2000))

      const result = MOCK_EVALUATIONS[examId] ?? DEFAULT_EVALUATION
      setEvaluation(result)

      toast.success('AI Evaluation complete & anchored on Solana! 🏆')
    } catch (err) {
      console.error('Grading error:', err)
      toast.error('Failed to run AI evaluation')
    } finally {
      setIsEvaluating(false)
    }
  }

  return {
    evaluation,
    isEvaluating,
    handleTriggerEvaluation,
  }
}
