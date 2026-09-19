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
        <div className="glass rounded-2xl p-8 mb-8 border border-border/60">
          <div className="flex items-start justify-between">
            <div>
              <div className="mb-3">
                <AdminPill />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Create Trustless Exam</h1>
              <p className="mt-2 text-sm text-muted-foreground max-w-2xl leading-relaxed">
                Upload and encrypt exam question papers using <strong>AWS KMS (AES-256-GCM)</strong>,
                store the ciphertext in <strong>Amazon S3</strong>, and anchor the multisig verification
                quorum on <strong>Solana Devnet</strong>.
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
              <Lock className="h-7 w-7 text-primary" />
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
