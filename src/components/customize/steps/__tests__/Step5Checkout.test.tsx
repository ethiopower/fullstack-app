import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
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
    data: {}
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
    expect(screen.getByLabelText(/state/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/zip code/i)).toBeInTheDocument()
  })

  it('submits the form with valid data', async () => {
    const formData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '1234567890',
      address: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345'
    }

    render(<Step5Checkout {...defaultProps} />)

    await userEvent.type(screen.getByLabelText(/first name/i), formData.firstName)
    await userEvent.type(screen.getByLabelText(/last name/i), formData.lastName)
    await userEvent.type(screen.getByLabelText(/email/i), formData.email)
    await userEvent.type(screen.getByLabelText(/phone/i), formData.phone)
    await userEvent.type(screen.getByLabelText(/address/i), formData.address)
    await userEvent.type(screen.getByLabelText(/city/i), formData.city)
    await userEvent.type(screen.getByLabelText(/state/i), formData.state)
    await userEvent.type(screen.getByLabelText(/zip code/i), formData.zipCode)

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /place order/i }))
    })

    expect(mockOnNext).toHaveBeenCalledWith(formData)
  })

  it('disables form submission while submitting', async () => {
    // Mock onNext to be a slow async function
    const slowOnNext = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)))
    render(<Step5Checkout {...defaultProps} onNext={slowOnNext} />)

    const submitButton = screen.getByRole('button', { name: /place order/i })
    const backButton = screen.getByRole('button', { name: /back/i })

    // Fill in required fields
    await userEvent.type(screen.getByLabelText(/first name/i), 'John')
    await userEvent.type(screen.getByLabelText(/last name/i), 'Doe')
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com')
    await userEvent.type(screen.getByLabelText(/phone/i), '1234567890')
    await userEvent.type(screen.getByLabelText(/address/i), '123 Main St')
    await userEvent.type(screen.getByLabelText(/city/i), 'Anytown')
    await userEvent.type(screen.getByLabelText(/state/i), 'CA')
    await userEvent.type(screen.getByLabelText(/zip code/i), '12345')

    await act(async () => {
      await userEvent.click(submitButton)
    })

    await waitFor(() => {
      expect(submitButton).toBeDisabled()
      expect(backButton).toBeDisabled()
      expect(submitButton).toHaveTextContent('Processing...')
    })
  })

  it('calls onBack when back button is clicked', () => {
    render(<Step5Checkout {...defaultProps} />)
    
    const backButton = screen.getByRole('button', { name: /back/i })
    fireEvent.click(backButton)

    expect(mockOnBack).toHaveBeenCalled()
  })
}) 