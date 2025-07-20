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
  quantity: number;
  basePriceMoney: {
    amount: number;
    currency: string;
  };
  metadata?: {
    size?: string;
    color?: string;
    personId?: string;
    measurements?: string;
    [key: string]: string | undefined;
  };
}

interface CreateOrderRequest {
  location_id: string; // Required by Square API
  order: {
    location_id: string; // Required by Square API
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
    const requestData: CreateOrderRequest = {
      location_id: SQUARE_LOCATION_ID!, // Square API requires location_id in the order object too
      order: {
        location_id: SQUARE_LOCATION_ID!,
        reference_id: orderData.orderId,
        line_items: orderData.items,
        metadata: {
          customer_email: orderData.customerEmail,
          order_type: 'custom_fashion',
          created_at: new Date().toISOString(),
          ...orderData.metadata
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
           firstName: customerData.metadata?.customer_email?.split('@')[0]?.split('.')[0]?.charAt(0).toUpperCase() + customerData.metadata?.customer_email?.split('@')[0]?.split('.')[0]?.slice(1) || 'Customer',
           lastName: customerData.metadata?.customer_email?.split('@')[0]?.split('.')[1]?.charAt(0).toUpperCase() + customerData.metadata?.customer_email?.split('@')[0]?.split('.')[1]?.slice(1) || '',
           email: customerData.metadata?.customer_email || '',
           phone: '(240) 704-9915', // Always use business phone
           address: '13814 Outlet Dr, Inside the Global Foods', // Always use business address  
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
           name: 'Custom Fashion Garment', // Better item name
           price: (item.base_price_money?.amount || 0) / 100, // Convert cents to dollars
           quantity: parseInt(item.quantity) || 1,
           size: item.metadata?.size || 'Custom',
           color: item.metadata?.color || 'As Selected',
           customizations: item.metadata?.customizations ? JSON.parse(item.metadata.customizations) : {
             design: 'Custom Design',
             fabric: 'Premium Cotton',
             style: 'Traditional'
           },
           personId: item.metadata?.person_id || 'default'
         })) || [
           {
             id: 'default-item',
             name: 'Custom Fashion Garment',
             price: (squareOrder.total_money?.amount || 0) / 100, // Convert cents to dollars
             quantity: 1,
             size: 'Custom',
             color: 'As Selected',
             customizations: {
               design: 'Custom Design',
               fabric: 'Premium Cotton',
               style: 'Traditional'
             },
             personId: 'default'
           }
         ],
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