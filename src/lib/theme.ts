import { createTheme } from '@mui/material/styles';

// Brand colors
const colors = {
  green: '#0F9D58',
  yellow: '#F4B400',
  red: '#DB4437',
  black: '#000000',
  white: '#FFFFFF',
};

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: colors.green,
      contrastText: colors.white,
    },
    secondary: {
      main: colors.yellow,
      contrastText: colors.black,
    },
    error: {
      main: colors.red,
    },
    background: {
      default: colors.white,
      paper: colors.white,
    },
    text: {
      primary: colors.black,
      secondary: colors.green,
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2.5rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    subtitle1: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 24px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

export default theme;
export { colors }; 