'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CartProvider } from '@/lib/CartContext';
import theme from '@/lib/theme';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        {children}
      </CartProvider>
    </ThemeProvider>
  );
} 