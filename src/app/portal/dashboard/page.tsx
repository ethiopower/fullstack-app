'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

interface Order {
  id: string
  customerName: string
  status: string
  createdAt: string
  totalAmount: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

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
        setError(err instanceof Error ? err.message : 'Failed to fetch orders')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) {
        throw new Error('Failed to update order status')
      }

      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order status')
    }
  }

  if (loading) {
    return <div>Loading orders...</div>
  }

  if (error) {
    return <div>Error loading orders: {error}</div>
  }

  const filteredOrders = selectedStatus === 'all'
    ? orders
    : orders.filter(order => order.status === selectedStatus)

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Orders Dashboard</h1>
      <div className="mb-4">
        <label htmlFor="statusFilter" className="mr-2">Filter by status:</label>
        <select
          id="statusFilter"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border rounded p-1"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <div className="grid gap-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="border p-4 rounded-lg">
            <h2 className="font-semibold">{order.customerName}</h2>
            <p className="text-gray-600">Status: {order.status}</p>
            <p className="text-gray-600">Total: ${order.totalAmount}</p>
            {order.status === 'pending' && (
              <button
                onClick={() => handleUpdateStatus(order.id, 'processing')}
                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Update Status
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 