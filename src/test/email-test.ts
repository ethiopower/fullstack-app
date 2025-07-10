import * as dotenv from 'dotenv'
import { sendOrderConfirmation } from '../lib/notify'

// Load environment variables
dotenv.config()

async function testEmail() {
  const testOrder = {
    orderId: 'TEST-123',
    customerName: 'Test Customer',
    customerEmail: 'fekadu.sami@gmail.com', // Sending to yourself for testing
    status: 'PENDING',
    items: [
      {
        gender: 'Men',
        occasion: 'Wedding'
      }
    ],
    subtotal: 299.99,
    deposit: 100.00
  }

  console.log('Sending test email...')
  console.log('Using email configuration:')
  console.log('- From:', process.env.GMAIL_USER)
  console.log('- To:', testOrder.customerEmail)
  
  try {
    const result = await sendOrderConfirmation(testOrder)
    if (result) {
      console.log('Test email sent successfully!')
    } else {
      console.log('Failed to send test email')
    }
  } catch (error) {
    console.error('Error sending test email:', error)
  }
}

testEmail() 