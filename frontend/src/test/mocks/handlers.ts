import { rest } from 'msw';

export const handlers = [
  // Mock product API
  rest.get('/api/products', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: '1',
          name: 'Traditional Dress',
          description: 'Beautiful Ethiopian traditional dress',
          price: 199.99,
          images: ['/images/product1.jpg'],
          category: {
            id: '1',
            name: 'Dresses'
          },
          gender: 'women',
          sizes: ['S', 'M', 'L'],
          materials: ['Cotton', 'Silk'],
          inStock: true,
          featured: true
        }
      ])
    );
  }),

  // Mock categories API
  rest.get('/api/categories', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: '1',
          name: 'Dresses',
          description: 'Traditional Ethiopian dresses'
        }
      ])
    );
  }),

  // Mock order API
  rest.post('/api/orders', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        id: '1',
        status: 'PENDING',
        items: [],
        subtotal: 0,
        deposit: 0
      })
    );
  }),

  // Mock order status API
  rest.get('/api/orders/:orderId', (req, res, ctx) => {
    const { orderId } = req.params;
    return res(
      ctx.status(200),
      ctx.json({
        id: orderId,
        status: 'PROCESSING',
        items: [
          {
            gender: 'women',
            occasion: 'Wedding',
            design: {
              name: 'Traditional Wedding Dress'
            }
          }
        ],
        subtotal: 299.99,
        deposit: 100
      })
    );
  }),

  // Mock auth API
  rest.post('/api/auth/signin', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com'
        }
      })
    );
  }),

  // Mock upload API
  rest.post('/api/upload', async (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        url: '/uploads/test-image.jpg'
      })
    );
  }),

  // Mock contact form API
  rest.post('/api/contact', async (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        message: 'Message sent successfully'
      })
    );
  })
]; 