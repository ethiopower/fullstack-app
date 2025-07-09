'use client'

import { usePathname } from 'next/navigation'

const steps = [
  { id: 1, name: 'Demographics', path: '/customize/step1' },
  { id: 2, name: 'Design', path: '/customize/step2' },
  { id: 3, name: 'Measurements', path: '/customize/step3' },
  { id: 4, name: 'Review', path: '/customize/step4' },
  { id: 5, name: 'Checkout', path: '/customize/step5' },
]

export default function CustomizeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const currentStep = steps.findIndex(step => step.path === pathname) + 1

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-4 px-4 sm:px-6 lg:px-8">
        <nav aria-label="Progress">
          <ol role="list" className="flex items-center justify-center">
            {steps.map((step, stepIdx) => (
              <li key={step.name} className={stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}>
                <div className="relative flex items-center">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      step.id < currentStep
                        ? 'bg-indigo-600'
                        : step.id === currentStep
                        ? 'border-2 border-indigo-600'
                        : 'border-2 border-gray-300'
                    }`}
                  >
                    <span
                      className={`text-sm font-medium ${
                        step.id < currentStep
                          ? 'text-white'
                          : step.id === currentStep
                          ? 'text-indigo-600'
                          : 'text-gray-500'
                      }`}
                    >
                      {step.id}
                    </span>
                  </span>
                  {stepIdx !== steps.length - 1 && (
                    <div
                      className={`absolute top-4 w-full h-0.5 -translate-y-1/2 ${
                        step.id < currentStep ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}
                      style={{ left: '100%', width: '3rem' }}
                    />
                  )}
                </div>
                <span
                  className="absolute mt-2 w-max text-xs font-medium"
                  style={{ marginLeft: '-1rem' }}
                >
                  {step.name}
                </span>
              </li>
            ))}
          </ol>
        </nav>
      </div>
      <main>{children}</main>
    </div>
  )
} 