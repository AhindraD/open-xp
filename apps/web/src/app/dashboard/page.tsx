'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { Navbar } from '@/components/layout/Navbar'
import { BackgroundGradients } from '@/components/layout/BackgroundGradients'
import { WalletGuard } from '@/components/common/WalletGuard'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { DashboardStatsBar } from '@/components/dashboard/DashboardStatsBar'
import { ExamGrid } from '@/components/dashboard/ExamGrid'
import { Footer } from '@/components/layout/Footer'
import { useExaminerApproval } from '@/hooks/useExaminerApproval'
import { MOCK_EXAMS } from '@/data/mock'

export default function DashboardPage() {
  const { connected, publicKey } = useWallet()
  const isWalletConnected = Boolean(connected || !!publicKey)
  const { exams, approvingId, handleExaminerApproval } = useExaminerApproval(MOCK_EXAMS)

  return (
    <main className="min-h-screen flex flex-col justify-between">
      <BackgroundGradients />
      <Navbar showAdminPortal maxWidth="max-w-7xl" />

      <div className="mx-auto max-w-7xl px-6 py-10 w-full flex-1">
        <DashboardHeader connected={isWalletConnected} />

        {!isWalletConnected ? (
          <WalletGuard
            title="Connect Your Solana Wallet"
            description="Connect your Phantom or Backpack wallet to access exams, submit answers, or sign multisig approvals."
          />
        ) : (
          <>
            <DashboardStatsBar exams={exams} />
            <ExamGrid
              exams={exams}
              approvingId={approvingId}
              onApprove={handleExaminerApproval}
            />
          </>
        )}
      </div>

      <Footer />
    </main>
  )
}
