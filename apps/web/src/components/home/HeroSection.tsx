import Link from 'next/link'
import { Zap, ArrowRight } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-24 pb-20">
      <div className="flex flex-col items-center text-center">
        {/* Mechanical Tech Badge */}
        <div className="animate-slide-up mb-8 inline-flex items-center gap-2 rounded-none border border-zinc-700/80 bg-zinc-900/80 px-3.5 py-1 text-xs font-mono text-zinc-300">
          <Zap className="h-3 w-3 text-zinc-400" />
          <span>SOLANA DEVNET // AWS BEDROCK // KMS ENCRYPTED</span>
        </div>

        {/* Title with Steel Gradient */}
        <h1
          className="animate-slide-up max-w-4xl text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl text-white"
          style={{ animationDelay: '0.1s' }}
        >
          Trustless Exams.{' '}
          <span className="block mt-1 bg-gradient-to-b from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
            Verifiable Results.
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="animate-slide-up mt-6 max-w-2xl text-base text-zinc-400 leading-relaxed sm:text-lg"
          style={{ animationDelay: '0.2s' }}
        >
          A decentralized examination platform where every paper is KMS envelope-encrypted, every
          answer hash is committed on-chain, and every grade is verified by Bedrock AI. Zero
          tampering. Zero blind trust.
        </p>

        {/* Non-Rounded CTA Buttons */}
        <div
          className="animate-slide-up mt-10 flex flex-col gap-4 sm:flex-row"
          style={{ animationDelay: '0.3s' }}
        >
          <Link
            href="/dashboard"
            id="hero-start-exam"
            className="inline-flex items-center justify-center gap-2 rounded-none border border-white bg-white px-8 py-4 text-sm font-bold uppercase tracking-wider text-black transition-all hover:bg-zinc-200 hover:border-zinc-200 hover:-translate-y-0.5 shadow-xl shadow-white/5 active:scale-[0.99]"
          >
            Start an Exam
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/exam/create"
            className="inline-flex items-center justify-center gap-2 rounded-none border border-zinc-700 bg-zinc-900/90 px-8 py-4 text-sm font-mono font-medium text-zinc-200 transition-all hover:bg-zinc-800 hover:border-zinc-500 hover:text-white hover:-translate-y-0.5 active:scale-[0.99]"
          >
            Create Exam [Admin]
          </Link>
        </div>
      </div>
    </section>
  )
}
