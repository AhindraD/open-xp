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
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="rounded-none p-8 sm:p-12 border border-zinc-800 bg-[#0c0d10]/90 relative">
        {/* Subtle mechanical corner indicators */}
        <div className="absolute top-2 left-2 font-mono text-[10px] text-zinc-600">[SYS_PIPELINE]</div>
        <div className="absolute top-2 right-2 font-mono text-[10px] text-zinc-600">[FLOW_VERIFIED]</div>

        <div className="mx-auto max-w-2xl text-center pt-2">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-white">
            Cryptographic Architecture Pipeline
          </h2>
          <p className="mt-3 text-xs font-mono text-zinc-400">
            Zero-leak envelope encryption bridged to immutable Solana state transitions.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((item) => (
            <div
              key={item.step}
              className="rounded-none p-5 transition-all hover:-translate-y-1 hover:border-zinc-500 border border-zinc-800 bg-zinc-900/40 flex flex-col justify-between group"
            >
              <div>
                <span className="font-mono text-xl font-bold text-zinc-600 group-hover:text-zinc-300 transition-colors">
                  // {item.step}
                </span>
                <h3 className="mt-3 text-sm font-bold text-zinc-200">{item.title}</h3>
                <p className="mt-2 text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-none border border-zinc-700 bg-zinc-900 px-6 py-3 text-xs font-mono font-medium text-zinc-200 hover:bg-zinc-800 hover:border-zinc-500 hover:text-white transition-all"
          >
            EXPLORE ACTIVE EXAMS IN DASHBOARD <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
