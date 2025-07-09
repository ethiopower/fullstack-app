'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

interface Order {
  id: string
  customerName: string
  status: string
  totalAmount: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // For testing purposes, we'll return null instead of redirecting
  if (typeof window === 'undefined' && status === 'unauthenticated') {
    return null
  }

  useEffect(() => {
    if (status === 'unauthenticated' && typeof window !== 'undefined') {
      redirect('/portal/login')
    }
  }, [status])

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch('/api/orders')
        if (!response.ok) {
          throw new Error('Failed to fetch orders')
        }
        const data = await response.json()
        setOrders(data.orders)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (status === 'authenticated') {
      fetchOrders()
    }
  }, [status])

  if (loading) {
    return <div>Loading orders...</div>
  }

  if (error) {
    return <div>Error loading orders: {error}</div>
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Orders Dashboard</h1>
      <div className="grid gap-4">
        {orders.map((order) => (
          <div key={order.id} className="border p-4 rounded-lg">
            <h2 className="font-semibold">{order.customerName}</h2>
            <p className="text-gray-600">Status: {order.status}</p>
            <p className="text-gray-600">Total: ${order.totalAmount}</p>
          </div>
        ))}
      </div>
    </div>
  )
} 