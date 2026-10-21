"use client";

import {
  ChakraProvider,
  createSystem,
  defaultConfig,
} from "@chakra-ui/react";
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";

const system = createSystem(defaultConfig, { preflight: false });

export function Provider(props: ThemeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        {...props}
      />
    </ChakraProvider>
  );
}
