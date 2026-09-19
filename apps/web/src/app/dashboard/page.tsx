'use client'

import Link from 'next/link'
import { Shield, Plus, Clock, Users, CheckCircle, XCircle, ArrowRight } from 'lucide-react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

// Mock exam data for V1 — will be fetched from DynamoDB via API in production
const MOCK_EXAMS = [
  {
    id: 'CS101-FINAL-2026',
    title: 'Computer Science 101 — Final Exam',
    description: 'Comprehensive exam covering data structures, algorithms, and complexity analysis.',
    isLive: true,
    examiners: 3,
    approvals: 3,
    threshold: 2,
    createdAt: '2026-09-15',
    questions: 12,
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
    questions: 8,
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
    questions: 5,
  },
]

export default function DashboardPage() {
  const { connected } = useWallet()

  return (
    <main className="min-h-screen">
      {/* ─── Background ───────────────────────────────────────── */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.72_0.19_160_/_0.05),transparent_50%)]" />
      </div>

      {/* ─── Navigation ───────────────────────────────────────── */}
      <nav className="glass sticky top-0 z-50 border-b border-border/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Open<span className="text-primary">-XP</span>
            </span>
          </Link>
          <WalletMultiButton />
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* ─── Header ─────────────────────────────────────────── */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="mt-1 text-muted-foreground">
              {connected ? 'Browse available exams or create a new one.' : 'Connect your wallet to get started.'}
            </p>
          </div>
          {connected && (
            <button
              id="create-exam-btn"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25"
            >
              <Plus className="h-4 w-4" />
              Create Exam
            </button>
          )}
        </div>

        {/* ─── Wallet Not Connected ───────────────────────────── */}
        {!connected && (
          <div className="glass flex flex-col items-center justify-center rounded-2xl py-24">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
              <Shield className="h-10 w-10 text-primary" />
            </div>
            <h2 className="mb-2 text-2xl font-bold">Connect Your Wallet</h2>
            <p className="mb-8 max-w-md text-center text-muted-foreground">
              Connect your Solana wallet to access exams, submit answers, and view your on-chain answer receipts.
            </p>
            <WalletMultiButton />
          </div>
        )}

        {/* ─── Exam Grid ──────────────────────────────────────── */}
        {connected && (
          <>
            {/* Stats Bar */}
            <div className="mb-8 grid grid-cols-3 gap-4">
              {[
                { label: 'Total Exams', value: MOCK_EXAMS.length, icon: Clock },
                { label: 'Live Now', value: MOCK_EXAMS.filter((e) => e.isLive).length, icon: CheckCircle },
                { label: 'Pending Approval', value: MOCK_EXAMS.filter((e) => !e.isLive).length, icon: Users },
              ].map((stat) => (
                <div key={stat.label} className="glass rounded-xl p-5 flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Exam Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {MOCK_EXAMS.map((exam) => (
                <div
                  key={exam.id}
                  className="group glass rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20"
                >
                  {/* Status Badge */}
                  <div className="mb-4 flex items-center justify-between">
                    {exam.isLive ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary border border-primary/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                        LIVE
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-chart-4/10 px-3 py-1 text-xs font-semibold text-chart-4 border border-chart-4/20">
                        <Clock className="h-3 w-3" />
                        PENDING
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">{exam.createdAt}</span>
                  </div>

                  {/* Content */}
                  <h3 className="mb-2 text-lg font-bold leading-tight group-hover:text-primary transition-colors">
                    {exam.title}
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {exam.description}
                  </p>

                  {/* Meta */}
                  <div className="mb-5 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {exam.approvals}/{exam.threshold} approvals
                    </span>
                    <span>{exam.questions} questions</span>
                  </div>

                  {/* Approval Progress */}
                  <div className="mb-5">
                    <div className="flex gap-1">
                      {Array.from({ length: exam.threshold }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full transition-colors ${
                            i < exam.approvals ? 'bg-primary' : 'bg-border'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Action */}
                  <Link
                    href={`/exam/${exam.id}`}
                    id={`exam-card-${exam.id}`}
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${
                      exam.isLive
                        ? 'bg-primary text-primary-foreground hover:brightness-110'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {exam.isLive ? (
                      <>
                        Take Exam <ArrowRight className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        View Details <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
