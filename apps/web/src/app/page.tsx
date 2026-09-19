import { Navbar } from '@/components/layout/Navbar'
import { BackgroundGradients } from '@/components/layout/BackgroundGradients'
import { HeroSection } from '@/components/home/HeroSection'
import { FeaturesSection } from '@/components/home/FeaturesSection'
import { ArchitectureStepsSection } from '@/components/home/ArchitectureStepsSection'
import { Footer } from '@/components/layout/Footer'

export default function HomePage() {
  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col justify-between">
      <BackgroundGradients />
      <Navbar showAdminPortal maxWidth="max-w-7xl" />
      <HeroSection />
      <FeaturesSection />
      <ArchitectureStepsSection />
      <Footer />
    </main>
  )
}
