'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type OrderSummary = {
  subtotal: number;
  deposit: number;
  balance: number;
};

type CustomerInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes: string;
};

export default function Step5() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
  });

  useEffect(() => {
    // Load order summary from session storage
    if (typeof window === 'undefined') return;
    
    const storedSummary = sessionStorage.getItem('orderSummary');
    if (!storedSummary) {
      router.push('/customize/step4');
      return;
    }

    try {
      setOrderSummary(JSON.parse(storedSummary));
    } catch (error) {
      console.error('Error parsing order summary:', error);
      router.push('/customize/step4');
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone.replace(/[^\d]/g, ''));
  };

  const handleBack = () => {
    router.push('/customize/step4');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validatePhone(customerInfo.phone)) {
      alert('Please enter a valid 10-digit phone number');
      setIsSubmitting(false);
      return;
    }

    try {
      // Get all data from session storage
      if (typeof window === 'undefined') return;
      
      const designs = JSON.parse(sessionStorage.getItem('selectedDesigns')!);
      const measurements = JSON.parse(sessionStorage.getItem('measurements')!);

      // Create order
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: customerInfo,
          designs,
          measurements,
          deposit: orderSummary?.deposit || 0,
          balance: orderSummary?.balance || 0,
          status: 'pending',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const { orderId } = await response.json();

      // Clear session storage
      if (typeof window !== 'undefined') {
        sessionStorage.clear();
      }

      // Redirect to confirmation page
      router.push(`/order-confirmation/${orderId}`);
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred during checkout. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!orderSummary) return null;

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-medium text-slate-900 mb-2">Checkout</h2>
        <p className="text-slate-600">
          Please provide your contact information to complete your order
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-slate-900">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              value={customerInfo.firstName}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-slate-900 focus:ring-slate-900"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-slate-900">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              value={customerInfo.lastName}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-slate-900 focus:ring-slate-900"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-900">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={customerInfo.email}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-slate-900 focus:ring-slate-900"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-900">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              value={customerInfo.phone}
              onChange={handleInputChange}
              placeholder="(123) 456-7890"
              className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-slate-900 focus:ring-slate-900"
            />
          </div>
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-slate-900">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            required
            value={customerInfo.address}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-slate-900 focus:ring-slate-900"
          />
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-slate-900">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            required
            value={customerInfo.city}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-slate-900 focus:ring-slate-900"
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-slate-900">
            Special Instructions (Optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={customerInfo.notes}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-slate-900 focus:ring-slate-900"
          />
        </div>

        {/* Order Summary */}
        <div className="bg-slate-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-slate-900 mb-4">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span>${orderSummary.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-900 font-medium">
              <span>Required Deposit (50%):</span>
              <span>${orderSummary.deposit.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600 border-t border-slate-200 pt-2 mt-2">
              <span>Balance Due at Pickup:</span>
              <span>${orderSummary.balance.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={handleBack}
            disabled={isSubmitting}
            className="px-6 py-2 text-slate-600 font-medium hover:text-slate-900 disabled:opacity-50"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 disabled:opacity-50"
          >
            {isSubmitting ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
} 