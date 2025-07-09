import { GoogleSpreadsheet } from 'google-spreadsheet'
import { JWT } from 'google-auth-library'

// These should be set in your environment variables
const GOOGLE_SHEETS_CLIENT_EMAIL = process.env.GOOGLE_SHEETS_CLIENT_EMAIL!
const GOOGLE_SHEETS_PRIVATE_KEY = process.env.GOOGLE_SHEETS_PRIVATE_KEY!
const SPREADSHEET_ID = process.env.SPREADSHEET_ID!

const SHEET_NAMES = {
  CUSTOMERS: 'Customers',
  ORDERS: 'Orders',
  ORDER_ITEMS: 'OrderItems',
  WAREHOUSE_WORKERS: 'WarehouseWorkers',
} as const

export interface Customer {
  id: string
  name: string
  phone: string
  email: string
  address: string
}

export interface Order {
  order_id: string
  phone: string
  status: 'Open' | 'In Production' | 'Ready' | 'Picked Up'
  assignedTo: string
  promisedDate: string
  notes: string
  archived: 'yes' | ''
  downPayment: number
  balance: number
  createdAt: string
}

export interface OrderItem {
  item_id: string
  order_id: string
  item_name: string
  quantity: number
  price: number
  paidAmount: number
  assignedPhone: string
  notes: string
}

export interface WarehouseWorker {
  id: string
  name: string
  contact: string
  preferredChannel: 'telegram' | 'whatsapp' | 'both'
}

async function getAuthenticatedDoc() {
  const auth = new JWT({
    email: GOOGLE_SHEETS_CLIENT_EMAIL,
    key: GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  const doc = new GoogleSpreadsheet(SPREADSHEET_ID, auth)
  await doc.loadInfo()
  return doc
}

export async function getSheet(sheetName: keyof typeof SHEET_NAMES) {
  const doc = await getAuthenticatedDoc()
  return doc.sheetsByTitle[SHEET_NAMES[sheetName]]
}

export async function addCustomer(customer: Omit<Customer, 'id'>): Promise<Customer> {
  const sheet = await getSheet('CUSTOMERS')
  const id = Date.now().toString()
  const newCustomer = { id, ...customer }
  await sheet.addRow(newCustomer)
  return newCustomer
}

export async function findCustomerByPhone(phone: string): Promise<Customer | null> {
  const sheet = await getSheet('CUSTOMERS')
  const rows = await sheet.getRows()
  const customer = rows.find(row => row.get('phone') === phone)
  return customer ? rowToCustomer(customer) : null
}

export async function createOrder(order: Omit<Order, 'order_id' | 'createdAt'>): Promise<Order> {
  const sheet = await getSheet('ORDERS')
  const order_id = `ORD-${Date.now()}`
  const createdAt = new Date().toISOString()
  const newOrder = { order_id, ...order, createdAt }
  await sheet.addRow(newOrder)
  return newOrder
}

export async function addOrderItem(item: Omit<OrderItem, 'item_id'>): Promise<OrderItem> {
  const sheet = await getSheet('ORDER_ITEMS')
  const item_id = `ITM-${Date.now()}`
  const newItem = { item_id, ...item }
  await sheet.addRow(newItem)
  return newItem
}

export async function updateOrderStatus(
  orderId: string,
  status: Order['status'],
  assignedTo?: string
): Promise<void> {
  const sheet = await getSheet('ORDERS')
  const rows = await sheet.getRows()
  const orderRow = rows.find(row => row.get('order_id') === orderId)
  if (orderRow) {
    if (status) orderRow.set('status', status)
    if (assignedTo) orderRow.set('assignedTo', assignedTo)
    await orderRow.save()
  }
}

export async function getWorkers(): Promise<WarehouseWorker[]> {
  const sheet = await getSheet('WAREHOUSE_WORKERS')
  const rows = await sheet.getRows()
  return rows.map(rowToWorker)
}

// Helper functions to convert sheet rows to typed objects
function rowToCustomer(row: any): Customer {
  return {
    id: row.get('id'),
    name: row.get('name'),
    phone: row.get('phone'),
    email: row.get('email'),
    address: row.get('address'),
  }
}

function rowToWorker(row: any): WarehouseWorker {
  return {
    id: row.get('id'),
    name: row.get('name'),
    contact: row.get('contact'),
    preferredChannel: row.get('preferredChannel'),
  }
} 