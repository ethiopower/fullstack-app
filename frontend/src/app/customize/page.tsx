import { CustomizationWizard } from '@/components/customize/CustomizationWizard'

export default function CustomizePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <CustomizationWizard />
        </div>
      </div>
    </div>
  )
} 