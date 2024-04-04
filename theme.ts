// src/theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4c7043', // This is the Material-UI green color. Replace with your preferred shade of green.
    },
    background: {
        default: '#e7ebe6', // This is a light gray color. Replace with your preferred background color.
      },
      text: {
        primary: '#373b34', // dark gray
      },
  },
  typography: {
    fontFamily: 'Poppins, Arial, sans-serif',
  },
});

export default theme;