import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/lib/theme';

interface WrapperProps {
  children: React.ReactNode;
  session?: any;
}

function Wrapper({ children, session = null }: WrapperProps) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}

function render(ui: React.ReactElement, { session, ...options }: { session?: any } = {}) {
  return rtlRender(ui, {
    wrapper: ({ children }) => <Wrapper session={session}>{children}</Wrapper>,
    ...options
  });
}

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { render }; 