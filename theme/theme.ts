import { createTheme } from "@mui/material/styles";

export const lookupTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#9ac7ff",
    },
    background: {
      default: "#0b1018",
      paper: "#111927",
    },
    divider: "rgba(154, 199, 255, 0.14)",
    text: {
      primary: "#edf3ff",
      secondary: "#91a0bb",
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: [
      '"IBM Plex Sans"',
      '"Segoe UI"',
      "-apple-system",
      "BlinkMacSystemFont",
      "sans-serif",
    ].join(","),
    h1: {
      fontSize: "2.4rem",
      fontWeight: 600,
      letterSpacing: "-0.04em",
    },
    button: {
      fontWeight: 600,
      letterSpacing: "0.02em",
      textTransform: "none",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage:
            "radial-gradient(circle at top, rgba(66, 90, 128, 0.22), transparent 40%), linear-gradient(180deg, #0b1018 0%, #070b12 100%)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid rgba(154, 199, 255, 0.1)",
        },
      },
    },
  },
});
