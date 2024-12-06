"use client";

import { ThemeProvider, CssBaseline } from "@mui/material";
// import { customTheme } from "./themes";

function ThemesProvider({ children }: React.PropsWithChildren) {
  return (
    <ThemeProvider theme={[]} /* theme={customTheme} */>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export default ThemesProvider;
