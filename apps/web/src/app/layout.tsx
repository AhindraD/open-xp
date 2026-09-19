import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SolanaProvider } from '@/providers/solana-provider'
import { AuthProvider } from '@/providers/auth-provider'
import { Toaster } from 'sonner'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

export const metadata: Metadata = {
  title: 'Open-XP | Trustless Exam System',
  description:
    'A decentralized, trustless examination platform powered by Solana blockchain and AWS. Tamper-proof answer submissions, multi-sig exam approval, and AI-powered grading.',
  keywords: [
    'blockchain',
    'solana',
    'exam',
    'trustless',
    'web3',
    'education',
    'decentralized',
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <SolanaProvider>
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: 'oklch(0.16 0.025 270)',
                  border: '1px solid oklch(0.25 0.03 270)',
                  color: 'oklch(0.95 0.01 270)',
                },
              }}
            />
          </SolanaProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
