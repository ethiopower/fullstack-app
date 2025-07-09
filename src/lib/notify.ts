import nodemailer from 'nodemailer'

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

interface OrderNotification {
  orderId: string
  customerName: string
  customerEmail: string
  status: string
  items: Array<{
    gender: string
    occasion: string
  }>
  subtotal: number
  deposit: number
}

export async function sendOrderConfirmation(order: OrderNotification) {
  const itemsList = order.items
    .map(
      (item) => `- ${item.gender}'s outfit for ${item.occasion.toLowerCase()}`
    )
    .join('\n')

  const emailContent = `
    Dear ${order.customerName},

    Thank you for your order with Fafresh Cultural Fashion!

    Order Details:
    Order ID: ${order.orderId}
    Status: ${order.status}
    
    Items:
    ${itemsList}
    
    Total: $${order.subtotal.toFixed(2)}
    Required Deposit: $${order.deposit.toFixed(2)}
    
    We will contact you once your order is ready for measurements or if we need any additional information.
    
    Best regards,
    Fafresh Cultural Fashion Team
  `

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: order.customerEmail,
      subject: `Order Confirmation - Fafresh Cultural Fashion #${order.orderId}`,
      text: emailContent,
    })

    return true
  } catch (error) {
    console.error('Error sending order confirmation:', error)
    return false
  }
}

export async function sendStatusUpdate(order: OrderNotification) {
  const emailContent = `
    Dear ${order.customerName},

    Your order #${order.orderId} has been updated.
    
    New Status: ${order.status}
    
    ${
      order.status === 'READY_FOR_PICKUP'
        ? 'Your order is now ready for pickup! Please visit our store during business hours.'
        : ''
    }
    
    If you have any questions, please don't hesitate to contact us.
    
    Best regards,
    Fafresh Cultural Fashion Team
  `

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: order.customerEmail,
      subject: `Order Status Update - Fafresh Cultural Fashion #${order.orderId}`,
      text: emailContent,
    })

    return true
  } catch (error) {
    console.error('Error sending status update:', error)
    return false
  }
}

// Optional: SMS notifications using Twilio or similar service
// export async function sendSMSNotification(order: OrderNotification) {
//   // Implement SMS notifications here
// } 