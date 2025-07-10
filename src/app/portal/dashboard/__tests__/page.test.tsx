import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DashboardPage from '../page'
import { TestProviders } from '@/test/providers'
import { Session } from 'next-auth'

// Mock next-auth
jest.mock('next-auth/react', () => {
  const originalModule = jest.requireActual('next-auth/react')
  return {
    __esModule: true,
    ...originalModule,
    useSession: jest.fn(() => ({
      data: {
        user: { id: '1', email: 'admin@example.com', name: 'Admin User' },
        expires: new Date(Date.now() + 2 * 86400).toISOString()
      } as Session,
      status: 'authenticated'
    }))
  }
})

// Mock the fetch function
const mockFetch = jest.fn()
global.fetch = mockFetch

// Mock data
const mockOrders = [
  {
    id: '1',
    customerName: 'John Doe',
    status: 'pending',
    createdAt: '2024-03-20T10:00:00Z',
    totalAmount: 299.99,
  },
  {
    id: '2',
    customerName: 'Jane Smith',
    status: 'processing',
    createdAt: '2024-03-19T15:30:00Z',
    totalAmount: 199.99,
  },
]

describe('DashboardPage', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  it('renders loading state initially', async () => {
    // Mock a slow response
    mockFetch.mockImplementationOnce(() =>
      new Promise(resolve =>
        setTimeout(() =>
          resolve({
            ok: true,
            json: () => Promise.resolve({ orders: mockOrders }),
          }),
          100
        )
      )
    )

    let rendered
    await act(async () => {
      rendered = render(
        <TestProviders>
          <DashboardPage />
        </TestProviders>
      )
    })

    expect(screen.getByText('Loading orders...')).toBeInTheDocument()

    // Wait for the loading state to be replaced
    await waitFor(() => {
      expect(screen.queryByText('Loading orders...')).not.toBeInTheDocument()
    })
  })

  it('renders the dashboard with orders', async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ orders: mockOrders }),
      })
    )

    await act(async () => {
      render(
        <TestProviders>
          <DashboardPage />
        </TestProviders>
      )
    })

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      expect(screen.getByText(/total: \$299\.99/i)).toBeInTheDocument()
      expect(screen.getByText(/total: \$199\.99/i)).toBeInTheDocument()
    })
  })

  it('handles order status updates', async () => {
    const user = userEvent.setup()

    mockFetch
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ orders: mockOrders }),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        })
      )

    await act(async () => {
      render(
        <TestProviders>
          <DashboardPage />
        </TestProviders>
      )
    })

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    const updateButton = screen.getByRole('button', { name: /update status/i })
    await act(async () => {
      await user.click(updateButton)
    })

    expect(mockFetch).toHaveBeenCalledWith('/api/orders/1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'processing' }),
    })
  })

  it('handles API errors gracefully', async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Server error' }),
      })
    )

    await act(async () => {
      render(
        <TestProviders>
          <DashboardPage />
        </TestProviders>
      )
    })

    await waitFor(() => {
      expect(screen.getByText(/error loading orders/i)).toBeInTheDocument()
    })
  })

  it('filters orders by status', async () => {
    const user = userEvent.setup()

    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ orders: mockOrders }),
      })
    )

    await act(async () => {
      render(
        <TestProviders>
          <DashboardPage />
        </TestProviders>
      )
    })

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    const filterSelect = screen.getByLabelText(/filter by status/i)
    await act(async () => {
      await user.selectOptions(filterSelect, 'processing')
    })

    expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })
}) 