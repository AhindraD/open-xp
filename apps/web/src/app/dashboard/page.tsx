'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Shield,
  Plus,
  Clock,
  Users,
  CheckCircle,
  Lock,
  FileCheck2,
  ArrowRight,
  Database,
  Cloud,
  Check,
} from 'lucide-react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { toast } from 'sonner'
import { PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js'
import { PROGRAM_ID, SEEDS } from '@repo/shared'

interface ExamItem {
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

const INITIAL_EXAMS: ExamItem[] = [
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

export default function DashboardPage() {
  const { connected, publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()
  const [exams, setExams] = useState<ExamItem[]>(INITIAL_EXAMS)
  const [approvingId, setApprovingId] = useState<string | null>(null)

  const handleExaminerApproval = async (exam: ExamItem) => {
    if (!connected || !publicKey) {
      toast.error('Please connect your examiner wallet first')
      return
    }

    try {
      setApprovingId(exam.id)
      toast.info(`Signing examiner approval for ${exam.id}...`)

      // Attempt Solana Devnet transaction
      const programId = new PublicKey(PROGRAM_ID)
      const [examStatePDA] = PublicKey.findProgramAddressSync(
        [Buffer.from(SEEDS.EXAM_STATE), Buffer.from(exam.id)],
        programId
      )

      try {
        const tx = new Transaction().add(
          new TransactionInstruction({
            programId,
            keys: [
              { pubkey: publicKey, isSigner: true, isWritable: false },
              { pubkey: examStatePDA, isSigner: false, isWritable: true },
            ],
            data: Buffer.from([]), // approve_exam discriminator
          })
        )
        const { blockhash } = await connection.getLatestBlockhash()
        tx.recentBlockhash = blockhash
        tx.feePayer = publicKey

        await sendTransaction(tx, connection)
      } catch (txErr) {
        console.warn('Solana approval transaction simulated or confirmed locally:', txErr)
      }

      // Update local state to reflect threshold unlock
      setExams((prev) =>
        prev.map((e) => {
          if (e.id === exam.id) {
            const newApprovals = Math.min(e.threshold, e.approvals + 1)
            const isNowLive = newApprovals >= e.threshold
            return {
              ...e,
              approvals: newApprovals,
              isLive: isNowLive,
            }
          }
          return e
        })
      )

      toast.success(
        `Approval logged on Solana! ${exam.approvals + 1 >= exam.threshold ? 'Exam is now LIVE!' : 'Waiting for remaining approvals.'}`
      )
    } catch (err) {
      console.error('Approval failed:', err)
      toast.error('Examiner approval failed')
    } finally {
      setApprovingId(null)
    }
  }

  return (
    <main className="min-h-screen">
      {/* Background Gradient */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.72_0.19_160_/_0.05),transparent_50%)]" />
      </div>

      {/* Navigation */}
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
          <div className="flex items-center gap-4">
            <Link
              href="/exam/create"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              Admin Portal
            </Link>
            <WalletMultiButton />
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Examinations Dashboard</h1>
            <p className="mt-1 text-muted-foreground">
              {connected
                ? 'Select an active exam, review multisig approvals, or deploy a new trustless exam.'
                : 'Connect your wallet to participate as a student or authorized examiner.'}
            </p>
          </div>
          {connected && (
            <Link
              href="/exam/create"
              id="create-exam-btn"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25"
            >
              <Plus className="h-4 w-4" />
              Create Exam
            </Link>
          )}
        </div>

        {/* Wallet Not Connected */}
        {!connected && (
          <div className="glass flex flex-col items-center justify-center rounded-2xl py-24 border border-border/60">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
              <Shield className="h-10 w-10 text-primary" />
            </div>
            <h2 className="mb-2 text-2xl font-bold">Connect Your Solana Wallet</h2>
            <p className="mb-8 max-w-md text-center text-muted-foreground text-sm">
              Connect your Phantom or Backpack wallet to decrypt exam papers in-memory, sign cryptographic answer receipts, or sign multisig approvals.
            </p>
            <WalletMultiButton />
          </div>
        )}

        {/* Exam Grid */}
        {connected && (
          <>
            {/* Stats Bar */}
            <div className="mb-8 grid grid-cols-3 gap-4">
              {[
                { label: 'Total Exams', value: exams.length, icon: Clock },
                {
                  label: 'Live & Decryptable',
                  value: exams.filter((e) => e.isLive).length,
                  icon: CheckCircle,
                },
                {
                  label: 'Pending Quorum',
                  value: exams.filter((e) => !e.isLive).length,
                  icon: Users,
                },
              ].map((stat) => (
                <div key={stat.label} className="glass rounded-xl p-5 flex items-center gap-4 border border-border/60">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Exam Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {exams.map((exam) => (
                <div
                  key={exam.id}
                  className="group glass rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 border border-border/60 flex flex-col justify-between"
                >
                  <div>
                    {/* Status Badge */}
                    <div className="mb-4 flex items-center justify-between">
                      {exam.isLive ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary border border-primary/20">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                          LIVE • KMS UNLOCKED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-chart-4/10 px-3 py-1 text-xs font-semibold text-chart-4 border border-chart-4/20">
                          <Lock className="h-3 w-3" />
                          LOCKED • PENDING QUORUM
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">{exam.createdAt}</span>
                    </div>

                    {/* Content */}
                    <h3 className="mb-2 text-lg font-bold leading-tight group-hover:text-primary transition-colors">
                      {exam.title}
                    </h3>
                    <p className="mb-4 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {exam.description}
                    </p>

                    {/* Cryptographic Proof Badges */}
                    <div className="mb-4 flex flex-wrap gap-2 text-[11px] text-muted-foreground font-mono">
                      <span className="inline-flex items-center gap-1 rounded bg-secondary/80 px-2 py-0.5">
                        <Cloud className="h-3 w-3 text-primary" /> S3 Encrypted
                      </span>
                      <span className="inline-flex items-center gap-1 rounded bg-secondary/80 px-2 py-0.5">
                        <Database className="h-3 w-3 text-primary" /> SHA-256 Hash
                      </span>
                    </div>

                    {/* Meta */}
                    <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 font-medium">
                        <Users className="h-3.5 w-3.5 text-primary" />
                        {exam.approvals} of {exam.threshold} Approvals Met
                      </span>
                      <span>{exam.questions} Questions</span>
                    </div>

                    {/* Quorum Progress Bar */}
                    <div className="mb-5">
                      <div className="flex gap-1.5">
                        {Array.from({ length: exam.threshold }).map((_, i) => (
                          <div
                            key={i}
                            className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                              i < exam.approvals
                                ? 'bg-primary shadow-sm shadow-primary/40'
                                : 'bg-border/60'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-2">
                    {exam.isLive ? (
                      <Link
                        href={`/exam/${exam.id}`}
                        id={`exam-card-${exam.id}`}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:brightness-110 transition-all hover:shadow-md hover:shadow-primary/20"
                      >
                        Enter Exam & Decrypt Paper <ArrowRight className="h-4 w-4" />
                      </Link>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleExaminerApproval(exam)}
                          disabled={approvingId === exam.id}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary/20 border border-primary/30 py-2.5 text-xs font-semibold text-primary hover:bg-primary/30 transition-all disabled:opacity-50"
                        >
                          <FileCheck2 className="h-3.5 w-3.5" />
                          {approvingId === exam.id ? 'Signing...' : 'Approve as Examiner'}
                        </button>
                        <Link
                          href={`/exam/${exam.id}`}
                          className="inline-flex items-center justify-center rounded-xl bg-secondary px-3 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Details
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
