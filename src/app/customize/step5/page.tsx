'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface OrderSummary {
  subtotal: number
  deposit: number
  balance: number
}

interface CustomerInfo {
  name: string
  phone: string
  email: string
  address: string
}

export default function Step5() {
  const router = useRouter()
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    email: '',
    address: '',
  })

  useEffect(() => {
    // Load order summary from session storage
    const storedSummary = sessionStorage.getItem('orderSummary')
    if (!storedSummary) {
      router.push('/customize/step4')
      return
    }

    try {
      const summary = JSON.parse(storedSummary) as OrderSummary
      setOrderSummary(summary)
    } catch (error) {
      console.error('Error parsing order summary:', error)
      router.push('/customize/step4')
    }
  }, [router])

  const validatePhone = (phone: string) => {
    // Remove any non-digit characters
    const digits = phone.replace(/\D/g, '')
    return digits.length === 10
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!validatePhone(customerInfo.phone)) {
      toast.error('Please enter a valid 10-digit phone number')
      setIsSubmitting(false)
      return
    }

    try {
      // Get all data from session storage
      const designs = JSON.parse(sessionStorage.getItem('selectedDesigns')!)
      const measurements = JSON.parse(sessionStorage.getItem('measurements')!)

      // Create customer first
      const customerResponse = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerInfo),
      })

      if (!customerResponse.ok) throw new Error('Failed to create customer')

      // Create order
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: customerInfo.phone,
          status: 'Open',
          downPayment: orderSummary?.deposit || 0,
          balance: orderSummary?.balance || 0,
          designs,
          measurements,
        }),
      })

      if (!orderResponse.ok) throw new Error('Failed to create order')

      const { order_id } = await orderResponse.json()

      // Clear session storage
      sessionStorage.clear()

      // Redirect to confirmation page
      router.push(`/order-confirmation/${order_id}`)
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error('An error occurred during checkout. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!orderSummary) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-8">Checkout</h2>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-medium mb-4">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${orderSummary.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-indigo-600 font-medium">
              <span>Required Deposit (50%):</span>
              <span>${orderSummary.deposit.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span>Balance Due at Pickup:</span>
              <span>${orderSummary.balance.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              required
              value={customerInfo.name}
              onChange={(e) =>
                setCustomerInfo((prev) => ({ ...prev, name: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number (10 digits)
            </label>
            <input
              type="tel"
              id="phone"
              required
              pattern="[0-9]{10}"
              value={customerInfo.phone}
              onChange={(e) =>
                setCustomerInfo((prev) => ({ ...prev, phone: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              required
              value={customerInfo.email}
              onChange={(e) =>
                setCustomerInfo((prev) => ({ ...prev, email: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Shipping Address
            </label>
            <textarea
              id="address"
              required
              rows={3}
              value={customerInfo.address}
              onChange={(e) =>
                setCustomerInfo((prev) => ({ ...prev, address: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="mt-8 flex justify-between">
            <Link
              href="/customize/step4"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Back
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-md text-white ${
                isSubmitting
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isSubmitting ? 'Processing...' : 'Pay Deposit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 