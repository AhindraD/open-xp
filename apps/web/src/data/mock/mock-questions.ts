export interface Question {
  id: string
  text: string
}

export const MOCK_QUESTIONS_BY_EXAM: Record<string, Question[]> = {
  'CS101-FINAL-2026': [
    {
      id: 'q1',
      text: 'Explain the time complexity of a binary search algorithm and when it is most effective compared to hash-based lookup.',
    },
    {
      id: 'q2',
      text: 'Describe the differences between optimistic and pessimistic concurrency control in distributed databases.',
    },
    {
      id: 'q3',
      text: 'How does the Raft consensus protocol guarantee safety during network partitions? Discuss leader election and log replication.',
    },
    {
      id: 'q4',
      text: 'Explain the purpose of zero-knowledge proofs (zk-SNARKs) in verifiable computation without disclosing private inputs.',
    },
  ],
  'MATH201-MID-2026': [
    {
      id: 'q1',
      text: 'Define eigenvalue and eigenvector. Explain the geometric intuition of diagonalizability for a linear operator.',
    },
    {
      id: 'q2',
      text: 'Prove that the columns of matrix A form an orthonormal basis if and only if A^T * A = I.',
    },
    {
      id: 'q3',
      text: 'Explain the Singular Value Decomposition (SVD) and its geometric interpretation in dimension reduction.',
    },
  ],
  'PHYS301-QUIZ-2026': [
    {
      id: 'q1',
      text: 'Derive the time-independent Schrödinger equation from the classical wave equation and the de Broglie hypothesis.',
    },
    {
      id: 'q2',
      text: 'Explain the physical significance of the wave function collapse upon measurement in the Copenhagen interpretation.',
    },
    {
      id: 'q3',
      text: 'Describe quantum tunneling through a rectangular potential barrier and its practical applications.',
    },
  ],
}

export const DEFAULT_QUESTIONS: Question[] = MOCK_QUESTIONS_BY_EXAM['CS101-FINAL-2026']!
