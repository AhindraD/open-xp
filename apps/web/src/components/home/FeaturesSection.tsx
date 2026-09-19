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
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid gap-8 md:grid-cols-3">
        {FEATURES.map((feature, index) => (
          <div
            key={feature.title}
            className="group glass relative rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 border border-border/60"
            style={{ animationDelay: `${index * 0.15}s` }}
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 transition-colors group-hover:bg-primary/20">
              <feature.icon className="h-7 w-7 text-primary" />
            </div>
            <h3 className="mb-3 text-xl font-bold tracking-tight">{feature.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
