import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get total orders
    const totalOrders = await prisma.order.count();

    // Get total customers
    const totalCustomers = await prisma.customer.count();

    // Get total revenue
    const revenueResult = await prisma.order.aggregate({
      _sum: {
        subtotal: true
      },
      where: {
        status: 'COMPLETED'
      }
    });
    const totalRevenue = revenueResult._sum.subtotal || 0;

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: {
        orderDate: 'desc'
      },
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    return NextResponse.json({
      totalOrders,
      totalCustomers,
      totalRevenue,
      recentOrders
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
} 