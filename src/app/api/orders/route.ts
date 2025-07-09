import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

// Initialize Google Sheets
const sheets = google.sheets('v4')

// Function to append order to Google Sheets as backup
async function backupOrderToSheet(order: any) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    const spreadsheetId = process.env.GOOGLE_SHEET_ID
    const range = 'Orders!A:Z' // Adjust based on your sheet structure

    const orderRow = [
      order.orderDate.toISOString(),
      order.customer.firstName,
      order.customer.lastName,
      order.customer.email,
      order.customer.phone,
      order.customer.address,
      order.customer.city,
      order.paymentMethod,
      order.subtotal.toString(),
      order.deposit.toString(),
      order.status,
      JSON.stringify(order.items),
    ]

    await sheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [orderRow],
      },
    })

    return true
  } catch (error) {
    console.error('Error backing up to sheet:', error)
    // Don't throw error for backup failure
    return false
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orders = await prisma.order.findMany({
      include: {
        customer: true,
        items: true,
      },
      orderBy: {
        orderDate: 'desc',
      },
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const orderData = await req.json()

    // Validate order data
    if (!orderData.customer || !orderData.items || !orderData.paymentMethod) {
      return NextResponse.json(
        { error: 'Invalid order data' },
        { status: 400 }
      )
    }

    // Create customer and order in database
    const order = await prisma.order.create({
      data: {
        paymentMethod: orderData.paymentMethod,
        subtotal: orderData.subtotal,
        deposit: orderData.deposit,
        customer: {
          create: {
            firstName: orderData.customer.firstName,
            lastName: orderData.customer.lastName,
            email: orderData.customer.email,
            phone: orderData.customer.phone,
            address: orderData.customer.address,
            city: orderData.customer.city,
          },
        },
        items: {
          create: orderData.items.map((item: any) => ({
            gender: item.gender,
            occasion: item.occasion,
            design: item.design,
            measurements: item.measurements,
          })),
        },
      },
      include: {
        customer: true,
        items: true,
      },
    })

    // Backup to Google Sheets (don't wait for it)
    backupOrderToSheet(order).catch(console.error)

    return NextResponse.json({
      message: 'Order submitted successfully',
      orderId: order.id,
    })
  } catch (error) {
    console.error('Error processing order:', error)
    return NextResponse.json(
      { error: 'Failed to process order' },
      { status: 500 }
    )
  }
} 