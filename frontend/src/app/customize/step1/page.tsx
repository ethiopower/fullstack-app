'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Gender = 'men' | 'women';

export default function Step1() {
  const router = useRouter();
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);

  const handleNext = () => {
    if (selectedGender) {
      sessionStorage.setItem('selectedGender', selectedGender);
      router.push('/customize/step2');
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-medium text-slate-900 mb-2">Select Your Designs</h2>
        <p className="text-slate-600">
          Choose designs for each category based on your selections
        </p>
      </div>

      <div className="space-y-6 max-w-md mx-auto">
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setSelectedGender('men')}
            className={`px-8 py-3 rounded-full text-lg font-medium transition-all duration-200 ${
              selectedGender === 'men'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Men
          </button>
          <button
            onClick={() => setSelectedGender('women')}
            className={`px-8 py-3 rounded-full text-lg font-medium transition-all duration-200 ${
              selectedGender === 'women'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Women
          </button>
        </div>

        <div className="mt-8">
          <button
            onClick={handleNext}
            disabled={!selectedGender}
            className={`w-full px-6 py-3 text-center text-white font-medium tracking-wider rounded-lg transition-all duration-200 ${
              !selectedGender
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-slate-900 hover:bg-slate-800'
            }`}
          >
            Continue to Design Selection
          </button>
        </div>
      </div>
    </div>
  );
} 