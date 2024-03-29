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

const fontFamily = [
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
].join(",");

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
    fontFamily,
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

appTheme.typography.h2 = {
  fontSize: "2.4rem",
  [appTheme.breakpoints.up("md")]: {
    fontSize: "3.75rem",
  },
  fontFamily
};

appTheme.typography.h4 = {
  fontSize: "1.6rem",
  [appTheme.breakpoints.up("md")]: {
    fontSize: "2.125rem",
  },
  fontFamily
};

appTheme.typography.body1 = {
  fontSize: "1rem",
  [appTheme.breakpoints.up("md")]: {
    fontSize: "1.45rem",
  },
  fontFamily
};

export const mainStyles = (theme: {
  pallete: { secondary: { main: any } };
}) => ({
  backgroundColor: theme.pallete.secondary.main,
});
