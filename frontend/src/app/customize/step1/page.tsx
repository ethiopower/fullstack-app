'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type CategoryQuantity = {
  men: number;
  women: number;
  boys: number;
  girls: number;
};

export default function Step1() {
  const router = useRouter();
  const [quantities, setQuantities] = useState<CategoryQuantity>({
    men: 0,
    women: 0,
    boys: 0,
    girls: 0,
  });

  const totalItems = Object.values(quantities).reduce((a, b) => a + b, 0);

  const handleQuantityChange = (category: keyof CategoryQuantity, value: number) => {
    setQuantities(prev => ({
      ...prev,
      [category]: Math.max(0, value),
    }));
  };

  const handleNext = () => {
    if (totalItems > 0) {
      sessionStorage.setItem('orderQuantities', JSON.stringify(quantities));
      router.push('/customize/step2');
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-medium text-slate-900 mb-2">Select Quantities</h2>
        <p className="text-slate-600">
          How many items would you like to customize for each category?
        </p>
      </div>

      <div className="space-y-6 max-w-md mx-auto">
        {Object.entries(quantities).map(([category, quantity]) => (
          <div key={category} className="flex items-center justify-between">
            <label className="text-lg font-medium text-slate-900 capitalize">
              {category}
            </label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleQuantityChange(category as keyof CategoryQuantity, quantity - 1)}
                className="rounded-full w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                -
              </button>
              <span className="w-8 text-center text-lg font-medium">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(category as keyof CategoryQuantity, quantity + 1)}
                className="rounded-full w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                +
              </button>
            </div>
          </div>
        ))}

        <div className="mt-8 border-t pt-6">
          <div className="flex justify-between items-center text-lg font-medium">
            <span>Total Items:</span>
            <span>{totalItems}</span>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={handleNext}
            disabled={totalItems === 0}
            className={`w-full px-6 py-3 text-center text-white font-medium tracking-wider rounded-lg transition-all duration-200 ${
              totalItems === 0
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