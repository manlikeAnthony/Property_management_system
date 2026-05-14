import type { PropsWithChildren } from "react";
import { useTheme } from "@/hooks/use-theme";

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  useTheme();

  return children;
};
