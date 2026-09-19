import { Shield, Lock, Brain } from 'lucide-react'

const FEATURES = [
  {
    icon: Lock,
    title: 'Zero-Leak Gating',
    description:
      'Question papers are envelope-encrypted with AWS KMS. The decryption key is locked until an on-chain multisig threshold of examiners sign approval.',
  },
  {
    icon: Shield,
    title: 'Anti-Tamper On-Chain Proofs',
    description:
      'Answers are securely stored off-chain in DynamoDB while their cryptographic SHA-256 hashes are anchored to Solana PDAs as immutable receipts.',
  },
  {
    icon: Brain,
    title: 'Transparent AI Grading',
    description:
      'Amazon Bedrock (Claude 3.5 Sonnet) evaluates subjective answers via the Converse API with guaranteed strict schemas and on-chain EvaluationHash receipts.',
  },
]

export function FeaturesSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid gap-6 md:grid-cols-3">
        {FEATURES.map((feature, index) => (
          <div
            key={feature.title}
            className="group relative rounded-none p-8 border border-zinc-800 bg-[#0c0d10]/90 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-600 hover:shadow-xl hover:shadow-white/[0.02]"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Top-right mechanical corner cross */}
            <div className="absolute top-3 right-3 font-mono text-[10px] text-zinc-600 group-hover:text-zinc-400 transition-colors">
              +
            </div>

            {/* Icon Box */}
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-none bg-zinc-900 border border-zinc-700 text-zinc-200 group-hover:border-zinc-400 group-hover:text-white transition-colors">
              <feature.icon className="h-6 w-6 text-zinc-300" />
            </div>

            {/* Card Index */}
            <div className="mb-2 font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
              SYSTEM MODULE 0{index + 1}
            </div>

            {/* Title */}
            <h3 className="mb-3 text-lg font-bold tracking-tight text-white">{feature.title}</h3>

            {/* Description */}
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
