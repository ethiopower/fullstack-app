import { PrismaClient as SqliteClient } from '@prisma/client';
import { PrismaClient as PostgresClient } from '@prisma/client';

// Initialize clients
const sqliteClient = new SqliteClient({
  datasources: {
    db: {
      url: process.env.SQLITE_URL
    }
  }
});

const postgresClient = new PostgresClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function migrateData() {
  try {
    console.log('Starting migration...');

    // Migrate customers
    console.log('Migrating customers...');
    const customers = await sqliteClient.customer.findMany();
    for (const customer of customers) {
      await postgresClient.customer.create({
        data: {
          id: customer.id,
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          city: customer.city,
          createdAt: customer.createdAt,
          updatedAt: customer.updatedAt
        }
      });
    }

    // Migrate warehouse workers
    console.log('Migrating warehouse workers...');
    const workers = await sqliteClient.warehouseWorker.findMany();
    for (const worker of workers) {
      await postgresClient.warehouseWorker.create({
        data: {
          id: worker.id,
          firstName: worker.firstName,
          lastName: worker.lastName,
          email: worker.email,
          phone: worker.phone,
          role: worker.role,
          password: worker.password,
          createdAt: worker.createdAt,
          updatedAt: worker.updatedAt
        }
      });
    }

    // Migrate categories
    console.log('Migrating categories...');
    const categories = await sqliteClient.category.findMany();
    for (const category of categories) {
      await postgresClient.category.create({
        data: {
          id: category.id,
          name: category.name,
          description: category.description,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt
        }
      });
    }

    // Migrate products
    console.log('Migrating products...');
    const products = await sqliteClient.product.findMany();
    for (const product of products) {
      await postgresClient.product.create({
        data: {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          images: product.images,
          categoryId: product.categoryId,
          gender: product.gender,
          sizes: product.sizes,
          materials: product.materials,
          inStock: product.inStock,
          featured: product.featured,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt
        }
      });
    }

    // Migrate orders and order items
    console.log('Migrating orders...');
    const orders = await sqliteClient.order.findMany({
      include: {
        items: true
      }
    });

    for (const order of orders) {
      await postgresClient.order.create({
        data: {
          id: order.id,
          customerId: order.customerId,
          orderDate: order.orderDate,
          status: order.status,
          paymentMethod: order.paymentMethod,
          subtotal: order.subtotal,
          deposit: order.deposit,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          items: {
            create: order.items.map(item => ({
              id: item.id,
              gender: item.gender,
              occasion: item.occasion,
              design: item.design,
              measurements: item.measurements,
              createdAt: item.createdAt,
              updatedAt: item.updatedAt
            }))
          }
        }
      });
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await sqliteClient.$disconnect();
    await postgresClient.$disconnect();
  }
}

migrateData(); 