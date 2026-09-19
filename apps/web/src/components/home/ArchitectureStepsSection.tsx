import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const STEPS = [
  {
    step: '01',
    title: 'Phase A: Creation & KMS Encryption',
    desc: 'Admin uploads the question paper. Backend encrypts using an AWS KMS Data Key, stores encrypted payload in S3, and registers the PDA on Solana.',
  },
  {
    step: '02',
    title: 'Phase B: Multisig Examiner Quorum',
    desc: 'Examiners approve the exam on-chain. Once the threshold is met, KMS authorizes the decryption key release to authenticated students.',
  },
  {
    step: '03',
    title: 'Phase C: Execution & Hash Commitment',
    desc: 'Student decrypts paper in-memory via Web Crypto API, submits answers to DynamoDB, and signs the SHA-256 hash permanently to Solana.',
  },
  {
    step: '04',
    title: 'Phase D: Bedrock AI Grading Pipeline',
    desc: 'AWS Step Functions triggers Claude 3.5 Sonnet Converse API with strict schemas. Grades and justifications are anchored on-chain.',
  },
]

export function ArchitectureStepsSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="glass rounded-3xl p-8 sm:p-12 lg:p-16 border border-border/60">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How Open-XP Works</h2>
          <p className="mt-4 text-sm text-muted-foreground">
            A seamless bridge between Solana immutability and AWS enterprise scale.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((item) => (
            <div
              key={item.step}
              className="glass rounded-xl p-6 transition-all hover:-translate-y-1 hover:border-primary/30 border border-border/40 flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-3xl font-extrabold text-primary/40">
                  {item.step}
                </span>
                <h3 className="mt-3 text-base font-bold">{item.title}</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            Explore Available Exams in Dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
