"use client";

import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface TypographyVariants {
    title: React.CSSProperties;
    titleModal: React.CSSProperties;
    descModal: React.CSSProperties;
    button: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    title: React.CSSProperties;
    titleModal: React.CSSProperties;
    descModal: React.CSSProperties;
    button: React.CSSProperties;
  }

  interface Palette {
    ats: Palette["primary"];
  }

  interface PaletteOptions {
    ats?: PaletteOptions["primary"];
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    ats: true;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    title: true;
    titleModal: true;
    descModal: true;
    button: true;
  }
}

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#fbc7d4",
    },
  },
});

export const customTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#153448",
    },
    ats: createTheme().palette.augmentColor({
      color: {
        main: "#181C14",
      },
      name: "ats",
    }),
  },
  typography: {
    allVariants: {
      fontFamily: ["Sarabun", "sans-serif"].join(","),
      fontWeight: 300,
    },
    title: { fontSize: "2rem" },
    titleModal: { fontSize: "1.5rem" },
    descModal: { fontSize: "1rem" },
    button: { fontSize: "16px", textTransform: "none" },
  },
  components: {
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          title: "h1",
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        asterisk: {
          color: "#db3131",
          "&$error": {
            color: "#db3131",
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          fill: "#181C14",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        sizeSmall: {
          color: "#181C14",
        },
        sizeMedium: {
          color: "#181C14",
        },
        sizeLarge: {
          color: "#181C14",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
          {
            borderColor: "#181C14",
          },
          "& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline":
          {
            borderColor: "#bdbdbd",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#181C14",
          },
        },
      },
    }
  },
});
