import { IBM_Plex_Mono, Poppins, Space_Grotesk } from "next/font/google";

const primary = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-primary",
  display: "swap",
});

const secondary = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-secondary",
  display: "swap",
});

const tertiary = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-tertiary",
  display: "swap",
});

const code = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-code",
  display: "swap",
});

export const fonts = {
  primary,
  secondary,
  tertiary,
  code,
} as const;

export const style = {
  theme: "system",
  brand: "cyan",
  accent: "indigo",
  neutral: "gray",
  solid: "contrast",
  solidStyle: "flat",
  border: "playful",
  surface: "filled",
  transition: "all",
  scaling: "100",
} as const;

export const themeInit = {
  theme: style.theme,
  brand: style.brand,
  accent: style.accent,
  neutral: style.neutral,
  solid: style.solid,
  "solid-style": style.solidStyle,
  border: style.border,
  surface: style.surface,
  transition: style.transition,
  scaling: style.scaling,
  "viz-style": "gradient",
} as const;
