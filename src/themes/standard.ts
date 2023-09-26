import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    light: Palette["primary"];
    dark: Palette["primary"];
  }

  interface PaletteOptions {
    light?: PaletteOptions["primary"];
    dark?: PaletteOptions["primary"];
  }
}

export const appTheme = createTheme({
  palette: {
    primary: {
      light: "#35d44f",
      main: "#12af83",
    },
    secondary: {
      light: "#57aff7",
      main: "#4aaaf8",
    },
    light: { main: "#f5f5f5" },
    dark: { main: "#000" },
  },
  typography: {
    fontFamily: [
      "Lora",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    h6: {
      fontSize: "15px",
    },
    subtitle2: {
      fontSize: "11px",
    },
    button: {
      textTransform: "none",
    },
    // allVariants: {
    //   color: '#4aaaf8'
    // }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: "#4aaaf8",
        },
      },
    },
  },
});

export const mainStyles = (theme: {
  pallete: { secondary: { main: any } };
}) => ({
  backgroundColor: theme.pallete.secondary.main,
});
