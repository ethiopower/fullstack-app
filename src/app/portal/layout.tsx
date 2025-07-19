'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Container,
  Avatar,
  Menu,
  MenuItem,
  Stack
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  ShoppingBag as OrdersIcon,
  People as CustomersIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon
} from '@mui/icons-material';
import { signOut, useSession } from 'next-auth/react';
import { THEME } from '@/lib/constants';

const drawerWidth = 240;

const menuItems = [
  { label: 'Dashboard', icon: DashboardIcon, path: '/portal/dashboard' },
  { label: 'Orders', icon: OrdersIcon, path: '/portal/orders' },
  { label: 'Customers', icon: CustomersIcon, path: '/portal/customers' },
  { label: 'Settings', icon: SettingsIcon, path: '/portal/settings' }
];

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (status === 'unauthenticated') {
      router.push('/portal/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!session) {
    return null;
  }

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await signOut({ redirect: false });
    router.push('/portal/login');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: THEME.colors.black,
          transition: 'width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            {drawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, fontFamily: THEME.typography.headingFamily }}
          >
            Fafresh Admin
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
              {session.user?.name}
            </Typography>
            <IconButton
              onClick={handleMenuOpen}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={Boolean(anchorEl) ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: THEME.colors.primary
                }}
              >
                {session.user?.name?.[0]}
              </Avatar>
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerOpen ? drawerWidth : 72,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerOpen ? drawerWidth : 72,
            boxSizing: 'border-box',
            transition: 'width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
            overflowX: 'hidden'
          }
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'hidden' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.label} disablePadding>
                <ListItemButton
                  onClick={() => router.push(item.path)}
                  selected={pathname === item.path}
                  sx={{
                    minHeight: 48,
                    justifyContent: drawerOpen ? 'initial' : 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: drawerOpen ? 3 : 'auto',
                      justifyContent: 'center',
                      color: pathname === item.path ? THEME.colors.primary : 'inherit'
                    }}
                  >
                    <item.icon />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    sx={{
                      opacity: drawerOpen ? 1 : 0,
                      color: pathname === item.path ? THEME.colors.primary : 'inherit'
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${drawerOpen ? drawerWidth : 72}px)`,
          transition: 'width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms'
        }}
      >
        <Toolbar />
        <Container maxWidth="xl">
          {children}
        </Container>
      </Box>
    </Box>
  );
} 