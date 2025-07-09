import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DashboardPage from '../page'
import { TestProviders } from '@/test/providers'

// Mock the fetch function
const mockFetch = jest.fn()
global.fetch = mockFetch

// Mock data
const mockOrders = [
  {
    id: '1',
    customerName: 'John Doe',
    status: 'pending',
    totalAmount: 299.99,
  },
  {
    id: '2',
    customerName: 'Jane Smith',
    status: 'processing',
    totalAmount: 199.99,
  },
]

// Mock session
const mockSession = {
  expires: new Date(Date.now() + 2 * 86400).toISOString(),
  user: { id: '1', email: 'admin@example.com', name: 'Admin User' }
}

describe('DashboardPage', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    mockFetch.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ orders: mockOrders }),
      })
    )
  })

  it('renders the dashboard with orders', async () => {
    render(
      <TestProviders session={mockSession}>
        <DashboardPage />
      </TestProviders>
    )

    // Check loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument()

    // Wait for orders to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    })

    // Check order details
    expect(screen.getByText('$299.99')).toBeInTheDocument()
    expect(screen.getByText('$199.99')).toBeInTheDocument()
    expect(screen.getAllByText(/pending|processing/i)).toHaveLength(2)
  })

  it('handles order status updates', async () => {
    const user = userEvent.setup()
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ orders: mockOrders }),
      })
    ).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    )

    render(
      <TestProviders session={mockSession}>
        <DashboardPage />
      </TestProviders>
    )

    // Wait for orders to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    // Click status update button
    const statusButton = screen.getAllByRole('button', { name: /update status/i })[0]
    await user.click(statusButton)

    // Select new status
    const statusSelect = screen.getByRole('combobox')
    await user.selectOptions(statusSelect, 'processing')

    // Click confirm
    await user.click(screen.getByRole('button', { name: /confirm/i }))

    // Verify API call
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

    render(
      <TestProviders session={mockSession}>
        <DashboardPage />
      </TestProviders>
    )

    await waitFor(() => {
      expect(screen.getByText(/error loading orders/i)).toBeInTheDocument()
    })
  })

  it('filters orders by status', async () => {
    const user = userEvent.setup()
    render(
      <TestProviders session={mockSession}>
        <DashboardPage />
      </TestProviders>
    )

    // Wait for orders to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    // Select status filter
    const filterSelect = screen.getByLabelText(/filter by status/i)
    await user.selectOptions(filterSelect, 'pending')

    // Verify only pending orders are shown
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
  })
}) 