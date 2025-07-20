'use client';

import { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert
} from '@mui/material';
import { Menu as MenuIcon, ShoppingCart, Instagram, YouTube, WhatsApp, LocalShipping } from '@mui/icons-material';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BUSINESS_INFO, THEME } from '@/lib/constants';
import { useCart } from '@/lib/CartContext';

const INSTAGRAM_URL = 'https://www.instagram.com/fafresh.cultural.fashion/';

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { items } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const isHomePage = pathname === '/';
  const [trackingDialogOpen, setTrackingDialogOpen] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [trackingError, setTrackingError] = useState('');

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    setIsClient(true);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTrackOrder = () => {
    if (!orderId.trim()) {
      setTrackingError('Please enter an order ID');
      return;
    }
    router.push(`/order-tracking/${orderId.trim()}`);
    setTrackingDialogOpen(false);
    setOrderId('');
    setTrackingError('');
  };

  const menuItems = [
    { label: 'Home', path: '/' },
    { 
      label: 'Customize', 
      path: '/customize',
      highlight: true 
    },
    { label: 'Shop', path: '/shop' },
    { label: 'Contact', path: '/contact' },
    { 
      label: 'Track Order', 
      action: () => setTrackingDialogOpen(true),
      icon: <LocalShipping sx={{ mr: 1 }} />
    }
  ];

  const SocialLinks = () => (
    <Stack direction="row" spacing={1}>
      <IconButton
        component="a"
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        size="small"
        sx={{ color: 'white' }}
      >
        <Instagram />
      </IconButton>
      <IconButton
        component="a"
        href={BUSINESS_INFO.youtubeUrl}
        target="_blank"
        rel="noopener noreferrer"
        size="small"
        sx={{ color: 'white' }}
      >
        <YouTube />
      </IconButton>
      <IconButton
        component="a"
        href={BUSINESS_INFO.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        size="small"
        sx={{
          color: '#25D366',
          '&:hover': { color: '#128C7E' }
        }}
      >
        <WhatsApp />
      </IconButton>
    </Stack>
  );

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{ 
          bgcolor: isClient && isHomePage && !isScrolled ? 'transparent' : 'rgba(33, 33, 33, 0.95)',
          boxShadow: isClient && isHomePage && !isScrolled ? 'none' : 1,
          backdropFilter: isClient && isHomePage && !isScrolled ? 'none' : 'blur(10px)',
          transition: 'all 0.3s ease'
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            {/* Logo */}
            <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 120, height: 50, position: 'relative' }}>
                <Image
                  src="/images/fafresh-logo-white.png"
                  alt={BUSINESS_INFO.brandName}
                  fill
                  sizes="120px"
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </Box>
            </Link>

            {/* Desktop Menu */}
            {!isMobile && (
              <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: 'auto' }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.path || item.label}
                    {...(item.path ? {
                      component: Link,
                      href: item.path
                    } : {
                      onClick: item.action
                    })}
                    sx={{
                      color: 'white',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      '&::after': item.highlight ? {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '2px',
                        bgcolor: THEME.colors.accent,
                        transform: pathname === item.path ? 'scaleX(1)' : 'scaleX(0)',
                        transition: 'transform 0.3s ease'
                      } : {},
                      '&:hover::after': item.highlight ? {
                        transform: 'scaleX(1)'
                      } : {},
                      ...(pathname === item.path && {
                        color: THEME.colors.accent,
                        fontWeight: 'bold'
                      })
                    }}
                  >
                    {item.icon}
                    {item.label}
                  </Button>
                ))}
                <Box sx={{ mx: 2 }}>
                  <SocialLinks />
                </Box>
                <IconButton
                  component={Link}
                  href="/cart"
                  sx={{
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                    '&:hover': {
                      border: '1px solid rgba(255,255,255,0.8)',
                      bgcolor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  <Badge 
                    badgeContent={cartItemCount} 
                    color="error"
                    showZero={false}
                    sx={{
                      '& .MuiBadge-badge': {
                        backgroundColor: THEME.colors.secondary,
                        color: 'white',
                        fontWeight: 600
                      }
                    }}
                  >
                    <ShoppingCart />
                  </Badge>
                </IconButton>
              </Stack>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
                <SocialLinks />
                <IconButton
                  onClick={() => setMobileMenuOpen(true)}
                  sx={{ color: 'white' }}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <Box sx={{ width: 250, pt: 2 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem 
                key={item.path || item.label}
                onClick={() => {
                  if (item.action) {
                    item.action();
                  } else if (item.path) {
                    router.push(item.path);
                  }
                  setMobileMenuOpen(false);
                }}
                sx={{
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
              >
                <ListItemText 
                  primary={
                    <Typography sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      color: pathname === item.path ? THEME.colors.primary : 'inherit',
                      fontWeight: pathname === item.path ? 'bold' : 'normal'
                    }}>
                      {item.icon}
                      {item.label}
                    </Typography>
                  } 
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Track Order Dialog */}
      <Dialog 
        open={trackingDialogOpen} 
        onClose={() => {
          setTrackingDialogOpen(false);
          setOrderId('');
          setTrackingError('');
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocalShipping /> Track Your Order
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter your order ID to track your order status
          </Typography>
          <TextField
            fullWidth
            label="Order ID"
            value={orderId}
            onChange={(e) => {
              setOrderId(e.target.value);
              setTrackingError('');
            }}
            error={!!trackingError}
            helperText={trackingError}
            placeholder="e.g., FAF-1234567890"
            sx={{ mt: 1 }}
          />
          {trackingError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {trackingError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => {
              setTrackingDialogOpen(false);
              setOrderId('');
              setTrackingError('');
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleTrackOrder}
            startIcon={<LocalShipping />}
          >
            Track Order
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header; 