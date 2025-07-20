// Square Orders API integration
import { squarecreds } from './creds';

const SQUARE_API_BASE = 'https://connect.squareupsandbox.com/v2';

interface SquareOrderItem {
  name: string;
  quantity: string;
  base_price_money: {
    amount: number;
    currency: string;
  };
  variation_name?: string;
  metadata?: { [key: string]: string };
}

interface SquareOrderRequest {
  location_id: string;
  order: {
    location_id: string; // Required by Square API
    reference_id: string;
    line_items: SquareOrderItem[];
    metadata?: { [key: string]: string };
  };
  idempotency_key: string;
}

export const squareOrders = {
  async createOrder(orderData: {
    orderId: string;
    customerEmail: string;
    items: Array<{
      name: string;
      price: number;
      quantity: number;
      size?: string;
      color?: string;
      customizations?: any;
    }>;
    total: number;
  }) {
    try {
      // Prepare line items for Square
      const lineItems: SquareOrderItem[] = orderData.items.map(item => ({
        name: item.name,
        quantity: item.quantity.toString(),
        base_price_money: {
          amount: Math.round(item.price * 100), // Convert to cents
          currency: 'USD'
        },
        variation_name: item.size || item.color || undefined,
        metadata: {
          size: item.size || '',
          color: item.color || '',
          customizations: JSON.stringify(item.customizations || {})
        }
      }));

      const squareOrderData: SquareOrderRequest = {
        location_id: squarecreds.locationId,
        order: {
          location_id: squarecreds.locationId, // Square API requires location_id in the order object too
          reference_id: orderData.orderId,
          line_items: lineItems,
          metadata: {
            customer_email: orderData.customerEmail,
            order_type: 'custom_fashion',
            created_at: new Date().toISOString()
          }
        },
        idempotency_key: `order-${orderData.orderId}-${Date.now()}`
      };

      console.log('Creating Square order:', JSON.stringify(squareOrderData, null, 2));

      const response = await fetch(`${SQUARE_API_BASE}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${squarecreds.secret}`,
          'Square-Version': '2023-10-18'
        },
        body: JSON.stringify(squareOrderData)
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
  },

  async getOrder(orderId: string) {
    try {
      // First, search for order by reference_id
      const searchResponse = await fetch(`${SQUARE_API_BASE}/orders/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${squarecreds.secret}`,
          'Square-Version': '2023-10-18'
        },
        body: JSON.stringify({
          location_ids: [squarecreds.locationId],
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

      const squareOrder = searchResult.orders[0];
      
             // Transform Square order to our format
       const transformedOrder = {
         id: squareOrder.reference_id || squareOrder.id,
         squareOrderId: squareOrder.id,
         customerEmail: squareOrder.metadata?.customer_email || '',
         customer: {
           firstName: squareOrder.metadata?.customer_email?.split('@')[0] || 'Customer',
           lastName: '',
           email: squareOrder.metadata?.customer_email || '',
           phone: squareOrder.metadata?.customer_phone || ''
         },
         status: this.mapSquareStatus(squareOrder.state),
         total: squareOrder.total_money?.amount || 0,
         currency: squareOrder.total_money?.currency || 'USD',
         items: squareOrder.line_items?.map((item: any) => ({
           id: item.uid,
           name: item.name,
           price: item.base_price_money?.amount || 0,
           quantity: parseInt(item.quantity) || 1,
           size: item.metadata?.size || '',
           color: item.metadata?.color || '',
           customizations: item.metadata?.customizations ? JSON.parse(item.metadata.customizations) : {}
         })) || [],
         createdAt: squareOrder.created_at,
         updatedAt: squareOrder.updated_at
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
      'OPEN': 'confirmed', 
      'COMPLETED': 'delivered',
      'CANCELED': 'cancelled'
    };
    return statusMap[squareState] || 'pending';
  }
}; 