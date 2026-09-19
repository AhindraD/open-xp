import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { SolanaProvider } from '@/providers/solana-provider'
import { AuthProvider } from '@/providers/auth-provider'
import { Toaster } from 'sonner'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
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
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <AuthProvider>
          <SolanaProvider>
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: '#0c0d10',
                  border: '1px solid #23262e',
                  borderRadius: '0px',
                  color: '#f4f4f6',
                  fontFamily: 'var(--font-geist-sans), sans-serif',
                },
              }}
            />
          </SolanaProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
