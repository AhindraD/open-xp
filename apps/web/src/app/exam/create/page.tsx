'use client'

import { Lock } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { BackgroundGradients } from '@/components/layout/BackgroundGradients'
import { WalletGuard } from '@/components/common/WalletGuard'
import { AdminPill } from '@/components/common/StatusBadge'
import { ExamMetadataForm } from '@/components/exam-create/ExamMetadataForm'
import { ExaminerQuorumList } from '@/components/exam-create/ExaminerQuorumList'
import { QuestionPaperEditor } from '@/components/exam-create/QuestionPaperEditor'
import { CreateExamSubmitBar } from '@/components/exam-create/CreateExamSubmitBar'
import { Footer } from '@/components/layout/Footer'
import { useCreateExam } from '@/hooks/useCreateExam'

export default function CreateExamPage() {
  const {
    examId,
    setExamId,
    title,
    setTitle,
    description,
    setDescription,
    threshold,
    setThreshold,
    examiners,
    addExaminer,
    removeExaminer,
    updateExaminer,
    paperContent,
    setPaperContent,
    isSubmitting,
    statusMessage,
    createdS3Uri,
    handleCreate,
    connected,
  } = useCreateExam()

  return (
    <main className="min-h-screen flex flex-col justify-between">
      <BackgroundGradients />
      <Navbar showBackToDashboard maxWidth="max-w-4xl" />

      <div className="mx-auto max-w-4xl px-6 py-10 w-full flex-1">
        {/* Header */}
        <div className="rounded-none p-6 sm:p-8 mb-8 border border-zinc-800 bg-[#0c0d10]/95 relative">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-3">
                <AdminPill />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Create Trustless Exam
              </h1>
              <p className="mt-2 text-xs text-zinc-400 max-w-2xl leading-relaxed">
                Upload and encrypt exam question papers using{' '}
                <strong className="text-zinc-200">AWS KMS (AES-256-GCM)</strong>, store the
                ciphertext in <strong className="text-zinc-200">Amazon S3</strong>, and anchor the
                multisig verification quorum on{' '}
                <strong className="text-zinc-200">Solana Devnet</strong>.
              </p>
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-none bg-zinc-900 border border-zinc-700 text-zinc-200">
              <Lock className="h-6 w-6 text-zinc-300" />
            </div>
          </div>
        </div>

        {!connected ? (
          <WalletGuard
            title="Admin Authority Wallet Required"
            description="Connect your Solana wallet to act as the Exam Authority and initialize the on-chain ExamState account."
          />
        ) : (
          <form onSubmit={handleCreate} className="space-y-6">
            <ExamMetadataForm
              examId={examId}
              title={title}
              description={description}
              onExamIdChange={setExamId}
              onTitleChange={setTitle}
              onDescriptionChange={setDescription}
            />

            <ExaminerQuorumList
              examiners={examiners}
              threshold={threshold}
              onAddExaminer={addExaminer}
              onRemoveExaminer={removeExaminer}
              onUpdateExaminer={updateExaminer}
              onThresholdChange={setThreshold}
            />

            <QuestionPaperEditor
              paperContent={paperContent}
              onPaperContentChange={setPaperContent}
            />

            <CreateExamSubmitBar
              isSubmitting={isSubmitting}
              statusMessage={statusMessage}
              createdS3Uri={createdS3Uri}
            />
          </form>
        )}
      </div>

      <Footer />
    </main>
  )
}
