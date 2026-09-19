import Link from 'next/link'
import { Shield, Lock, Brain, ArrowRight, CheckCircle, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* ─── Animated Background ──────────────────────────────── */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,oklch(0.72_0.19_160_/_0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,oklch(0.65_0.18_200_/_0.06),transparent_50%)]" />
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-chart-2/5 blur-3xl animate-float"
          style={{ animationDelay: '1.5s' }}
        />
      </div>

      {/* ─── Navigation ───────────────────────────────────────── */}
      <nav className="glass sticky top-0 z-50 border-b border-border/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Open<span className="text-primary">-XP</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard"
              id="cta-launch-app"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25"
            >
              Launch App
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ─────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 pt-24 pb-20">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="animate-slide-up mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
            <Zap className="h-3.5 w-3.5" />
            Powered by Solana &amp; AWS
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
            A decentralized examination platform where every answer is hashed on-chain,
            every exam is multi-sig approved, and every grade is AI-verified.
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
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/50 px-8 py-4 text-base font-semibold text-foreground transition-all hover:bg-card hover:-translate-y-1 hover:shadow-lg"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* ─── Features Grid ────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Feature 1: On-Chain Integrity */}
          <div className="group glass rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 transition-colors group-hover:bg-primary/20">
              <Lock className="h-7 w-7 text-primary" />
            </div>
            <h3 className="mb-3 text-xl font-bold">On-Chain Integrity</h3>
            <p className="text-muted-foreground leading-relaxed">
              Every student answer is SHA-256 hashed and recorded on Solana as an immutable receipt.
              No one can tamper with submissions after the fact.
            </p>
            <ul className="mt-4 space-y-2">
              {['Immutable answer hashes', 'PDA-based records', 'Devnet verified'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-primary/70" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Feature 2: Multi-Sig Approval */}
          <div className="group glass rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-chart-2/10 hover:border-chart-2/30">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-chart-2/10 border border-chart-2/20 transition-colors group-hover:bg-chart-2/20">
              <Shield className="h-7 w-7 text-chart-2" />
            </div>
            <h3 className="mb-3 text-xl font-bold">Multi-Sig Approval</h3>
            <p className="text-muted-foreground leading-relaxed">
              Exams go live only after a configurable threshold of examiners approve.
              No single point of failure or unauthorized access.
            </p>
            <ul className="mt-4 space-y-2">
              {['Configurable threshold', 'Examiner verification', 'KMS-gated decryption'].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-chart-2/70" />
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Feature 3: AI-Powered Grading */}
          <div className="group glass rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-chart-3/10 hover:border-chart-3/30">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-chart-3/10 border border-chart-3/20 transition-colors group-hover:bg-chart-3/20">
              <Brain className="h-7 w-7 text-chart-3" />
            </div>
            <h3 className="mb-3 text-xl font-bold">AI-Powered Grading</h3>
            <p className="text-muted-foreground leading-relaxed">
              Answers are graded by Claude 3.5 Sonnet via Amazon Bedrock with deterministic
              temperature for consistent, fair evaluation.
            </p>
            <ul className="mt-4 space-y-2">
              {['Claude 3.5 Sonnet', 'Deterministic scoring', 'Per-question feedback'].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-chart-3/70" />
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* ─── Architecture Section ─────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="glass rounded-2xl p-10">
          <h2 className="mb-6 text-center text-3xl font-bold">
            How It <span className="text-primary">Works</span>
          </h2>
          <div className="grid gap-8 md:grid-cols-4">
            {[
              {
                step: '01',
                title: 'Create Exam',
                desc: 'Authority initializes exam on-chain with multi-sig threshold and examiner list.',
              },
              {
                step: '02',
                title: 'Approve & Go Live',
                desc: 'Examiners approve the exam. Once threshold is met, the KMS-encrypted paper is accessible.',
              },
              {
                step: '03',
                title: 'Submit Answers',
                desc: 'Students decrypt the paper, write answers, and submit. Hash is recorded on Solana.',
              },
              {
                step: '04',
                title: 'AI Grading',
                desc: 'Step Functions pipeline triggers Bedrock Claude to grade answers deterministically.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-lg font-bold text-primary">
                  {item.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────────── */}
      <footer className="border-t border-border/50 py-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 text-primary" />
            Open-XP — Trustless Exam System
          </div>
          <p className="text-sm text-muted-foreground">
            Built on Solana · Powered by AWS
          </p>
        </div>
      </footer>
    </main>
  )
}
