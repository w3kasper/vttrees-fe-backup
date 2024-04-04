// src/theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4c7043', // This is the Material-UI green color. Replace with your preferred shade of green.
    },
    background: {
        default: '#f1f5f0', // This is a light gray color. Replace with your preferred background color.
      },
  },
});

export default theme;