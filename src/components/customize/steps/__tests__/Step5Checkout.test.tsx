import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Step5Checkout } from '../Step5Checkout'

describe('Step5Checkout', () => {
  const mockOnNext = jest.fn()
  const mockOnBack = jest.fn()

  const defaultProps = {
    onNext: mockOnNext,
    onBack: mockOnBack,
    isFirstStep: false,
    isLastStep: true,
    data: {},
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the checkout form', () => {
    render(<Step5Checkout {...defaultProps} />)

    expect(screen.getByText('Checkout')).toBeInTheDocument()
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument()
  })

  it('shows validation errors for empty required fields', async () => {
    render(<Step5Checkout {...defaultProps} />)

    fireEvent.click(screen.getByText(/submit order/i))

    await waitFor(() => {
      expect(screen.getByText(/first name must be at least 2 characters/i)).toBeInTheDocument()
      expect(screen.getByText(/last name must be at least 2 characters/i)).toBeInTheDocument()
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument()
      expect(screen.getByText(/phone number must be at least 10 digits/i)).toBeInTheDocument()
      expect(screen.getByText(/address must be at least 10 characters/i)).toBeInTheDocument()
      expect(screen.getByText(/city must be at least 2 characters/i)).toBeInTheDocument()
    })

    expect(mockOnNext).not.toHaveBeenCalled()
  })

  it('submits the form with valid data', async () => {
    const user = userEvent.setup()
    render(<Step5Checkout {...defaultProps} />)

    await user.type(screen.getByLabelText(/first name/i), 'John')
    await user.type(screen.getByLabelText(/last name/i), 'Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/phone/i), '1234567890')
    await user.type(screen.getByLabelText(/address/i), '123 Main Street')
    await user.type(screen.getByLabelText(/city/i), 'New York')
    
    // Select payment method
    await user.click(screen.getByLabelText(/bank transfer/i))
    
    // Accept terms
    await user.click(screen.getByLabelText(/terms and conditions/i))

    await user.click(screen.getByText(/submit order/i))

    await waitFor(() => {
      expect(mockOnNext).toHaveBeenCalledWith({
        customerInfo: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '1234567890',
          address: '123 Main Street',
          city: 'New York',
        },
        paymentMethod: 'bank_transfer',
        termsAccepted: true,
      })
    })
  })

  it('disables form submission while loading', () => {
    render(<Step5Checkout {...defaultProps} isSubmitting={true} />)

    expect(screen.getByText(/submit order/i)).toBeDisabled()
    expect(screen.getByRole('button', { name: /back/i })).toBeDisabled()
  })

  it('calls onBack when back button is clicked', () => {
    render(<Step5Checkout {...defaultProps} />)

    fireEvent.click(screen.getByText(/back/i))

    expect(mockOnBack).toHaveBeenCalled()
  })
}) 