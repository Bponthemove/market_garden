import { createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  palette: {
    primary: {
      light: '#fffbee',
      main: '#4aaaf8',
    },
    secondary: {
      light: '#36b44b',
      main: '#fff',
    },                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
  },
  typography: {
    fontFamily: [
      'Lora',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    allVariants: {
      color: '#4aaaf8'
    }
  }
});

export const mainStyles = (theme: { pallete: { secondary: { main: any; }; }; }) => ({
  backgroundColor: theme.pallete.secondary.main
})