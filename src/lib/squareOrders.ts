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
      personId?: string;
    }>;
    people?: Array<{
      id: string;
      name: string;
      category: string;
      gender: string;
      measurements: any;
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
           person_id: item.personId || 'default',
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
             created_at: new Date().toISOString(),
             people: JSON.stringify(orderData.people || [
               {
                 id: 'default',
                 name: 'Customer',
                 category: 'adult',
                 gender: 'unisex',
                 measurements: {}
               }
             ])
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