import Link from 'next/link'
import { Zap, ArrowRight } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-24 pb-20">
      <div className="flex flex-col items-center text-center">
        {/* Badge */}
        <div className="animate-slide-up mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
          <Zap className="h-3.5 w-3.5" />
          Powered by Solana &amp; AWS Bedrock
        </div>

        {/* Title */}
        <h1
          className="animate-slide-up max-w-4xl text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl"
          style={{ animationDelay: '0.1s' }}
        >
          Trustless Exams.{' '}
          <span className="bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent animate-gradient">
            Verifiable Results.
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="animate-slide-up mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed sm:text-xl"
          style={{ animationDelay: '0.2s' }}
        >
          A decentralized examination platform where every paper is KMS envelope-encrypted,
          every answer hash is committed on-chain, and every grade is verified by Bedrock AI.
          No tampering. No trust required.
        </p>

        {/* CTA Buttons */}
        <div
          className="animate-slide-up mt-10 flex flex-col gap-4 sm:flex-row"
          style={{ animationDelay: '0.3s' }}
        >
          <Link
            href="/dashboard"
            id="hero-start-exam"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground transition-all hover:brightness-110 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30 animate-pulse-glow"
          >
            Start an Exam
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/exam/create"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/50 px-8 py-4 text-base font-semibold text-foreground transition-all hover:bg-card hover:-translate-y-1 hover:shadow-lg"
          >
            Create Exam (Admin)
          </Link>
        </div>
      </div>
    </section>
  )
}
