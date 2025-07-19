'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Stack,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  ShoppingBag as OrderIcon,
  People as CustomerIcon,
  AttachMoney as RevenueIcon
} from '@mui/icons-material';
import { THEME } from '@/lib/constants';

type OrderStatus = 'PENDING' | 'PROCESSING' | 'READY_FOR_PICKUP' | 'COMPLETED' | 'CANCELLED';

type Order = {
  id: string;
  customer: {
    firstName: string;
    lastName: string;
  };
  orderDate: string;
  status: OrderStatus;
  subtotal: number;
};

type DashboardStats = {
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  recentOrders: Order[];
};

const statusColors: Record<OrderStatus, string> = {
  PENDING: '#FFA726',
  PROCESSING: '#29B6F6',
  READY_FOR_PICKUP: '#66BB6A',
  COMPLETED: '#4CAF50',
  CANCELLED: '#EF5350'
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard statistics');
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !stats) {
    return (
      <Typography color="error" align="center">
        {error || 'Failed to load dashboard'}
      </Typography>
    );
  }

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          fontFamily: THEME.typography.headingFamily,
          fontWeight: 500
        }}
      >
        Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          {
            title: 'Total Orders',
            value: stats.totalOrders,
            icon: OrderIcon,
            color: THEME.colors.primary
          },
          {
            title: 'Total Customers',
            value: stats.totalCustomers,
            icon: CustomerIcon,
            color: '#4CAF50'
          },
          {
            title: 'Total Revenue',
            value: formatCurrency(stats.totalRevenue),
            icon: RevenueIcon,
            color: '#F9A825'
          },
          {
            title: 'Growth',
            value: '+12.5%',
            icon: TrendingUpIcon,
            color: '#2196F3'
          }
        ].map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)'
                }
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 2 }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: THEME.typography.headingFamily
                  }}
                >
                  {stat.title}
                </Typography>
                <stat.icon
                  sx={{
                    fontSize: 40,
                    color: stat.color,
                    opacity: 0.8
                  }}
                />
              </Stack>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 500,
                  color: stat.color
                }}
              >
                {stat.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Recent Orders */}
      <Paper elevation={0} sx={{ p: 3 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 3 }}
        >
          <Typography
            variant="h6"
            sx={{
              fontFamily: THEME.typography.headingFamily
            }}
          >
            Recent Orders
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={() => window.location.href = '/portal/orders'}
            sx={{
              borderColor: THEME.colors.primary,
              color: THEME.colors.primary,
              '&:hover': {
                borderColor: THEME.colors.secondary,
                color: THEME.colors.secondary
              }
            }}
          >
            View All
          </Button>
        </Stack>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stats.recentOrders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>
                    {order.customer.firstName} {order.customer.lastName}
                  </TableCell>
                  <TableCell>{formatDate(order.orderDate)}</TableCell>
                  <TableCell>{formatCurrency(order.subtotal)}</TableCell>
                  <TableCell>
                    <Chip
                      label={order.status.replace('_', ' ')}
                      size="small"
                      sx={{
                        bgcolor: `${statusColors[order.status]}15`,
                        color: statusColors[order.status],
                        fontWeight: 500
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
} 