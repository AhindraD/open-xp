export interface ExamItem {
  id: string
  title: string
  description: string
  isLive: boolean
  examiners: number
  approvals: number
  threshold: number
  createdAt: string
  questions: number
  s3Uri: string
}

export const MOCK_EXAMS: ExamItem[] = [
  {
    id: 'CS101-FINAL-2026',
    title: 'Computer Science 101 — Final Exam',
    description: 'Comprehensive exam covering data structures, algorithms, and complexity analysis.',
    isLive: true,
    examiners: 3,
    approvals: 3,
    threshold: 2,
    createdAt: '2026-09-15',
    questions: 4,
    s3Uri: 's3://open-xp-exams/CS101-FINAL-2026/paper.enc.json',
  },
  {
    id: 'MATH201-MID-2026',
    title: 'Linear Algebra — Midterm',
    description: 'Matrix operations, eigenvalues, vector spaces, and linear transformations.',
    isLive: true,
    examiners: 2,
    approvals: 2,
    threshold: 2,
    createdAt: '2026-09-10',
    questions: 3,
    s3Uri: 's3://open-xp-exams/MATH201-MID-2026/paper.enc.json',
  },
  {
    id: 'PHYS301-QUIZ-2026',
    title: 'Quantum Mechanics — Quiz 3',
    description: 'Schrödinger equation, wave functions, and quantum operators.',
    isLive: false,
    examiners: 3,
    approvals: 1,
    threshold: 2,
    createdAt: '2026-09-18',
    questions: 3,
    s3Uri: 's3://open-xp-exams/PHYS301-QUIZ-2026/paper.enc.json',
  },
]
