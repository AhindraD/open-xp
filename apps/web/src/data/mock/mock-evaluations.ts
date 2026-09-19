export interface EvaluationResult {
  score: number
  rubricMatch: Record<string, string>
  justification: string
  evaluationHash: string
}

export const MOCK_EVALUATIONS: Record<string, EvaluationResult> = {
  'CS101-FINAL-2026': {
    score: 94,
    rubricMatch: {
      q1: 'Full marks: accurate log(n) vs O(1) trade-off discussion',
      q2: 'Comprehensive explanation of 2PL vs MVCC and timestamp ordering',
      q3: 'Correct identification of split-vote mitigation and quorum math',
      q4: 'Excellent summary of arithmetic circuits and proof verifiability',
    },
    justification:
      'The candidate demonstrated exceptional mastery of distributed algorithms, cryptographic primitives, and formal computational complexity with rigorous terminology.',
    evaluationHash: '7e2b9c4f1a8d3e5b6c7a8f90123456789abcdef0123456789abcdef012345678',
  },
  'MATH201-MID-2026': {
    score: 89,
    rubricMatch: {
      q1: 'Clear geometric interpretation; minor algebraic simplification omitted in proof',
      q2: 'Flawless proof of orthonormal basis preservation under unitary transformation',
      q3: 'Accurate singular value ranking with insightful PCA connection',
    },
    justification:
      'Strong analytical rigor throughout the derivations with sound geometric intuition across high-dimensional vector spaces.',
    evaluationHash: '4a1c8f3e2b9d0e7a5c6b8f1029384756abcdef1234567890abcdef1234567890',
  },
}

export const DEFAULT_EVALUATION: EvaluationResult = MOCK_EVALUATIONS['CS101-FINAL-2026']!
