'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
        main: '#3f51b5', // Your primary color
    },
    secondary: {
        main: '#778899', // Your secondary color
    },
},
});

export default theme;
