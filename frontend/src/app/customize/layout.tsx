'use client';

import { usePathname } from 'next/navigation';

const steps = [
  { id: 1, name: 'Demographics', path: '/customize/step1' },
  { id: 2, name: 'Design', path: '/customize/step2' },
  { id: 3, name: 'Measurements', path: '/customize/step3' },
  { id: 4, name: 'Review', path: '/customize/step4' },
  { id: 5, name: 'Checkout', path: '/customize/step5' },
];

export default function CustomizeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentStep = steps.findIndex(step => step.path === pathname) + 1;

  return (
    <div className="min-h-screen bg-slate-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <nav aria-label="Progress" className="mb-8">
          <ol role="list" className="flex items-center">
            {steps.map((step, stepIdx) => (
              <li
                key={step.name}
                className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}
              >
                <div className="flex items-center">
                  <div
                    className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                      step.id <= currentStep
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-300 bg-white text-slate-500'
                    }`}
                  >
                    <span className="text-sm font-medium">{step.id}</span>
                  </div>
                  {stepIdx !== steps.length - 1 && (
                    <div
                      className={`absolute top-4 h-0.5 w-full ${
                        step.id < currentStep ? 'bg-slate-900' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>
                <div className="mt-2">
                  <span
                    className={`text-sm font-medium ${
                      step.id <= currentStep ? 'text-slate-900' : 'text-slate-500'
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </nav>

        {/* Content */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
          {children}
        </div>
      </div>
    </div>
  );
} 