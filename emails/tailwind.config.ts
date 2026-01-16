import { pixelBasedPreset } from "@react-email/components";
import type { Config } from "tailwindcss";

const colors = {
  background: "#FFFFFF",
  foreground: "#0A0A0A",
  destructive: "#E7000B",
  border: "#E5E5E5",
  input: "#E5E5E5",
  ring: "#A1A1A1",

  primary: {
    DEFAULT: "#171717",
    foreground: "#FAFAFA",
  },
  secondary: {
    DEFAULT: "#F5F5F5",
    foreground: "#171717",
  },
  muted: {
    DEFAULT: "#F5F5F5",
    foreground: "#737373",
  },
  accent: {
    DEFAULT: "#F5F5F5",
    foreground: "#171717",
  },
} as const;

const borderRadius = {
  sm: "6px",
  md: "8px",
  lg: "10px",
  xl: "14px",
} as const;

/**
 * Shared Tailwind configuration for React Email templates
 *
 * Usage in email templates:
 * ```tsx
 * import { Tailwind } from "@react-email/components";
 * import { emailTailwindConfig } from "./tailwind.config";
 *
 * <Tailwind config={emailTailwindConfig}>
 *   {/* Your email content *\/}
 * </Tailwind>
 * ```
 */
export const emailTailwindConfig: Omit<Config, "content"> = {
  presets: [pixelBasedPreset],

  theme: {
    extend: {
      colors,
      borderRadius,
    },
  },
} as const;
