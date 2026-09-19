export const MOCK_EXAMINERS: string[] = [
  '4Nd1mBQtrMJVYVfKf2PJy9NZ268dFYq3CeZuN2nXG58E',
  '8Wk1xVqUq8zW3xP4qA5X7yZ8aB9cDEF1234567890123',
  '3Fk2yWqRr9aV4yQ5rB6Y8zA9bC0dEFG2345678901234',
]

export const MOCK_NEW_EXAM_PREFILL = {
  examId: 'CS202-FINAL-2026',
  title: 'Distributed Systems & Consensus Final',
  description:
    'Formal evaluation of Byzantine fault tolerance, Raft consensus, and cryptographic proofs.',
  threshold: 2,
  paperContent: JSON.stringify(
    [
      {
        id: 'q1',
        text: 'Compare and contrast Proof of Work (PoW) and Proof of Stake (PoS) in terms of Sybil resistance and energy finality.',
      },
      {
        id: 'q2',
        text: 'Explain the Byzantine Generals Problem and how asynchronous consensus models achieve safety over liveness.',
      },
      {
        id: 'q3',
        text: 'Describe how zero-knowledge proofs (zk-SNARKs) guarantee verification without revealing confidential state.',
      },
    ],
    null,
    2,
  ),
}
