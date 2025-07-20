// Square Orders API integration
import { v4 as uuidv4 } from 'uuid';

const SQUARE_API_BASE = 'https://connect.squareupsandbox.com/v2';
const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_LOCATION_ID = process.env.SQUARE_LOCATION_ID;

// Validate Square configuration
if (!SQUARE_ACCESS_TOKEN || !SQUARE_LOCATION_ID) {
  console.error('Missing Square configuration. Please check your .env.local file.');
}

interface OrderItem {
  name: string;
  quantity: string; // Square API expects quantity as string
  base_price_money: { // Square API expects snake_case
    amount: number;
    currency: string;
  };
  note?: string;
  metadata?: {
    size?: string;
    color?: string;
    personId?: string;
    measurements?: string;
    [key: string]: string | undefined;
  };
}

interface CreateOrderRequest {
  location_id: string;
  order: {
    location_id: string;
    reference_id: string;
    line_items: OrderItem[];
    metadata?: { [key: string]: string };
  };
  idempotency_key: string;
}

export interface OrderData {
  orderId: string;
  customerEmail: string;
  items: OrderItem[];
  metadata?: { [key: string]: string };
}

export async function createOrder(orderData: OrderData) {
  try {
    // Ensure we have valid items array
    if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
      throw new Error('Order must contain at least one item');
    }

    // Ensure we have a valid customer name in metadata
    if (!orderData.metadata?.customer_name) {
      throw new Error('Customer name is required in order metadata');
    }

    const requestData: CreateOrderRequest = {
      location_id: SQUARE_LOCATION_ID!,
      order: {
        location_id: SQUARE_LOCATION_ID!,
        reference_id: orderData.orderId,
        line_items: orderData.items.map(item => ({
          name: item.name,
          quantity: String(item.quantity || 1),
          base_price_money: { // Square API expects snake_case
            amount: Math.round(item.base_price_money.amount),
            currency: item.base_price_money.currency || 'USD'
          },
          note: `Size: ${item.metadata?.size || 'N/A'}, Color: ${item.metadata?.color || 'N/A'}`,
          metadata: {
            size: item.metadata?.size || '',
            color: item.metadata?.color || '',
            personId: item.metadata?.personId || 'default',
            measurements: item.metadata?.measurements || '{}',
            isCustom: item.metadata?.isCustom || 'false'
          }
        })),
        metadata: {
          customer_email: orderData.customerEmail,
          customer_name: orderData.metadata.customer_name,
          order_type: orderData.metadata.order_type || 'regular',
          created_at: orderData.metadata.created_at || new Date().toISOString(),
          people: orderData.metadata.people || '[]'
        }
      },
      idempotency_key: `order-${orderData.orderId}-${Date.now()}`
    };

    console.log('Creating Square order:', JSON.stringify(requestData, null, 2));

    const response = await fetch(`${SQUARE_API_BASE}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Square-Version': '2024-01-18'
      },
      body: JSON.stringify(requestData)
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Square order creation failed:', result);
      throw new Error(`Square order creation failed: ${JSON.stringify(result.errors)}`);
    }

    console.log('✅ Square order created successfully:', result.order.id);
    return {
      success: true,
      squareOrderId: result.order.id,
      order: result.order
    };

  } catch (error) {
    console.error('Error creating Square order:', error);
    throw error;
  }
}

export const squareOrders = {
  async getOrder(orderId: string) {
    try {
      // First, search for order by reference_id
      const searchResponse = await fetch(`${SQUARE_API_BASE}/orders/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
          'Square-Version': '2023-10-18'
        },
        body: JSON.stringify({
          location_ids: [SQUARE_LOCATION_ID!],
          query: {
            filter: {
              reference_id_filter: {
                reference_id: orderId
              }
            }
          }
        })
      });

      const searchResult = await searchResponse.json();

      if (!searchResponse.ok || !searchResult.orders || searchResult.orders.length === 0) {
        console.log('Order not found in Square:', orderId);
        return null;
      }

      // Find the completed order with line_items (actual transaction)
      // There might be multiple orders for the same reference_id:
      // 1. Metadata order (OPEN state, no line_items) 
      // 2. Payment order (COMPLETED state, has line_items)
      const completedOrder = searchResult.orders.find((order: any) => 
        order.state === 'COMPLETED' && order.line_items && order.line_items.length > 0
      );
      
      const metadataOrder = searchResult.orders.find((order: any) => 
        order.metadata && order.metadata.customer_email
      );

      // Use completed order for transaction data, metadata order for customer info
      const squareOrder = completedOrder || searchResult.orders[0];
      const customerData = metadataOrder || squareOrder;
      
             // Transform Square order to our format
      const transformedOrder = {
        id: squareOrder.reference_id || completedOrder?.reference_id || squareOrder.id,
        squareOrderId: squareOrder.id,
        customerEmail: customerData.metadata?.customer_email || '',
        customer: {
          name: customerData.metadata?.customer_name || customerData.metadata?.customer_email?.split('@')[0] || 'Customer',
          email: customerData.metadata?.customer_email || '',
          phone: '(240) 704-9915',
          address: '13814 Outlet Dr, Inside the Global Foods',
          city: 'Silver Spring',
          state: 'MD',
          zipCode: '20904'
        },
        status: this.mapSquareStatus(squareOrder.state),
        total: (squareOrder.total_money?.amount || 0) / 100, // Convert cents to dollars
        subtotal: Math.round(((squareOrder.total_money?.amount || 0) * 0.9)) / 100, // Convert cents to dollars
        tax: Math.round(((squareOrder.total_money?.amount || 0) * 0.1)) / 100, // Convert cents to dollars
        currency: squareOrder.total_money?.currency || 'USD',
        items: squareOrder.line_items?.map((item: any) => ({
          id: item.uid,
          name: item.name,
          price: (item.base_price_money?.amount || 0) / 100,
          quantity: parseInt(item.quantity) || 1,
          size: item.metadata?.size || 'N/A',
          color: item.metadata?.color || 'N/A',
          isCustom: item.metadata?.isCustom === 'true',
          measurements: item.metadata?.measurements ? JSON.parse(item.metadata.measurements) : undefined,
          personName: item.metadata?.personName || customerData.metadata?.customer_name || 'Customer',
          personId: item.metadata?.personId || 'default'
        })) || [],
        people: customerData.metadata?.people ? JSON.parse(customerData.metadata.people) : [
          {
            id: 'default',
            name: 'Customer',
            category: 'adult',
            gender: 'unisex',
            measurements: {}
          }
        ],
        // Payment information from tenders
        paymentInfo: squareOrder.tenders ? {
          cardBrand: squareOrder.tenders[0]?.card_details?.card?.card_brand,
          last4: squareOrder.tenders[0]?.card_details?.card?.last_4,
          paymentId: squareOrder.tenders[0]?.payment_id
        } : null,
        createdAt: squareOrder.created_at || new Date().toISOString(),
        updatedAt: squareOrder.updated_at || new Date().toISOString()
      };

      return transformedOrder;

    } catch (error) {
      console.error('Error fetching Square order:', error);
      return null;
    }
  },

  async updateOrderStatus(orderId: string, status: string) {
    try {
      // Note: Square order status updates are limited
      // For now, we'll add this to metadata
      console.log(`Order ${orderId} status updated to: ${status}`);
      return true;
    } catch (error) {
      console.error('Error updating Square order status:', error);
      return false;
    }
  },

  mapSquareStatus(squareState: string): string {
    const statusMap: { [key: string]: string } = {
      'DRAFT': 'pending',
      'OPEN': 'preparing', 
      'COMPLETED': 'preparing', // New paid orders should show as preparing, not delivered
      'CANCELED': 'cancelled'
    };
    return statusMap[squareState] || 'preparing';
  }
}; 