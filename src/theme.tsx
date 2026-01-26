import {createTheme} from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0085ff',
    },
    background: {
      default: '#161e27',
      paper: '#1f2937',
    },
    text: {
      primary: '#ffffff',
      secondary: '#9ca3af',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  }
});

export default theme;