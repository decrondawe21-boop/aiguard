'use client';

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Background } from "@once-ui-system/core/components/Background";
import { Badge } from "@once-ui-system/core/components/Badge";
import { BlockQuote } from "@once-ui-system/core/components/BlockQuote";
import { Button } from "@once-ui-system/core/components/Button";
import { Carousel } from "@once-ui-system/core/components/Carousel";
import { Column } from "@once-ui-system/core/components/Column";
import { Fade } from "@once-ui-system/core/components/Fade";
import { Line } from "@once-ui-system/core/components/Line";
import { MatrixFx } from "@once-ui-system/core/components/MatrixFx";
import { Mask } from "@once-ui-system/core/components/Mask";
import { RevealFx } from "@once-ui-system/core/components/RevealFx";
import { Text } from "@once-ui-system/core/components/Text";
import { WeatherFx } from "@once-ui-system/core/components/WeatherFx";
import { useStyle, useTheme } from "@once-ui-system/core/contexts";
import type {
  BorderStyle,
  SolidStyle,
  SolidType,
  SurfaceStyle,
  TransitionStyle,
} from "@once-ui-system/core/contexts";
import { MegaMenu } from "@once-ui-system/core/modules";
import { style as defaultOnceUiStyle } from "../resources/once-ui.config";
import { renderSectionPage } from "./components/architecture/SectionPages";
import { StylePanel } from "./components/style/StylePanel";
import {
  aiGuardMegaMenuGroups,
  type MegaMenuGroup,
  type MenuHref,
  ultimateMegaMenuGroups,
} from "./mocks/megaMenuData";
import {
  Activity,
  Check,
  ChevronRight,
  ClipboardList,
  Cpu,
  Database,
  Fingerprint,
  FileText,
  Flag,
  Globe,
  Gift,
  Layout,
  Loader2,
  Menu,
  Monitor,
  MoonStar,
  Network,
  Rocket,
  Send,
  Shield,
  SlidersHorizontal,
  Sparkles,
  TriangleAlert,
  Terminal,
  UserRound,
  Eye,
  Search,
  X,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type AppPage = "ultimate" | "ai-guard" | "philosophy" | "detection" | "defense" | "build";
type SectionPage = Exclude<AppPage, "ultimate">;
type ActiveTab = "brand" | "bodyguard";
type CSSVariableStyle = React.CSSProperties & Partial<Record<`--${string}`, string | number>>;
type ParsedInternalHref = {
  pathname: string;
  hash: string;
};
type MobileMenuGroup = MegaMenuGroup & {
  selected?: boolean;
};
type MobileMenuPanelProps = {
  menuGroups: MobileMenuGroup[];
  onClose: () => void;
  onOpenSettings: () => void;
  activeTab: ActiveTab;
  pathname: string;
  currentHash: string;
};
type HeroRevealPanelProps = {
  variant?: ActiveTab;
  theme?: SurfaceTheme["panel"];
  eyebrow: string;
  title: string;
  copy: string;
  href: MenuHref;
  cta: string;
};
type SurfaceTheme = {
  panel: {
    gradientStart: string;
    gradientEnd: string;
    line: string;
    dots: string;
  };
  title: {
    gradientStart: string;
    gradientEnd: string;
    line: string;
    dots: string;
    matrixColors: string[];
    leafColors: string[];
  };
};

const DEFAULT_STYLE_STATE = {
  brand: defaultOnceUiStyle.brand as ThemeColorName,
  accent: defaultOnceUiStyle.accent as ThemeColorName,
  neutral: defaultOnceUiStyle.neutral as ThemeColorName,
  border: defaultOnceUiStyle.border,
  solid: defaultOnceUiStyle.solid,
  solidStyle: defaultOnceUiStyle.solidStyle,
  surface: defaultOnceUiStyle.surface,
  transition: defaultOnceUiStyle.transition,
  scaling: defaultOnceUiStyle.scaling,
} as const;

const INITIAL_RESOLVED_THEME: ResolvedThemeMode = "light";

type FxMask = {
  x: number;
  y: number;
  radius: number;
};
type FxPanelProps = {
  variant: ActiveTab;
  theme?: SurfaceTheme["panel"];
  className?: string;
  mask?: FxMask;
  children: React.ReactNode;
};
type OnePageCardProps = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  highlights: string[];
  tone?: "warm" | "cool" | "neutral" | "safe";
};
type TitleFrameProps = {
  variant: ActiveTab;
  theme?: SurfaceTheme["title"];
  active: boolean;
  as: "h1" | "h2" | "h3";
  title: string;
  description?: string;
  descriptionClassName?: string;
  onHoverStart: () => void;
  onHoverEnd: () => void;
};
type AiResponse = {
  human: string;
  machine: string;
};

type ResolvedThemeMode = "light" | "dark";
type ThemeColorName =
  | "blue"
  | "aqua"
  | "magenta"
  | "pink"
  | "yellow"
  | "orange"
  | "red"
  | "moss"
  | "green"
  | "emerald"
  | "cyan"
  | "violet"
  | "indigo"
  | "gray"
  | "sand"
  | "slate"
  | "dusk"
  | "mint"
  | "rose"
  | "white";
type ShellThemeConfig = {
  activeTab: ActiveTab;
  resolvedTheme: ResolvedThemeMode;
  brand: string;
  accent: string;
  neutral: string;
  border: BorderStyle | "sharp";
  solid: SolidType;
  solidStyle: SolidStyle;
  surface: SurfaceStyle;
  transition: TransitionStyle;
};

const cssVars = (style: CSSVariableStyle) => style;
const whiteRgb = "255, 255, 255";
const blackRgb = "5, 8, 12";
const schemeRgbMap: Record<ThemeColorName, string> = {
  blue: "96, 165, 250",
  aqua: "56, 189, 248",
  magenta: "217, 70, 239",
  pink: "244, 114, 182",
  yellow: "251, 191, 36",
  orange: "249, 115, 22",
  red: "248, 113, 113",
  moss: "163, 230, 53",
  green: "74, 222, 128",
  emerald: "52, 211, 153",
  cyan: "34, 211, 238",
  violet: "196, 181, 253",
  indigo: "129, 140, 248",
  gray: "148, 163, 184",
  sand: "214, 211, 209",
  slate: "100, 116, 139",
  dusk: "167, 139, 250",
  mint: "161, 251, 142",
  rose: "251, 113, 133",
  white: whiteRgb,
};
const radiusByBorder: Record<BorderStyle | "sharp", { shell: string; panel: string; inset: string; pill: string }> = {
  sharp: { shell: "1rem", panel: "0.95rem", inset: "0.8rem", pill: "999px" },
  conservative: { shell: "1.2rem", panel: "1.05rem", inset: "0.92rem", pill: "999px" },
  playful: { shell: "1.75rem", panel: "1.5rem", inset: "1.2rem", pill: "999px" },
  rounded: { shell: "2.15rem", panel: "1.9rem", inset: "1.45rem", pill: "999px" },
};
const transitionByMode: Record<TransitionStyle, { fast: string; base: string; slow: string }> = {
  none: { fast: "0ms", base: "0ms", slow: "0ms" },
  micro: { fast: "120ms", base: "160ms", slow: "220ms" },
  macro: { fast: "220ms", base: "300ms", slow: "420ms" },
  all: { fast: "180ms", base: "240ms", slow: "340ms" },
};

const rgba = (rgb: string, alpha: number) => `rgba(${rgb}, ${alpha})`;

const resolveRgb = (token: string, fallback: ThemeColorName) =>
  schemeRgbMap[token as ThemeColorName] ?? schemeRgbMap[fallback];

const getWorldPalette = (variant: ActiveTab) =>
  variant === "brand"
    ? {
        primaryRgb: schemeRgbMap.orange,
        secondaryRgb: schemeRgbMap.pink,
        supportRgb: schemeRgbMap.yellow,
      }
    : {
        primaryRgb: schemeRgbMap.cyan,
        secondaryRgb: schemeRgbMap.blue,
        supportRgb: schemeRgbMap.mint,
      };

const createSurfaceTheme = (
  variant: ActiveTab,
  resolvedTheme: ResolvedThemeMode,
): SurfaceTheme => {
  const { primaryRgb, secondaryRgb, supportRgb } = getWorldPalette(variant);
  const bright = resolvedTheme === "light";

  return {
    panel: {
      gradientStart: rgba(primaryRgb, bright ? 0.22 : 0.18),
      gradientEnd: rgba(secondaryRgb, bright ? 0.08 : 0.04),
      line: rgba(supportRgb, bright ? 0.34 : 0.22),
      dots: rgba(whiteRgb, bright ? 0.28 : 0.18),
    },
    title: {
      gradientStart: rgba(primaryRgb, bright ? 0.28 : 0.2),
      gradientEnd: "rgba(255, 255, 255, 0)",
      line: rgba(supportRgb, bright ? 0.34 : 0.24),
      dots: rgba(whiteRgb, bright ? 0.28 : 0.18),
      matrixColors: [
        rgba(whiteRgb, bright ? 0.99 : 0.94),
        rgba(supportRgb, bright ? 0.96 : 0.82),
        rgba(primaryRgb, bright ? 0.9 : 0.78),
        rgba(secondaryRgb, bright ? 0.84 : 0.72),
        rgba(whiteRgb, bright ? 0.68 : 0.56),
      ],
      leafColors: [
        rgba(supportRgb, bright ? 0.92 : 0.86),
        rgba(primaryRgb, bright ? 0.88 : 0.82),
        rgba(secondaryRgb, bright ? 0.82 : 0.74),
      ],
    },
  };
};

const createShellVars = ({
  activeTab,
  resolvedTheme,
  brand,
  accent,
  neutral,
  border,
  solid,
  solidStyle,
  surface,
  transition,
}: ShellThemeConfig): CSSVariableStyle => {
  const uiBrandRgb = resolveRgb(brand, activeTab === "brand" ? "orange" : "cyan");
  const uiAccentRgb = resolveRgb(accent, activeTab === "brand" ? "pink" : "blue");
  const neutralRgb = resolveRgb(neutral, activeTab === "brand" ? "sand" : "gray");
  const {
    primaryRgb: worldPrimaryRgb,
    secondaryRgb: worldSecondaryRgb,
    supportRgb: worldSupportRgb,
  } = getWorldPalette(activeTab);
  const radii = radiusByBorder[border];
  const transitions = transitionByMode[transition];
  const isLight = resolvedTheme === "light";
  const filledSurface = surface === "filled";
  const plasticSurface = solidStyle === "plastic";
  const contrastSolid = solid === "contrast";
  const inverseSolid = solid === "inverse";
  const baseColor =
    activeTab === "brand"
      ? isLight
        ? "#ffffff"
        : "#020202"
      : isLight
        ? "#f7fcfd"
        : "#010304";
  const panelStart = isLight
    ? filledSurface
      ? "rgba(255, 255, 255, 0.84)"
      : "rgba(255, 255, 255, 0.62)"
    : rgba(blackRgb, filledSurface ? 0.82 : 0.64);
  const panelEnd = isLight
    ? filledSurface
      ? "rgba(247, 250, 252, 0.96)"
      : "rgba(248, 250, 252, 0.74)"
    : rgba(blackRgb, filledSurface ? 0.9 : 0.7);
  const textStrong = isLight ? "rgba(15, 23, 42, 0.985)" : "rgba(248, 250, 252, 0.96)";
  const textMuted = isLight ? "rgba(30, 41, 59, 0.84)" : "rgba(209, 213, 219, 0.78)";
  const textSubtle = isLight ? "rgba(51, 65, 85, 0.74)" : "rgba(255, 255, 255, 0.58)";
  const textEyebrow = isLight ? "rgba(51, 65, 85, 0.64)" : "rgba(255, 255, 255, 0.42)";
  const outline = isLight ? "rgba(15, 23, 42, 0.1)" : "rgba(255, 255, 255, 0.08)";
  const outlineStrong = isLight ? "rgba(15, 23, 42, 0.16)" : "rgba(255, 255, 255, 0.14)";
  const chipBg = isLight ? "rgba(255, 255, 255, 0.56)" : "rgba(255, 255, 255, 0.05)";
  const chipBgSoft = isLight ? "rgba(255, 255, 255, 0.46)" : "rgba(255, 255, 255, 0.03)";
  const controlActiveBg = inverseSolid
    ? "rgba(15, 23, 42, 0.92)"
    : contrastSolid
      ? rgba(uiBrandRgb, isLight ? 0.92 : 0.88)
      : rgba(worldSupportRgb, isLight ? 0.22 : 0.18);
  const controlActiveText = inverseSolid
    ? "rgba(255, 255, 255, 0.96)"
    : isLight
      ? "rgba(15, 23, 42, 0.96)"
      : "rgba(4, 6, 10, 0.96)";

  return cssVars({
    "--app-shell-base-color": baseColor,
    "--app-shell-text-color": textStrong,
    "--app-shell-text-muted": textMuted,
    "--app-shell-text-subtle": textSubtle,
    "--app-shell-text-eyebrow": textEyebrow,
    "--app-shell-text-inverse": isLight ? "rgba(255, 255, 255, 0.96)" : "rgba(15, 23, 42, 0.96)",
    "--app-shell-primary-rgb": uiBrandRgb,
    "--app-shell-secondary-rgb": uiAccentRgb,
    "--app-shell-neutral-rgb": neutralRgb,
    "--app-shell-support-rgb": worldSupportRgb,
    "--app-shell-body-sheen": isLight ? "rgba(255, 255, 255, 0.68)" : "rgba(255, 255, 255, 0.025)",
    "--app-shell-body-radial-a": rgba(worldPrimaryRgb, isLight ? (activeTab === "brand" ? 0.24 : 0.2) : 0.1),
    "--app-shell-body-radial-b": rgba(worldSecondaryRgb, isLight ? (activeTab === "brand" ? 0.22 : 0.18) : 0.08),
    "--app-shell-body-radial-c": rgba(worldSupportRgb, isLight ? (activeTab === "brand" ? 0.24 : 0.2) : 0.08),
    "--app-shell-body-radial-d": rgba(neutralRgb, isLight ? 0.12 : 0.06),
    "--app-shell-vignette-inner": isLight
      ? activeTab === "brand"
        ? "rgba(157, 23, 77, 0.08)"
        : "rgba(37, 99, 235, 0.08)"
      : "rgba(2, 2, 2, 0.16)",
    "--app-shell-vignette-edge": isLight
      ? activeTab === "brand"
        ? "rgba(136, 19, 55, 0.26)"
        : "rgba(30, 64, 175, 0.24)"
      : "rgba(2, 2, 2, 0.88)",
    "--app-shell-vignette-top": isLight
      ? activeTab === "brand"
        ? "rgba(190, 24, 93, 0.08)"
        : "rgba(14, 116, 144, 0.08)"
      : "rgba(2, 2, 2, 0.18)",
    "--app-shell-vignette-bottom": isLight
      ? activeTab === "brand"
        ? "rgba(131, 24, 67, 0.34)"
        : "rgba(30, 58, 138, 0.34)"
      : "rgba(2, 2, 2, 0.42)",
    "--app-surface-bg-start": panelStart,
    "--app-surface-bg-end": panelEnd,
    "--app-surface-border": outline,
    "--app-surface-border-strong": rgba(uiBrandRgb, isLight ? 0.32 : 0.18),
    "--app-surface-highlight": isLight
      ? plasticSurface
        ? "rgba(255, 255, 255, 0.72)"
        : "rgba(255, 255, 255, 0.42)"
      : plasticSurface
        ? "rgba(255, 255, 255, 0.08)"
        : "rgba(255, 255, 255, 0.04)",
    "--app-surface-shadow": isLight
      ? plasticSurface
        ? "rgba(15, 23, 42, 0.18)"
        : "rgba(15, 23, 42, 0.12)"
      : plasticSurface
        ? "rgba(0, 0, 0, 0.42)"
        : "rgba(0, 0, 0, 0.34)",
    "--app-surface-warm-a": rgba(worldPrimaryRgb, isLight ? 0.16 : 0.12),
    "--app-surface-warm-b": rgba(worldSecondaryRgb, isLight ? 0.14 : 0.1),
    "--app-surface-cool-a": rgba(worldSecondaryRgb, isLight ? 0.14 : 0.1),
    "--app-surface-cool-b": rgba(worldSupportRgb, isLight ? 0.12 : 0.08),
    "--app-surface-cool-c": rgba(worldPrimaryRgb, isLight ? 0.14 : 0.08),
    "--app-shell-panel-grid-dot": rgba(whiteRgb, isLight ? 0.18 : 0.1),
    "--app-shell-topbar-bg": isLight
      ? activeTab === "brand"
        ? "rgba(255, 244, 249, 0.62)"
        : "rgba(247, 252, 255, 0.4)"
      : "rgba(5, 5, 8, 0.16)",
    "--app-shell-topbar-bg-scrolled": isLight
      ? activeTab === "brand"
        ? "rgba(255, 240, 247, 0.9)"
        : "rgba(244, 251, 255, 0.74)"
      : "rgba(8, 9, 12, 0.68)",
    "--app-shell-topbar-border": isLight
      ? activeTab === "brand"
        ? "rgba(190, 24, 93, 0.12)"
        : "rgba(15, 23, 42, 0.08)"
      : "rgba(255, 255, 255, 0.06)",
    "--app-shell-overlay-backdrop": isLight ? "rgba(12, 16, 22, 0.38)" : "rgba(2, 2, 4, 0.58)",
    "--app-shell-mega-bg": isLight
      ? activeTab === "brand"
        ? "rgba(255, 250, 253, 0.94)"
        : "rgba(248, 252, 255, 0.94)"
      : "rgba(10, 10, 14, 0.96)",
    "--app-shell-nebula-filter":
      activeTab === "brand"
        ? `saturate(${isLight ? "1.18" : "1.08"}) brightness(${isLight ? "1.08" : "1"})`
        : `saturate(${isLight ? "1.42" : "1.3"}) brightness(${isLight ? "1.14" : "1.08"})`,
    "--app-shell-nebula-opacity": "1",
    "--app-shell-nebula-dot": isLight ? "rgba(15, 23, 42, 0.12)" : rgba(whiteRgb, 0.08),
    "--app-shell-matrix-dot": isLight ? rgba(worldPrimaryRgb, activeTab === "brand" ? 0.58 : 0.4) : rgba(whiteRgb, 0.16),
    "--app-shell-matrix-dot-secondary": isLight ? rgba(worldSecondaryRgb, activeTab === "brand" ? 0.5 : 0.36) : rgba(whiteRgb, 0.08),
    "--app-shell-matrix-wrap-opacity": String(
      activeTab === "brand" ? (isLight ? 0.98 : 0.52) : isLight ? 0.92 : 0.62,
    ),
    "--app-shell-matrix-wrap-filter": `blur(${activeTab === "brand" ? "0.16px" : "0.22px"}) saturate(${isLight ? (activeTab === "brand" ? "254%" : "216%") : "168%"}) brightness(${isLight ? (activeTab === "brand" ? "1.62" : "1.42") : "1.22"})`,
    "--app-shell-topbar-fx-opacity": String(isLight ? (activeTab === "brand" ? 0.9 : 0.72) : 0.34),
    "--app-shell-topbar-fx-filter": isLight
      ? `saturate(${activeTab === "brand" ? "278%" : "228%"}) brightness(${activeTab === "brand" ? "1.4" : "1.24"})`
      : "saturate(160%) brightness(1.08)",
    "--app-shell-title-matrix-opacity": String(isLight ? (activeTab === "brand" ? 1 : 0.98) : 0.88),
    "--app-shell-title-matrix-filter": isLight
      ? `saturate(${activeTab === "brand" ? "264%" : "214%"}) brightness(${activeTab === "brand" ? "1.56" : "1.34"})`
      : "saturate(184%) brightness(1.18)",
    "--app-shell-outline": outline,
    "--app-shell-outline-strong": outlineStrong,
    "--app-shell-chip-bg": chipBg,
    "--app-shell-chip-bg-soft": chipBgSoft,
    "--app-shell-control-active-bg": controlActiveBg,
    "--app-shell-control-active-text": controlActiveText,
    "--app-shell-radius-shell": radii.shell,
    "--app-shell-radius-panel": radii.panel,
    "--app-shell-radius-inset": radii.inset,
    "--app-shell-radius-pill": radii.pill,
    "--app-shell-transition-fast": transitions.fast,
    "--app-shell-transition-base": transitions.base,
    "--app-shell-transition-slow": transitions.slow,
  });
};

const projectIdeas = [
  "Quantum Privacy Shield",
  "Neural Auth Protocol",
  "Bio-Metric Mesh",
];

const mobileMenuIconMap: Record<string, LucideIcon> = {
  sparkle: Sparkles,
  gift: Gift,
  computer: Monitor,
  security: Shield,
  dark: MoonStar,
  document: FileText,
  person: UserRound,
  world: Globe,
  screen: Monitor,
  eye: Eye,
  check: Check,
  wordmark: FileText,
  search: Search,
  warning: TriangleAlert,
  smiley: Sparkles,
  flag: Flag,
  clipboard: ClipboardList,
};

const isExternalHref = (href: string) => /^https?:\/\//.test(href);

const defaultSectionHrefs = {
  "/": "/#ultimate-overview",
  "/ai-guard": "/ai-guard",
  "/ai-guard/philosophy": "/ai-guard/philosophy#war-for-attention",
  "/ai-guard/detection": "/ai-guard/detection#triad-of-truth",
  "/ai-guard/defense": "/ai-guard/defense#fog-screen",
  "/ai-guard/build": "/ai-guard/build#hgx-h100",
} as const satisfies Record<string, MenuHref>;

type DefaultSectionPath = keyof typeof defaultSectionHrefs;

const parseInternalHref = (href: string): ParsedInternalHref | null => {
  if (!href || isExternalHref(href)) return null;

  const [pathPart, hashPart] = href.split("#");

  return {
    pathname: pathPart && pathPart.length > 0 ? pathPart : "/",
    hash: hashPart ? `#${hashPart}` : "",
  };
};

const isLinkActive = (href: string, pathname: string, currentHash: string) => {
  const parsedHref = parseInternalHref(href);

  if (!parsedHref || parsedHref.pathname !== pathname) {
    return false;
  }

  if (parsedHref.hash) {
    if (currentHash) {
      return parsedHref.hash === currentHash;
    }

    if (pathname in defaultSectionHrefs) {
      return defaultSectionHrefs[pathname as DefaultSectionPath] === href;
    }

    return false;
  }

  return true;
};

function MobileMenuPanel({
  menuGroups,
  onClose,
  onOpenSettings,
  activeTab,
  pathname,
  currentHash,
}: MobileMenuPanelProps) {
  return (
    <div className="app-mobile-menu xl:hidden">
      <button
        type="button"
        className="app-mobile-menu__backdrop"
        onClick={onClose}
        aria-label="Close navigation"
      />
      <div
        className={`app-mobile-menu__panel app-mobile-menu__panel--${activeTab} surface-frame surface-frame--${
          activeTab === "brand" ? "warm" : "cool"
        }`}
      >
        <div className="app-mobile-menu__header">
          <div>
            <Text as="span" className="app-mobile-menu__eyebrow">
              Navigation
            </Text>
            <Text as="h3" className="app-mobile-menu__title">
              {activeTab === "brand" ? "Ultimate OS" : "AI Bodyguard"}
            </Text>
          </div>
          <button
            type="button"
            className="app-mobile-menu__close"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X size={16} />
          </button>
        </div>

        <div className="app-mobile-menu__groups">
          {menuGroups.map((group) => (
            <section key={group.id} className="app-mobile-menu__group">
              <Text as="span" className="app-mobile-menu__group-label">
                {group.label}
              </Text>
              <div className="app-mobile-menu__section-grid">
                {group.sections.map((section) => (
                  <div key={`${group.id}-${section.title}`} className="app-mobile-menu__section surface-inset">
                    <Text as="span" className="app-mobile-menu__section-title">
                      {section.title}
                    </Text>
                    <div className="app-mobile-menu__links">
                      {section.links.map((link) => {
                        const Icon = mobileMenuIconMap[link.icon] ?? Layout;
                        const isActive = isLinkActive(link.href, pathname, currentHash);
                        const content = (
                          <>
                            <span className="app-mobile-menu__link-icon">
                              <Icon size={15} />
                            </span>
                            <span className="app-mobile-menu__link-body">
                              <span className="app-mobile-menu__link-label">{link.label}</span>
                              <span className="app-mobile-menu__link-copy">{link.description}</span>
                            </span>
                            <span className="app-mobile-menu__link-arrow">
                              <ChevronRight size={14} />
                            </span>
                          </>
                        );

                        return isExternalHref(link.href) ? (
                          <a
                            key={link.href}
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                            className={`app-mobile-menu__link${isActive ? " app-mobile-menu__link--active" : ""}`}
                            onClick={onClose}
                          >
                            {content}
                          </a>
                        ) : (
                          <Link
                            key={link.href}
                            href={link.href}
                            className={`app-mobile-menu__link${isActive ? " app-mobile-menu__link--active" : ""}`}
                            onClick={onClose}
                          >
                            {content}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="app-mobile-menu__footer">
          <button
            type="button"
            className="app-style-overlay__trigger app-style-overlay__trigger--menu"
            onClick={onOpenSettings}
          >
            <SlidersHorizontal size={14} />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function HeroRevealPanel({
  variant = "bodyguard",
  theme,
  eyebrow,
  title,
  copy,
  href,
  cta,
}: HeroRevealPanelProps) {
  return (
    <FxPanel
      variant={variant}
      theme={theme}
      className="hero-reveal-panel min-h-0 p-6 md:p-7"
      mask={variant === "brand" ? { x: 76, y: 50, radius: 64 } : { x: 22, y: 50, radius: 64 }}
    >
      <div className="hero-reveal-panel__content">
        <RevealFx speed="medium">
          <Text as="span" className="hero-reveal-panel__eyebrow">
            {eyebrow}
          </Text>
        </RevealFx>
        <RevealFx delay={0.18} translateY={0.5}>
          <Text as="h3" className="hero-reveal-panel__title">
            {title}
          </Text>
        </RevealFx>
        <RevealFx delay={0.32} translateY={0.9}>
          <Text as="p" className="hero-reveal-panel__copy">
            {copy}
          </Text>
        </RevealFx>
        <RevealFx delay={0.46} translateY={1}>
          <Button
            href={href}
            variant={variant === "brand" ? "secondary" : "primary"}
            size="m"
            suffixIcon="chevronRight"
            className={`hero-reveal-panel__cta hero-reveal-panel__cta--${variant}`}
          >
            {cta}
          </Button>
        </RevealFx>
      </div>
    </FxPanel>
  );
}

const surfaceThemes: Record<ActiveTab, SurfaceTheme> = {
  brand: {
    panel: {
      gradientStart: "rgba(251, 191, 36, 0.18)",
      gradientEnd: "rgba(244, 114, 182, 0.04)",
      line: "rgba(255, 227, 145, 0.26)",
      dots: "rgba(255, 255, 255, 0.2)",
    },
    title: {
      gradientStart: "rgba(249, 115, 22, 0.22)",
      gradientEnd: "rgba(255, 255, 255, 0)",
      line: "rgba(255, 248, 196, 0.26)",
      dots: "rgba(255, 255, 255, 0.22)",
      matrixColors: [
        "rgba(255, 255, 255, 0.94)",
        "rgba(254, 240, 138, 0.82)",
        "rgba(251, 191, 36, 0.76)",
        "rgba(249, 115, 22, 0.72)",
        "rgba(244, 114, 182, 0.62)",
      ],
      leafColors: [
        "rgba(254, 240, 138, 0.88)",
        "rgba(249, 115, 22, 0.82)",
        "rgba(244, 114, 182, 0.76)",
      ],
    },
  },
  bodyguard: {
    panel: {
      gradientStart: "rgba(45, 212, 191, 0.2)",
      gradientEnd: "rgba(96, 165, 250, 0.04)",
      line: "rgba(125, 211, 252, 0.24)",
      dots: "rgba(236, 253, 245, 0.22)",
    },
    title: {
      gradientStart: "rgba(45, 212, 191, 0.2)",
      gradientEnd: "rgba(255, 255, 255, 0)",
      line: "rgba(167, 243, 208, 0.24)",
      dots: "rgba(236, 253, 245, 0.2)",
      matrixColors: [
        "rgba(236, 253, 245, 0.94)",
        "rgba(134, 239, 172, 0.82)",
        "rgba(45, 212, 191, 0.78)",
        "rgba(34, 211, 238, 0.72)",
        "rgba(96, 165, 250, 0.62)",
      ],
      leafColors: [
        "rgba(134, 239, 172, 0.82)",
        "rgba(45, 212, 191, 0.8)",
        "rgba(34, 211, 238, 0.72)",
      ],
    },
  },
};

type ParticlePalette = {
  inner: string;
  core: string;
  mid: string;
  outer: string;
  halo: string;
  glow: string;
};

type AmbientCloudBlueprint = {
  left: string;
  top: string;
  size: number;
  brandColor: string;
  bodyguardColor: string;
  duration: string;
  delay: string;
};

type StarClusterBlueprint = {
  left: string;
  top: string;
  size: number;
  fieldSize: number;
  brandCore: string;
  brandGlow: string;
  bodyguardCore: string;
  bodyguardGlow: string;
  opacity: string;
  duration: string;
  delay: string;
  rotation: string;
};

const brandParticlePalettes: ParticlePalette[] = [
  {
    inner: "rgba(255, 255, 255, 1)",
    core: "rgba(255, 246, 196, 1)",
    mid: "rgba(250, 204, 21, 1)",
    outer: "rgba(249, 115, 22, 0.98)",
    halo: "rgba(253, 224, 71, 0.86)",
    glow: "rgba(249, 115, 22, 0.66)",
  },
  {
    inner: "rgba(255, 255, 255, 1)",
    core: "rgba(255, 228, 236, 1)",
    mid: "rgba(251, 113, 133, 1)",
    outer: "rgba(244, 63, 94, 0.98)",
    halo: "rgba(251, 113, 133, 0.82)",
    glow: "rgba(244, 63, 94, 0.64)",
  },
  {
    inner: "rgba(255, 255, 255, 1)",
    core: "rgba(253, 226, 243, 1)",
    mid: "rgba(244, 114, 182, 1)",
    outer: "rgba(236, 72, 153, 0.98)",
    halo: "rgba(244, 114, 182, 0.82)",
    glow: "rgba(236, 72, 153, 0.62)",
  },
  {
    inner: "rgba(255, 255, 255, 1)",
    core: "rgba(245, 232, 255, 1)",
    mid: "rgba(217, 70, 239, 0.98)",
    outer: "rgba(168, 85, 247, 0.96)",
    halo: "rgba(217, 70, 239, 0.78)",
    glow: "rgba(168, 85, 247, 0.6)",
  },
  {
    inner: "rgba(255, 255, 255, 1)",
    core: "rgba(255, 255, 255, 1)",
    mid: "rgba(255, 247, 237, 1)",
    outer: "rgba(255, 255, 255, 0.94)",
    halo: "rgba(255, 255, 255, 0.82)",
    glow: "rgba(255, 247, 237, 0.58)",
  },
];

const bodyguardParticlePalettes: ParticlePalette[] = [
  {
    inner: "rgba(255, 255, 255, 1)",
    core: "rgba(236, 253, 245, 0.98)",
    mid: "rgba(167, 243, 208, 0.98)",
    outer: "rgba(45, 212, 191, 0.92)",
    halo: "rgba(167, 243, 208, 0.74)",
    glow: "rgba(45, 212, 191, 0.54)",
  },
  {
    inner: "rgba(255, 255, 255, 1)",
    core: "rgba(224, 247, 255, 0.98)",
    mid: "rgba(34, 211, 238, 0.98)",
    outer: "rgba(14, 165, 233, 0.92)",
    halo: "rgba(125, 211, 252, 0.72)",
    glow: "rgba(34, 211, 238, 0.52)",
  },
  {
    inner: "rgba(255, 255, 255, 1)",
    core: "rgba(219, 234, 254, 0.98)",
    mid: "rgba(96, 165, 250, 0.98)",
    outer: "rgba(59, 130, 246, 0.92)",
    halo: "rgba(147, 197, 253, 0.72)",
    glow: "rgba(59, 130, 246, 0.5)",
  },
  {
    inner: "rgba(255, 255, 255, 1)",
    core: "rgba(240, 253, 250, 0.98)",
    mid: "rgba(94, 234, 212, 0.98)",
    outer: "rgba(13, 148, 136, 0.92)",
    halo: "rgba(153, 246, 228, 0.72)",
    glow: "rgba(20, 184, 166, 0.48)",
  },
  {
    inner: "rgba(255, 255, 255, 1)",
    core: "rgba(255, 255, 255, 0.98)",
    mid: "rgba(239, 246, 255, 0.98)",
    outer: "rgba(255, 255, 255, 0.9)",
    halo: "rgba(224, 242, 254, 0.78)",
    glow: "rgba(125, 211, 252, 0.42)",
  },
];

const ambientCloudBlueprints: AmbientCloudBlueprint[] = [
  {
    left: "14%",
    top: "20%",
    size: 420,
    brandColor: "rgba(248, 113, 113, 0.24)",
    bodyguardColor: "rgba(45, 212, 191, 0.18)",
    duration: "34s",
    delay: "-8s",
  },
  {
    left: "78%",
    top: "18%",
    size: 360,
    brandColor: "rgba(251, 191, 36, 0.24)",
    bodyguardColor: "rgba(34, 211, 238, 0.16)",
    duration: "29s",
    delay: "-11s",
  },
  {
    left: "62%",
    top: "46%",
    size: 440,
    brandColor: "rgba(244, 114, 182, 0.22)",
    bodyguardColor: "rgba(96, 165, 250, 0.16)",
    duration: "32s",
    delay: "-4s",
  },
  {
    left: "28%",
    top: "72%",
    size: 390,
    brandColor: "rgba(249, 115, 22, 0.24)",
    bodyguardColor: "rgba(134, 239, 172, 0.16)",
    duration: "36s",
    delay: "-14s",
  },
  {
    left: "84%",
    top: "74%",
    size: 360,
    brandColor: "rgba(217, 70, 239, 0.2)",
    bodyguardColor: "rgba(59, 130, 246, 0.15)",
    duration: "28s",
    delay: "-6s",
  },
  {
    left: "46%",
    top: "28%",
    size: 300,
    brandColor: "rgba(255, 240, 245, 0.16)",
    bodyguardColor: "rgba(224, 242, 254, 0.16)",
    duration: "24s",
    delay: "-10s",
  },
];

const baseStarClusterBlueprints: StarClusterBlueprint[] = [
  {
    left: "18%",
    top: "28%",
    size: 8.5,
    fieldSize: 66,
    brandCore: "rgba(255, 213, 128, 0.98)",
    brandGlow: "rgba(249, 115, 22, 0.62)",
    bodyguardCore: "rgba(167, 243, 208, 0.92)",
    bodyguardGlow: "rgba(45, 212, 191, 0.5)",
    opacity: "0.78",
    duration: "8.4s",
    delay: "-1.6s",
    rotation: "8deg",
  },
  {
    left: "71%",
    top: "24%",
    size: 9.25,
    fieldSize: 72,
    brandCore: "rgba(251, 191, 36, 0.98)",
    brandGlow: "rgba(255, 213, 79, 0.62)",
    bodyguardCore: "rgba(34, 211, 238, 0.9)",
    bodyguardGlow: "rgba(125, 211, 252, 0.38)",
    opacity: "0.74",
    duration: "9.2s",
    delay: "-3.1s",
    rotation: "-12deg",
  },
  {
    left: "61%",
    top: "52%",
    size: 10.25,
    fieldSize: 78,
    brandCore: "rgba(244, 114, 182, 0.98)",
    brandGlow: "rgba(168, 85, 247, 0.58)",
    bodyguardCore: "rgba(96, 165, 250, 0.9)",
    bodyguardGlow: "rgba(34, 211, 238, 0.38)",
    opacity: "0.7",
    duration: "9.8s",
    delay: "-2.4s",
    rotation: "18deg",
  },
  {
    left: "30%",
    top: "70%",
    size: 8.8,
    fieldSize: 68,
    brandCore: "rgba(251, 146, 60, 0.98)",
    brandGlow: "rgba(249, 115, 22, 0.62)",
    bodyguardCore: "rgba(94, 234, 212, 0.88)",
    bodyguardGlow: "rgba(134, 239, 172, 0.34)",
    opacity: "0.7",
    duration: "8.9s",
    delay: "-4.2s",
    rotation: "-10deg",
  },
  {
    left: "82%",
    top: "72%",
    size: 9.6,
    fieldSize: 74,
    brandCore: "rgba(217, 70, 239, 0.98)",
    brandGlow: "rgba(168, 85, 247, 0.58)",
    bodyguardCore: "rgba(255, 255, 255, 0.92)",
    bodyguardGlow: "rgba(96, 165, 250, 0.4)",
    opacity: "0.68",
    duration: "10.1s",
    delay: "-1.8s",
    rotation: "14deg",
  },
];

const seededNoise = (seed: number) => {
  const value = Math.sin(seed * 999.91) * 43758.5453123;
  return value - Math.floor(value);
};

const createAmbientClouds = (variant: ActiveTab) =>
  ambientCloudBlueprints.map((cloud) => ({
    left: cloud.left,
    top: cloud.top,
    size: cloud.size,
    color: variant === "brand" ? cloud.brandColor : cloud.bodyguardColor,
    duration: cloud.duration,
    delay: cloud.delay,
  }));

const createStarClusters = (variant: ActiveTab) =>
  baseStarClusterBlueprints.map((cluster, clusterIndex) => ({
    left: cluster.left,
    top: cluster.top,
    size: cluster.size,
    fieldSize: cluster.fieldSize,
    core: variant === "brand" ? cluster.brandCore : cluster.bodyguardCore,
    glow: variant === "brand" ? cluster.brandGlow : cluster.bodyguardGlow,
    opacity: cluster.opacity,
    duration: cluster.duration,
    delay: cluster.delay,
    rotation: cluster.rotation,
    driftX: `${((seededNoise(clusterIndex + 41) - 0.5) * 10).toFixed(2)}px`,
    driftY: `${((seededNoise(clusterIndex + 57) - 0.5) * 8).toFixed(2)}px`,
  }));

const createBackgroundParticles = (palettes: ParticlePalette[]) =>
  Array.from({ length: 78 }, (_, index) => {
    const palette = palettes[index % palettes.length];
  const sizeSeed = seededNoise(index + 13);
  const size = Number((1.45 + sizeSeed * 4.9).toFixed(2));
  const x = (index * 17.3 + (index % 3) * 7) % 100;
  const y = (index * 13.1 + (index % 4) * 9) % 100;
  const driftX = Number((((seededNoise(index + 29) - 0.5) * 14)).toFixed(2));
  const driftY = Number((((seededNoise(index + 47) - 0.5) * 12)).toFixed(2));

  return {
    id: `particle-${index}`,
    size,
    x,
    y,
    driftX,
    driftY,
    scale: (0.88 + sizeSeed * 0.26).toFixed(2),
    opacity: (0.62 + sizeSeed * 0.24).toFixed(2),
    blur: Number((12 + sizeSeed * 14).toFixed(2)),
    magnetRadius: Number((148 + sizeSeed * 34).toFixed(2)),
    magnetStrength: Number((15 + sizeSeed * 8).toFixed(2)),
    flareScale: (2.1 + sizeSeed * 0.9).toFixed(2),
    flareRotation: `${(index * 23) % 180}deg`,
    delay: `-${(index % 9) * 1.7}s`,
    floatDuration: `${(12.2 + seededNoise(index + 73) * 4.4).toFixed(2)}s`,
    pulseDuration: `${(4.1 + seededNoise(index + 89) * 1.6).toFixed(2)}s`,
    gradient: `radial-gradient(circle at 50% 50%, ${palette.inner} 0%, ${palette.core} 22%, ${palette.mid} 42%, ${palette.outer} 64%, rgba(255, 255, 255, 0) 100%)`,
    halo: palette.halo,
    glow: palette.glow,
  };
});

const galleryItems = [
  {
    slide: "/gallery/cat-neon-city.png",
    alt: "Cyberpunk kočka v neonovém městě",
  },
  {
    slide: "/gallery/cat-nebula-01.png",
    alt: "Černá kočka s neonovým obojkem pod růžovým měsícem",
  },
  {
    slide: "/gallery/cat-nebula-02.png",
    alt: "Černá kočka v mlze pod růžovým měsícem",
  },
  {
    slide: "/gallery/cat-closeup.png",
    alt: "Temný detail kočky s růžovým měsícem v pozadí",
  },
  {
    slide: "/gallery/cat-avatar.png",
    alt: "Portrét kočky v hexagonálním rámu",
  },
  {
    slide: "/gallery/cat-moon-duo.png",
    alt: "Dvě kočky proti obrovskému měsíci",
  },
  {
    slide: "/gallery/cat-moon-branch.png",
    alt: "Dvě kočky na větvi pod měsícem",
  },
  {
    slide: "/gallery/cat-moon-silhouette.png",
    alt: "Silueta koček v měsíční krajině",
  },
  {
    slide: "/gallery/neon-frame.png",
    alt: "Neonový rám v růžovo-modrém kouři",
  },
  {
    slide: "/gallery/neon-eclipse.png",
    alt: "Barevný neonový portál v temném lese",
  },
];

const philosophyCards = [
  {
    id: "inverse-marketing",
    tone: "warm",
    eyebrow: "Inverse Marketing",
    title: "Optimalizovat systém pro uživatele",
    description:
      "AI Bodyguard neřeší, jak z člověka vytěžit další klik. Řeší, proč ho rozhraní tlačí právě tímto směrem a jestli je ten tlak legitimní.",
    highlights: [
      "Primární otázka není konverze, ale motivace obsahu.",
      "Systém hledá rozpor mezi zájmem uživatele a zájmem algoritmu.",
      "Výstupem není reklama, ale obranné rozhodnutí.",
    ],
  },
  {
    id: "attention-economy",
    tone: "cool",
    eyebrow: "Attention Economy",
    title: "Pozornost jako zneužívaná surovina",
    description:
      "Korporátní marketingová AI maximalizuje time on site, engagement a impulsivní akce. Bodyguard tuhle logiku převrací a dělá z pozornosti chráněný zdroj.",
    highlights: [
      "Dopaminové smyčky a sociální validace nejsou feature, ale útokový vektor.",
      "Manipulativní urgence je detekována jako bezpečnostní incident.",
      "Model odděluje informační výživu od informačních toxinů.",
    ],
  },
  {
    id: "user-first-logic",
    tone: "cool",
    eyebrow: "User-First Logic",
    title: "Digitální imunitní systém",
    description:
      "Místo pasivního blokování reklam vzniká aktivní vrstva, která rozpozná nátlakové schéma, vysvětlí jeho motivaci a v případě potřeby zasáhne.",
    highlights: [
      "Rozhoduje v kontextu, ne jen podle blacklistu.",
      "Vysvětluje proč je pattern nebezpečný.",
      "Uživatel si volí úroveň zásahu od flag po block.",
    ],
  },
];

const triadCards = [
  {
    id: "visual-ui",
    tone: "warm",
    eyebrow: "Layer A",
    title: "Vizuální a UI analýza",
    description:
      "Renderovaná stránka se čte jako vizuální útokový povrch. Model sleduje confirmshaming, falešnou urgenci, roach motel i nativní reklamu maskovanou jako editorial.",
    highlights: [
      "Křížová kontrola countdown skriptů proti DOMu a cookie historii.",
      "Analýza kontrastu, velikosti a vizuální hierarchie tlačítek.",
      "Detekce reklam, které imitují redakční layout a font systém.",
    ],
  },
  {
    id: "semantic-nlp",
    tone: "cool",
    eyebrow: "Layer B",
    title: "Sémantická a psychologická vrstva",
    description:
      "Jemně doladěný LLM nečte jen text, ale záměr. Rozpoznává FOMO, guilt-tripping, gaslighting i tón, který cílí na strach, chamtivost nebo nejistotu.",
    highlights: [
      "Nepodložené scarcity fráze jsou označeny jako psychologický nátlak.",
      "Manipulativní copy je možné přepsat do neutrální formy v reálném čase.",
      "Analýza sleduje emoci útočníka, ne jen sentiment uživatele.",
    ],
  },
  {
    id: "code-inspection",
    tone: "cool",
    eyebrow: "Layer C",
    title: "Behaviorální analýza kódu",
    description:
      "Třetí vrstva jde pod kapotu prohlížeče. Sleduje fingerprinting, shadow tracking, prediktivní pre-loading a falešnou logiku cookie bannerů.",
    highlights: [
      "Canvas, AudioContext a mikrointerakce myši jsou auditovány jako telemetry signály.",
      "Podezřelé requesty lze zmrazit ještě před akcí uživatele.",
      "Cookie consent se nečte jen vizuálně, ale i přes skutečný API efekt.",
    ],
  },
];

const defenseCards = [
  {
    id: "fog-screen",
    tone: "warm",
    eyebrow: "Active Defense",
    title: "Projekt Mlhová Clona",
    description:
      "Jakmile je detekován útok na pozornost nebo soukromí, systém může přejít z pasivního štítu do aktivní obrany a rozbít jistotu sledovacích algoritmů.",
    highlights: [
      "Falešné zájmy se injectují do profilovacích toků jako noise.",
      "Uživatel se pro data brokery stává chaotickým a neprofitabilním cílem.",
      "Bodyguard umí útočníka zasypat nejednoznačností místo čistých dat.",
    ],
  },
  {
    id: "data-poisoning",
    tone: "cool",
    eyebrow: "Noise Injection",
    title: "Otrávení reality pro trackery",
    description:
      "Data poisoning tu není marketingová metafora. Jde o cílené znehodnocení sledovacích modelů tak, aby ztratily schopnost přesně profilovat a cílit.",
    highlights: [
      "Simulace falešných zájmů rozbíjí behavioral scoring.",
      "Prediktivní modely útočníka dostávají konfliktní signály.",
      "Tracking infrastruktura postupně přestává dávat smysluplné výstupy.",
    ],
  },
  {
    id: "intervention-modes",
    tone: "cool",
    eyebrow: "Intervention",
    title: "Flag, Rewrite, Block",
    description:
      "Každý zásah musí mít jasný práh. V lehkém režimu AI jen označí manipulaci, v aktivním přepíše text a v nejtvrdším módu web úplně zastaví.",
    highlights: [
      "Pasivní mód kreslí jasný auditní signál kolem lži.",
      "Rewrite mód neutralizuje copy bez rozbití funkce stránky.",
      "Block mód uzavírá přístup tam, kde je manipulace systémová a toxická.",
    ],
  },
  {
    id: "zen-overlay",
    tone: "warm",
    eyebrow: "Zen Overlay",
    title: "Vizualní desaturace nátlaku",
    description:
      "Agresivní barvy, autoplay videa a hysterické titulky lze překrýt klidnější vrstvou. Cílem není cenzura, ale vrácení klidu do kognitivního prostoru uživatele.",
    highlights: [
      "Křičící bannery jsou potlačeny do neutrálního tónu.",
      "Faktická shrnutí nahrazují emocionální clickbait titulky.",
      "Rozhraní se vrací z režimu útoku do režimu čitelnosti.",
    ],
  },
];

const buildCards = [
  {
    id: "hgx-h100",
    tone: "cool",
    eyebrow: "Infrastructure",
    title: "HGX H100 jako externí mozková kůra",
    description:
      "Superpočítač nedává smysl kvůli blacklistům. Dává smysl kvůli inferenci nad screenshotem, DOMem a kódem v jednom okamžiku.",
    highlights: [
      "Velký model chápe ironii, podtext i kódové schéma ve stejné chvíli.",
      "Browser posílá kontext, H100 dělá heavy lifting a vrací instrukci.",
      "Silná inference běží lokálně místo úniku citlivých dat do cloudu.",
    ],
  },
  {
    id: "air-gapped",
    tone: "warm",
    eyebrow: "Secure Environment",
    title: "Air-gapped provoz jako pevnost",
    description:
      "Citlivá data se zpracovávají lokálně v on-premise prostředí. Model chrání uživatele bez toho, aby se sám stal dalším sledovacím bodem.",
    highlights: [
      "Soukromí není trade-off za bezpečnostní analýzu.",
      "Inference, logy i zásahy zůstávají uvnitř kontrolovaného prostředí.",
      "Architektura počítá s režimem vysoké citlivosti a fyzickou izolací.",
    ],
  },
  {
    id: "dataset-zla",
    tone: "warm",
    eyebrow: "Phase 1",
    title: "Dataset Zla",
    description:
      "Nejtěžší část nebude UI, ale data. Model se musí učit na kurátorovaných příkladech scamů, dark patterns, fake news a agresivního marketingu.",
    highlights: [
      "Zdroje: Common Crawl, PhishTank a ručně kurátorované seznamy.",
      "Klíčové je přesné označení jemných manipulačních vzorců.",
      "Kvalita datasetu rozhodne o přesnosti celé obranné vrstvy.",
    ],
  },
  {
    id: "the-skeptic",
    tone: "cool",
    eyebrow: "Phase 2 / 3",
    title: "The Skeptic",
    description:
      "Fine-tuned model musí být skeptický, ne paranoidní. RLHF rozhodne, kde je hranice mezi legitimní nabídkou a útokem na úsudek uživatele.",
    highlights: [
      "Trénink cílí na psychologii, persuasion techniques a UX podvody.",
      "Etický panel nastavuje toleranci zásahu od signalizace po blokaci.",
      "Auditovatelnost zásahu je stejně důležitá jako jeho přesnost.",
    ],
  },
];

function FxPanel({ variant, theme, className = "", mask, children }: FxPanelProps) {
  const resolvedTheme = theme ?? surfaceThemes[variant].panel;

  return (
    <div className={`fx-panel fx-panel--${variant} ${className}`.trim()}>
      <Background
        fill
        aria-hidden
        className="fx-panel__background"
        gradient={{
          display: true,
          opacity: 100,
          x: mask?.x ?? 50,
          y: mask?.y ?? 0,
          width: 100,
          colorStart: resolvedTheme.gradientStart,
          colorEnd: resolvedTheme.gradientEnd,
        }}
        lines={{
          display: true,
          opacity: 100,
          size: "16",
          thickness: 1,
          angle: 90,
          color: resolvedTheme.line,
        }}
        dots={{
          display: true,
          opacity: 100,
          size: "4",
          color: resolvedTheme.dots,
        }}
        mask={mask}
      />
      <div aria-hidden className="fx-panel__shine" />
      <div className="relative z-[2]">{children}</div>
    </div>
  );
}

function OnePageCard({
  id,
  eyebrow,
  title,
  description,
  highlights,
  tone = "cool",
}: OnePageCardProps) {
  return (
    <article id={id} className={`onepage-card onepage-anchor surface-inset onepage-card--${tone}`}>
      <Text as="span" className="onepage-card__eyebrow">
        {eyebrow}
      </Text>
      <Text as="h3" className="onepage-card__title">
        {title}
      </Text>
      <Text as="p" className="onepage-card__copy">
        {description}
      </Text>
      <div className="onepage-card__list">
        {highlights.map((item) => (
          <Text key={item} as="p" className="onepage-card__point">
            {item}
          </Text>
        ))}
      </div>
    </article>
  );
}

function TitleFrame({
  variant,
  theme,
  active,
  as,
  title,
  description,
  descriptionClassName,
  onHoverStart,
  onHoverEnd,
}: TitleFrameProps) {
  const resolvedTheme = theme ?? surfaceThemes[variant].title;

  return (
    <div
      className={`title-frame title-frame--${variant}${active ? " title-frame--active" : ""}`}
      onPointerEnter={onHoverStart}
      onPointerLeave={onHoverEnd}
    >
      <Background
        fill
        aria-hidden
        className="title-frame__background"
        gradient={{
          display: true,
          opacity: 100,
          x: 50,
          y: 50,
          width: 86,
          colorStart: resolvedTheme.gradientStart,
          colorEnd: resolvedTheme.gradientEnd,
        }}
        lines={{
          display: true,
          opacity: 100,
          size: "12",
          thickness: 1,
          angle: 90,
          color: resolvedTheme.line,
        }}
        dots={{
          display: true,
          opacity: 100,
          size: "4",
          color: resolvedTheme.dots,
        }}
        mask={{
          x: 50,
          y: 50,
          radius: 86,
        }}
      />
      <MatrixFx
        className="title-frame__matrix"
        colors={resolvedTheme.matrixColors}
        size={2}
        spacing={4}
        trigger="manual"
        active={active}
        flicker={variant === "bodyguard"}
        bulge={{
          type: "ripple",
          duration: variant === "brand" ? 3.4 : 3,
          intensity: variant === "brand" ? 13 : 14,
          repeat: false,
        }}
        reducedMotion="auto"
        aria-hidden
      />
      <WeatherFx
        className="title-frame__weather"
        type="leaves"
        trigger="manual"
        active={active}
        colors={resolvedTheme.leafColors}
        intensity={variant === "brand" ? 34 : 38}
        speed={variant === "brand" ? 0.65 : 0.58}
        angle={variant === "brand" ? -6 : 5}
        reducedMotion="auto"
        aria-hidden
      />
      <div className="title-frame__content">
        <Text as={as} className={`display-title display-title--${variant} m-0 text-6xl md:text-7xl`}>
          {title}
        </Text>
        {description ? (
          <Text as="p" className={descriptionClassName}>
            {description}
          </Text>
        ) : null}
      </div>
    </div>
  );
}

export default function App({ page = "ultimate" }: { page?: AppPage }) {
  const appShellRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname() ?? "/";
  const { resolvedTheme } = useTheme();
  const styleContext = useStyle();
  const [hasHydrated, setHasHydrated] = useState(false);
  const [showMemory, setShowMemory] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showStyleSettings, setShowStyleSettings] = useState(false);
  const [isProjectLoading, setIsProjectLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTopBarScrolled, setIsTopBarScrolled] = useState(false);
  const [hoveredHeading, setHoveredHeading] = useState<ActiveTab | null>(null);
  const [queryText, setQueryText] = useState("");
  const [aiResponse, setAiResponse] = useState<AiResponse | null>(null);
  const [systemLog, setSystemLog] = useState("ULTIMATE OS KERNEL: ACTIVE");
  const [currentHash, setCurrentHash] = useState("");
  const clusterNodeRefs = useRef<Array<HTMLDivElement | null>>([]);
  const particleNodeRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const pointerTargetRef = useRef({ x: 0, y: 0, active: false });
  const pointerCurrentRef = useRef({ x: 0, y: 0 });
  const isAiGuardPage = page !== "ultimate";
  const activeTab: ActiveTab = isAiGuardPage ? "bodyguard" : "brand";
  const shellResolvedTheme: ResolvedThemeMode = hasHydrated ? resolvedTheme : INITIAL_RESOLVED_THEME;
  const shellStyleState = hasHydrated
    ? {
        brand: styleContext.brand as ThemeColorName,
        accent: styleContext.accent as ThemeColorName,
        neutral: styleContext.neutral as ThemeColorName,
        border: styleContext.border,
        solid: styleContext.solid,
        solidStyle: styleContext.solidStyle,
        surface: styleContext.surface,
        transition: styleContext.transition,
        scaling: styleContext.scaling,
      }
    : DEFAULT_STYLE_STATE;
  const currentSurfaceTheme = useMemo(
    () => createSurfaceTheme(activeTab, shellResolvedTheme),
    [activeTab, shellResolvedTheme],
  );
  const themedAmbientClouds = useMemo(() => createAmbientClouds(activeTab), [activeTab]);
  const themedStarClusters = useMemo(() => createStarClusters(activeTab), [activeTab]);
  const themedBackgroundParticles = useMemo(
    () =>
      createBackgroundParticles(
        activeTab === "brand" ? brandParticlePalettes : bodyguardParticlePalettes,
      ),
    [activeTab],
  );
  const appShellStyle = useMemo(
    () =>
      createShellVars({
        activeTab,
        resolvedTheme: shellResolvedTheme,
        brand: shellStyleState.brand,
        accent: shellStyleState.accent,
        neutral: shellStyleState.neutral,
        border: shellStyleState.border,
        solid: shellStyleState.solid,
        solidStyle: shellStyleState.solidStyle,
        surface: shellStyleState.surface,
        transition: shellStyleState.transition,
      }),
    [
      activeTab,
      shellResolvedTheme,
      shellStyleState.accent,
      shellStyleState.border,
      shellStyleState.brand,
      shellStyleState.neutral,
      shellStyleState.solid,
      shellStyleState.solidStyle,
      shellStyleState.surface,
      shellStyleState.transition,
    ],
  );
  const sourceMegaMenuGroups: MegaMenuGroup[] = isAiGuardPage
    ? aiGuardMegaMenuGroups
    : ultimateMegaMenuGroups;
  const megaMenuGroups: MobileMenuGroup[] = useMemo(
    () =>
      sourceMegaMenuGroups.map((group) => {
        const groupIsActive =
          group.sections.some((section) =>
            section.links.some((link) => isLinkActive(link.href, pathname, currentHash)),
          );

        return {
          ...group,
          selected: groupIsActive,
        };
      }),
    [currentHash, pathname, sourceMegaMenuGroups],
  );

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowMemory(false);
        setShowChat(false);
        setShowMobileMenu(false);
        setShowStyleSettings(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow =
      showMemory || showChat || showMobileMenu || showStyleSettings ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showMemory, showChat, showMobileMenu, showStyleSettings]);

  useEffect(() => {
    if (activeTab === "brand") {
      setSystemLog("BRAND CORE: SYNCHRONIZED");
      return;
    }

    if (!isProjectLoading && !isLoading) {
      setSystemLog("AI BODYGUARD PERIMETER: ACTIVE");
    }
  }, [activeTab, isLoading, isProjectLoading]);

  useEffect(() => {
    setHoveredHeading(null);
  }, [activeTab]);

    useEffect(() => {
      setShowMobileMenu(false);
    }, [page]);

    useEffect(() => {
      const syncHash = () => {
        setCurrentHash(window.location.hash || "");
      };

      syncHash();
      window.addEventListener("hashchange", syncHash);

      return () => window.removeEventListener("hashchange", syncHash);
    }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsTopBarScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const getShellBounds = () => {
      const rect = appShellRef.current?.getBoundingClientRect();

      return {
        width: rect?.width ?? window.innerWidth,
        height: rect?.height ?? window.innerHeight,
      };
    };

    const syncPointerToCenter = () => {
      const bounds = getShellBounds();
      const centerX = bounds.width / 2;
      const centerY = bounds.height / 2;

      pointerCurrentRef.current = {
        x: centerX,
        y: centerY,
      };
      pointerTargetRef.current = {
        x: centerX,
        y: centerY,
        active: false,
      };
    };

    syncPointerToCenter();

    const handleResize = () => {
      if (!pointerTargetRef.current.active) {
        syncPointerToCenter();
      }
    };

    window.addEventListener("resize", handleResize);

    let frameId = 0;

    const animateRepulsion = () => {
      const bounds = getShellBounds();
      const target = pointerTargetRef.current;
      const current = pointerCurrentRef.current;
      const targetX = target.active ? target.x : bounds.width / 2;
      const targetY = target.active ? target.y : bounds.height / 2;
      const easing = target.active ? 0.14 : 0.08;

      current.x += (targetX - current.x) * easing;
      current.y += (targetY - current.y) * easing;

        themedBackgroundParticles.forEach((particle, index) => {
          const node = particleNodeRefs.current[index];
          if (!node) return;

        const particleX = (particle.x / 100) * bounds.width;
        const particleY = (particle.y / 100) * bounds.height;
        const deltaX = particleX - current.x;
        const deltaY = particleY - current.y;
        const distance = Math.hypot(deltaX, deltaY) || 1;
        const influence =
          target.active && distance < particle.magnetRadius
            ? (1 - distance / particle.magnetRadius) ** 1.85
            : 0;
        const push = influence * particle.magnetStrength;
        const magnetX = (deltaX / distance) * push;
        const magnetY = (deltaY / distance) * push;

        node.style.setProperty("--particle-magnet-x", `${magnetX.toFixed(2)}px`);
        node.style.setProperty("--particle-magnet-y", `${magnetY.toFixed(2)}px`);
          node.style.setProperty(
            "--particle-boost",
            `${(1 + influence * 0.9).toFixed(3)}`,
          );
        });

        themedStarClusters.forEach((cluster, index) => {
          const node = clusterNodeRefs.current[index];
          if (!node) return;

          const clusterX =
            (Number.parseFloat(cluster.left) / 100) * bounds.width;
          const clusterY =
            (Number.parseFloat(cluster.top) / 100) * bounds.height;
          const deltaX = current.x - clusterX;
          const deltaY = current.y - clusterY;
          const distance = Math.hypot(deltaX, deltaY) || 1;
          const magnetRadius = (cluster.fieldSize ?? cluster.size * 7.5) * 1.95;
          const influence =
            target.active && distance < magnetRadius
              ? (1 - distance / magnetRadius) ** 1.55
              : 0;
          const pull = influence * ((cluster.fieldSize ?? cluster.size * 7.5) * 0.14);
          const magnetX = (deltaX / distance) * pull;
          const magnetY = (deltaY / distance) * pull;

          node.style.setProperty("--cluster-magnet-x", `${magnetX.toFixed(2)}px`);
          node.style.setProperty("--cluster-magnet-y", `${magnetY.toFixed(2)}px`);
          node.style.setProperty(
            "--cluster-magnet-scale",
            `${(1 + influence * 0.12).toFixed(3)}`,
          );
        });

        frameId = window.requestAnimationFrame(animateRepulsion);
      };

    frameId = window.requestAnimationFrame(animateRepulsion);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.cancelAnimationFrame(frameId);
    };
  }, [themedBackgroundParticles, themedStarClusters]);

  const generateProjectIdea = () => {
    setIsProjectLoading(true);
    setSystemLog("ACCESSING INNOVATION NODE...");

    window.setTimeout(() => {
      const idea = projectIdeas[Math.floor(Math.random() * projectIdeas.length)];
      setSystemLog(`NEW CONCEPT: ${idea}`);
      setIsProjectLoading(false);
    }, 1500);
  };

  const handleNeuralLink = () => {
    if (!queryText.trim()) return;

    setIsLoading(true);
    setSystemLog("NEURAL ANALYSIS IN PROGRESS...");

    window.setTimeout(() => {
      setAiResponse({
        human: `Analýza dotazu "${queryText}" dokončena. Emoční stopa stabilní.`,
        machine:
          "Logický klastr: 0x4F2. Doporučení: Implementovat vrstvu šifrování RSA-4096.",
      });
      setIsLoading(false);
      setSystemLog("NEURAL LINK: RESPONSE READY");
    }, 2000);
  };

  const closeMemory = () => setShowMemory(false);

  const openChat = () => {
    setShowChat(true);
    setSystemLog("NEURAL LINK: CHANNEL OPEN");
  };

  const closeChat = () => {
    setShowChat(false);
    setSystemLog("NEURAL LINK: DISCONNECTED");
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu((current) => !current);
  };

  const openStyleSettings = () => {
    setShowMobileMenu(false);
    setShowStyleSettings(true);
  };

  const resetSession = () => {
    setAiResponse(null);
    setQueryText("");
    setSystemLog("NEURAL LINK: READY FOR NEW SESSION");
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = appShellRef.current?.getBoundingClientRect();

    pointerTargetRef.current = {
      x: rect ? event.clientX - rect.left : event.clientX,
      y: rect ? event.clientY - rect.top : event.clientY,
      active: true,
    };
  };

  const handlePointerLeave = () => {
    const rect = appShellRef.current?.getBoundingClientRect();
    const width = rect?.width ?? window.innerWidth;
    const height = rect?.height ?? window.innerHeight;

    pointerTargetRef.current = {
      x: width / 2,
      y: height / 2,
      active: false,
    };
  };

  const appModeClass =
    activeTab === "brand" ? "app-shell--brand" : "app-shell--bodyguard";
  const topbarMatrixColors =
    currentSurfaceTheme.title.matrixColors.slice(1, 4);
  return (
    <div
      ref={appShellRef}
      className={`app-shell ${appModeClass} relative flex min-h-screen flex-col overflow-x-hidden`}
      data-resolved-theme={shellResolvedTheme}
      data-surface={shellStyleState.surface}
      data-border={shellStyleState.border}
      style={appShellStyle}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div aria-hidden className="background-nebula">
        <div className="background-nebula__mesh" />
        <div className="background-nebula__matrix-wrap">
          <div className="background-nebula__matrix" />
        </div>
        {themedStarClusters.map((cluster, index) => (
          <div
            key={`cluster-${index}`}
            className="star-cluster-shell"
            ref={(node) => {
              clusterNodeRefs.current[index] = node;
            }}
            style={cssVars({
              "--cluster-left": cluster.left,
              "--cluster-top": cluster.top,
              "--cluster-size": `${cluster.size}px`,
              "--cluster-core": cluster.core,
              "--cluster-glow": cluster.glow,
              "--cluster-opacity": cluster.opacity,
              "--cluster-duration": cluster.duration,
              "--cluster-delay": cluster.delay,
              "--cluster-rotation": cluster.rotation,
              "--cluster-drift-x": cluster.driftX,
              "--cluster-drift-y": cluster.driftY,
              "--cluster-magnet-x": "0px",
              "--cluster-magnet-y": "0px",
              "--cluster-magnet-scale": "1",
            })}
          >
            <div className="star-cluster" />
          </div>
        ))}
        {themedAmbientClouds.map((cloud, index) => (
          <div
            key={`cloud-${index}`}
            className="background-nebula__cloud"
            style={cssVars({
              "--cloud-left": cloud.left,
              "--cloud-top": cloud.top,
              "--cloud-size": `${cloud.size}px`,
              "--cloud-color": cloud.color,
              "--cloud-duration": cloud.duration,
              "--cloud-delay": cloud.delay,
            })}
          />
        ))}
        {activeTab === "brand" ? (
          <div
            className="background-nebula__cloud"
            style={cssVars({
              "--cloud-left": "74%",
              "--cloud-top": "42%",
              "--cloud-size": "460px",
              "--cloud-color": "rgba(244, 114, 182, 0.18)",
              "--cloud-duration": "31s",
              "--cloud-delay": "-9s",
            })}
          />
        ) : null}
        {themedBackgroundParticles.map((particle, index) => (
          <span
            key={particle.id}
            className="particle-node"
            ref={(node) => {
              particleNodeRefs.current[index] = node;
            }}
            style={cssVars({
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              "--particle-scale": particle.scale,
              "--particle-opacity": particle.opacity,
              "--particle-drift-x": `${particle.driftX}px`,
              "--particle-drift-y": `${particle.driftY}px`,
              "--particle-blur": `${particle.blur}px`,
              "--particle-delay": particle.delay,
              "--particle-float-duration": particle.floatDuration,
              "--particle-pulse-duration": particle.pulseDuration,
              "--particle-flare-scale": particle.flareScale,
              "--particle-flare-rotation": particle.flareRotation,
              "--particle-magnet-x": "0px",
              "--particle-magnet-y": "0px",
              "--particle-boost": "1",
              "--particle-gradient": particle.gradient,
              "--particle-halo": particle.halo,
              "--particle-glow": particle.glow,
            })}
          />
        ))}
        <div className="background-nebula__vignette" />
      </div>

      <nav className={`app-topbar${isTopBarScrolled ? " app-topbar--scrolled" : ""}`}>
        <div className="app-topbar__fx" aria-hidden="true">
          <MatrixFx
            className="app-topbar__fx-matrix"
            position="absolute"
            top="0"
            left="0"
            trigger="mount"
            height={24}
            colors={topbarMatrixColors}
            flicker
          />
        </div>
        <div className="app-topbar__inner flex items-center justify-between gap-4 px-4 py-3 md:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-4 xl:gap-6">
          <div className="flex shrink-0 items-center gap-4">
            <div className="app-shell__logo-mark flex h-8 w-8 items-center justify-center rounded">
              <Layout size={18} className="app-shell__logo-icon" />
            </div>
            <Text
              as="span"
              className="app-shell__logo-wordmark font-mono text-xs uppercase tracking-tighter"
            >
              Ultimate OS v1.0
            </Text>
          </div>

          <div className="hidden min-w-0 xl:flex xl:flex-1 xl:justify-center">
            <MegaMenu
              menuGroups={megaMenuGroups}
              className={`app-mega-menu app-mega-menu--${activeTab}`}
              gap="8"
            />
          </div>
        </div>

        <div className="app-topbar__actions ml-4 flex shrink-0 items-center gap-3 xl:gap-4">
          <div className="app-shell__mode-switch flex gap-2 rounded-full p-1">
            <Link
              href="/"
              onClick={() => setShowMobileMenu(false)}
              className={`app-shell__mode-link app-shell__mode-link--brand rounded-full px-4 py-1.5 text-xs transition-all ${
                activeTab === "brand"
                  ? "app-shell__mode-link--active"
                  : ""
              }`}
            >
              BRAND
            </Link>
            <Link
              href="/ai-guard"
              onClick={() => setShowMobileMenu(false)}
              className={`app-shell__mode-link app-shell__mode-link--bodyguard rounded-full px-4 py-1.5 text-xs transition-all ${
                activeTab === "bodyguard"
                  ? "app-shell__mode-link--active"
                  : ""
              }`}
            >
              AI BODYGUARD
            </Link>
          </div>

          <div className="app-shell__network hidden items-center gap-4 font-mono text-xs sm:flex">
            <Globe size={14} />
            <Text as="span">127.0.0.1</Text>
          </div>

          <button
            type="button"
            className="app-style-overlay__trigger hidden md:inline-flex"
            onClick={openStyleSettings}
            aria-label="Open style settings"
          >
            <SlidersHorizontal size={14} />
            <span className="hidden md:inline">Settings</span>
          </button>

          <button
            type="button"
            className={`app-topbar__menu-toggle xl:hidden${showMobileMenu ? " app-topbar__menu-toggle--active" : ""}`}
            onClick={toggleMobileMenu}
            aria-label={showMobileMenu ? "Close navigation" : "Open navigation"}
            aria-expanded={showMobileMenu}
          >
            {showMobileMenu ? <X size={16} /> : <Menu size={16} />}
          </button>

        </div>
        </div>
      </nav>

      {showMobileMenu ? (
        <MobileMenuPanel
          menuGroups={megaMenuGroups}
          activeTab={activeTab}
          pathname={pathname}
          currentHash={currentHash}
          onClose={() => setShowMobileMenu(false)}
          onOpenSettings={openStyleSettings}
        />
      ) : null}

      <main className="app-main">
        {activeTab === "brand" && (
          <div className="animate-in fade-in absolute inset-0 flex items-center justify-center duration-700">
            <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-5 px-6">
              <div className="grid gap-5 md:grid-cols-[minmax(0,1.12fr)_minmax(280px,0.88fr)] md:items-center">
                <FxPanel
                  variant="brand"
                  theme={currentSurfaceTheme.panel}
                  className="min-h-[360px] p-6 md:p-8"
                  mask={{ x: 30, y: 14, radius: 74 }}
                >
                  <div id="ultimate-overview" className="flex h-full flex-col justify-between gap-8">
                    <Badge
                      id="brand-core-badge"
                      title="Brand Core"
                      icon="sparkle"
                      arrow={false}
                      className="surface-badge surface-badge--brand"
                      background="brand-alpha-weak"
                      onBackground="brand-medium"
                      paddingLeft="12"
                      paddingRight="16"
                      paddingY="8"
                    />

                    <TitleFrame
                      variant="brand"
                      theme={currentSurfaceTheme.title}
                      active={hoveredHeading === "brand"}
                      as="h1"
                      title="ULTIMATE"
                      description="Vize digitální identity, kde design potkává absolutní technologickou suverenitu."
                      descriptionClassName="app-shell__hero-description mx-auto max-w-[34rem] text-sm leading-relaxed md:mx-0 md:text-base"
                      onHoverStart={() => setHoveredHeading("brand")}
                      onHoverEnd={() =>
                        setHoveredHeading((current) =>
                          current === "brand" ? null : current,
                        )
                      }
                    />
                  </div>
                </FxPanel>

                <FxPanel
                  variant="brand"
                  theme={currentSurfaceTheme.panel}
                  className="min-h-[360px] p-6 md:p-8"
                  mask={{ x: 72, y: 18, radius: 72 }}
                >
                  <div className="flex h-full flex-col justify-between gap-6">
                    <div id="ultimate-genesis" className="fx-metric">
                      <Text as="span" className="fx-metric__label">
                        Genesis
                      </Text>
                      <Text as="span" className="fx-metric__value">
                        2025
                      </Text>
                      <Text as="p" className="fx-metric__copy">
                        Startovní bod pro systémovou identitu navrženou jako plnohodnotný produkt.
                      </Text>
                    </div>

                    <div className="fx-divider" />

                    <div id="ultimate-scalability" className="fx-metric">
                      <Text as="span" className="fx-metric__label">
                        Scalability
                      </Text>
                      <Text as="span" className="fx-metric__value">
                        ∞
                      </Text>
                      <Text as="p" className="fx-metric__copy">
                        Modulární rámec připravený rozšiřovat brand, systém i další vrstvy rozhraní.
                      </Text>
                    </div>
                  </div>
                </FxPanel>
              </div>

              <HeroRevealPanel
                variant="brand"
                theme={currentSurfaceTheme.panel}
                eyebrow="Once UI Graphic Layer"
                title="ULTIMATE staví z Once UI luxusní product surface."
                copy="Základ systému zůstává čistý a modulární, ale vizuální vrstva ho posouvá do vlastního neonového jazyka se silnější typografií, atmosférou a identitou."
                href="/#vision-archive"
                cta="Open visual archive"
              />
            </div>
          </div>
        )}

        {activeTab === "bodyguard" && (
          <div className="animate-in slide-in-from-right-10 absolute inset-0 flex items-center justify-center duration-500">
            <div
              className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[110px]"
              style={{
                background:
                  "radial-gradient(circle, rgba(34, 197, 94, 0.18) 0%, rgba(20, 184, 166, 0.18) 24%, rgba(6, 182, 212, 0.16) 48%, rgba(59, 130, 246, 0.14) 72%, rgba(255, 255, 255, 0.05) 100%)",
              }}
            />
            <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-5 px-6">
              <div className="grid gap-5 md:grid-cols-[minmax(0,1.08fr)_minmax(300px,0.92fr)] md:items-center">
                <FxPanel
                  variant="bodyguard"
                  theme={currentSurfaceTheme.panel}
                  className="min-h-[360px] p-6 md:p-8"
                  mask={{ x: 40, y: 18, radius: 76 }}
                >
                  <div className="flex h-full flex-col justify-between gap-8">
                    <div className="flex justify-center md:justify-start">
                      <Badge
                        id="defense-node-badge"
                        title="Defense Node"
                        icon="check"
                        arrow={false}
                        className="surface-badge surface-badge--bodyguard"
                        background="accent-alpha-weak"
                        onBackground="accent-medium"
                        paddingLeft="12"
                        paddingRight="16"
                        paddingY="8"
                      />
                    </div>

                    <TitleFrame
                      variant="bodyguard"
                      theme={currentSurfaceTheme.title}
                      active={hoveredHeading === "bodyguard"}
                      as="h2"
                      title="AI Bodyguard"
                      description="Neural Defense System"
                      descriptionClassName="app-shell__hero-kicker font-mono text-xs uppercase tracking-[0.38em]"
                      onHoverStart={() => setHoveredHeading("bodyguard")}
                      onHoverEnd={() =>
                        setHoveredHeading((current) =>
                          current === "bodyguard" ? null : current,
                        )
                      }
                    />
                  </div>
                </FxPanel>

                <FxPanel
                  variant="bodyguard"
                  theme={currentSurfaceTheme.panel}
                  className="min-h-[360px] p-6 md:p-8"
                  mask={{ x: 68, y: 100, radius: 80 }}
                >
                  <div className="flex h-full flex-col justify-between gap-6">
                    <div>
                      <Text as="span" className="fx-metric__label">
                        Command Grid
                      </Text>
                      <Text as="p" className="app-shell__hero-description mt-3 text-sm leading-relaxed">
                        Aktivuj kanál, navrhni další bezpečnostní modul nebo otevři architekturu obranné vrstvy.
                      </Text>
                    </div>

                    <div className="grid gap-3">
                      <button
                        type="button"
                        onClick={openChat}
                        className="app-shell__action-button app-shell__action-button--primary group flex w-full items-center justify-between rounded-2xl px-5 py-4 text-left font-bold active:scale-[0.99]"
                      >
                        <span>Neural Link</span>
                        <span className="app-shell__action-icon transition-colors">
                          <Zap size={18} fill="currentColor" />
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={generateProjectIdea}
                        className="app-shell__action-button app-shell__action-button--support group flex w-full items-center justify-between rounded-2xl px-5 py-4 text-left text-sm uppercase tracking-[0.2em] transition-all"
                      >
                        <span>{isProjectLoading ? "Navrhuji..." : "Inovace"}</span>
                        {isProjectLoading ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Rocket size={16} />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowMemory(true)}
                        className="app-shell__action-button app-shell__action-button--secondary group flex w-full items-center justify-between rounded-2xl px-5 py-4 text-left text-sm uppercase tracking-[0.2em] transition-all"
                      >
                        <span>Architektura</span>
                        <Network size={16} />
                      </button>
                    </div>
                  </div>
                </FxPanel>
              </div>

              <HeroRevealPanel
                variant="bodyguard"
                theme={currentSurfaceTheme.panel}
                eyebrow="Guard Function Layer"
                title="AI Guard čte web jako psychologický útokový povrch."
                copy="Systém paralelně vyhodnocuje obraz, text i kód, rozpozná nátlakové patterny a podle režimu je označí, přepíše nebo zablokuje dřív, než začnou řídit úsudek uživatele."
                href="/ai-guard/detection"
                cta="Open detection layers"
              />
            </div>
          </div>
        )}

        <div className="pointer-events-none absolute bottom-6 left-0 right-0 flex justify-center px-4">
          <div className="app-shell__terminal-badge pointer-events-auto flex items-center gap-3 rounded-md px-4 py-2 shadow-2xl backdrop-blur-sm">
            <Terminal size={12} className="app-shell__terminal-icon animate-pulse" />
            <Text
              as="p"
              className="app-shell__terminal-copy font-mono text-[10px] uppercase tracking-widest"
            >
              {systemLog}
            </Text>
          </div>
        </div>
      </main>

      {page !== "ultimate" ? renderSectionPage(page as SectionPage) : null}

      {page === "ultimate" ? (
      <section className="showcase-band">
        <div className="showcase-band__inner">
          <div id="night-protocol" className="showcase-band__quote-shell onepage-anchor surface-frame surface-frame--warm">
            <Text as="span" className="showcase-band__eyebrow">
              Noční Protokol
            </Text>
            <BlockQuote
              className="showcase-quote surface-inset"
              border="neutral-alpha-medium"
              background="surface"
              radius="xl"
              padding="l"
              align="left"
              separator="none"
              author={{
                name: "David Kozák",
                avatar: "/gallery/cat-avatar.png",
              }}
              subline="Design má být klidný na pohled a nekompromisní v obraně."
            >
              <Text as="span" className="showcase-quote__content">
                „Nejlepší rozhraní nepůsobí hlasitě. Jen tiše drží prostor, rytmus a jistotu.“
              </Text>
            </BlockQuote>
            <div id="contact-dk" className="showcase-contact onepage-anchor surface-inset">
              <Mask
                cursor
                radius={14}
                reducedMotion="auto"
                className="showcase-contact__mask"
                aria-hidden
              >
                <div className="showcase-contact__mask-glow" />
              </Mask>
              <div className="showcase-contact__content">
                <Text as="h3" className="showcase-contact__title">
                  DK
                </Text>
                <Text as="p" className="showcase-contact__meta">
                  +420 705 224 435 | +420 705 217 251 | kozak@d-international.eu | www.osobni.david-kozak.com
                </Text>
              </div>
            </div>
          </div>

          <div id="vision-archive" className="showcase-band__gallery-shell onepage-anchor surface-frame surface-frame--warm">
            <Text as="span" className="showcase-band__eyebrow">
              Vision Archive
            </Text>
            <Text as="p" className="showcase-band__copy">
              Kurátorská galerie nočních motivů, cyber koček a měsíčních scén s rychlým přepínáním přes thumbnail náhledy.
            </Text>
            <Carousel
              className="showcase-carousel surface-inset"
              indicator="thumbnail"
              items={galleryItems}
              controls
              aspectRatio="16 / 10"
              sizes="(max-width: 960px) 100vw, 52vw"
              thumbnail={{ height: 40, scaling: 0.9 }}
            />
          </div>
        </div>
      </section>
      ) : null}

      <footer className="app-footer">
        <Fade
          className="app-footer__fade app-footer__fade--top"
          fillWidth
          position="absolute"
          top="0"
          to="bottom"
          height={16}
          blur={0.9}
          base="transparent"
          pattern={{ display: true, size: "2" }}
          style={cssVars({
            "--base-color":
              shellResolvedTheme === "light"
                ? activeTab === "brand"
                  ? "rgba(255, 236, 244, 0.9)"
                  : "rgba(235, 246, 255, 0.9)"
                : "rgba(10, 10, 12, 0.94)",
          })}
          aria-hidden
        />
        <Fade
          className="app-footer__fade app-footer__fade--bottom"
          fillWidth
          position="absolute"
          bottom="0"
          to="top"
          height={10}
          blur={0.65}
          base="transparent"
          pattern={{ display: true, size: "2" }}
          style={cssVars({
            "--base-color":
              shellResolvedTheme === "light"
                ? activeTab === "brand"
                  ? "rgba(255, 223, 239, 0.82)"
                  : "rgba(219, 239, 255, 0.82)"
                : "rgba(4, 4, 6, 0.86)",
          })}
          aria-hidden
        />
        <div className="app-footer__content">
          <Mask
            fillWidth
            x={50}
            y={50}
            radius={10}
            className="app-footer__mask-band"
            aria-hidden
          >
            <div className="app-footer__mask-band-fill" />
          </Mask>
          <Mask
            cursor
            radius={12}
            reducedMotion="auto"
            className="app-footer__cursor-mask"
            aria-hidden
          >
            <div className="app-footer__cursor-glow" />
          </Mask>
          <Column
            id="signature-layer"
            gap="20"
            fillWidth
            horizontal="center"
            className="app-footer__signature"
          >
            <Line className="app-footer__line" />
            <Text as="span" className="app-footer__eyebrow">
              Signature Layer
            </Text>
            <Line className="app-footer__line" />
          </Column>
          <Text as="h3" className="app-footer__title">
            David Kozák
          </Text>
        </div>
      </footer>

      {showStyleSettings && (
        <div className="style-settings-shell">
          <button
            type="button"
          className="style-settings-shell__backdrop"
            onClick={() => setShowStyleSettings(false)}
            aria-label="Close style settings"
          />
          <div
            className={`style-settings-shell__panel surface-frame surface-frame--${
              activeTab === "brand" ? "warm" : "cool"
            }`}
          >
            <div className="style-settings-shell__header">
              <div>
                <Text as="span" className="style-settings-shell__eyebrow">
                  Settings
                </Text>
                <Text as="h3" className="style-settings-shell__title">
                  Style Panel
                </Text>
              </div>
              <button
                type="button"
                className="style-settings-shell__close"
                onClick={() => setShowStyleSettings(false)}
                aria-label="Close style settings"
              >
                <X size={18} />
              </button>
            </div>
            <Mask
              fillWidth
              x={50}
              y={50}
              radius={18}
              borderBottom="neutral-medium"
              className="style-settings-shell__mask-line"
              aria-hidden
            />
            <div className="style-settings-shell__body">
              <StylePanel />
            </div>
          </div>
        </div>
      )}

      {showMemory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button
            type="button"
            className="app-shell__overlay-backdrop absolute inset-0"
            onClick={closeMemory}
            aria-label="Zavřít architekturu"
          />
          <div className="app-shell__overlay-panel animate-in zoom-in relative w-full max-w-4xl p-8 duration-300">
            <div className="app-shell__overlay-header mb-12 flex items-center justify-between pb-4">
              <div className="flex items-center gap-3">
                <Database className="app-shell__overlay-icon app-shell__overlay-icon--violet" />
                <h2 className="app-shell__overlay-kicker font-mono text-lg uppercase">
                  Memory Matrix Architecture
                </h2>
              </div>
              <button
                type="button"
                onClick={closeMemory}
                className="app-shell__overlay-close transition-transform hover:rotate-90"
                aria-label="Zavřít architekturu"
              >
                <X />
              </button>
            </div>
            <div className="grid h-auto grid-cols-1 gap-6 text-center font-mono md:h-64 md:grid-cols-3">
              <div className="app-shell__overlay-card flex flex-col items-center justify-center gap-4 p-6">
                <Activity size={32} className="app-shell__overlay-icon app-shell__overlay-icon--cool" />
                <span className="app-shell__overlay-card-label text-xs">L1: BIOMETRIC SENSORS</span>
              </div>
              <div className="app-shell__overlay-card app-shell__overlay-card--active flex flex-col items-center justify-center gap-4 p-6">
                <Cpu size={32} className="app-shell__overlay-icon app-shell__overlay-icon--violet" />
                <span className="app-shell__overlay-card-label app-shell__overlay-card-label--active text-xs font-bold underline underline-offset-8">
                  L2: LOGIC CORE
                </span>
              </div>
              <div className="app-shell__overlay-card flex flex-col items-center justify-center gap-4 p-6">
                <Shield size={32} className="app-shell__overlay-icon app-shell__overlay-icon--safe" />
                <span className="app-shell__overlay-card-label text-xs">L3: ACTIVE FIREWALL</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {showChat && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button
            type="button"
            className="app-shell__overlay-backdrop absolute inset-0"
            onClick={closeChat}
            aria-label="Zavřít Neural Link"
          />
          <div className="app-shell__chat-panel animate-in fade-in zoom-in relative w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="app-shell__chat-panel-header flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <Cpu size={16} className="app-shell__overlay-icon app-shell__overlay-icon--accent" />
                <span className="app-shell__chat-panel-kicker font-mono text-[10px] uppercase tracking-[0.2em]">
                  Neural Link Status: Active
                </span>
              </div>
              <button
                type="button"
                onClick={closeChat}
                className="app-shell__overlay-close"
                aria-label="Zavřít Neural Link"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex min-h-[400px] flex-col p-8 font-mono">
              {!aiResponse ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-8">
                  <div className="text-center">
                    <h3 className="app-shell__overlay-title mb-2 text-xl">
                      Jakou analýzu dnes spustíme?
                    </h3>
                    <p className="app-shell__overlay-copy text-xs">
                      Digitální dvojče vyčkává na vstup.
                    </p>
                  </div>
                  <div className="relative w-full">
                    <input
                      type="text"
                      value={queryText}
                      onChange={(event) => setQueryText(event.target.value)}
                      onKeyDown={(event) =>
                        event.key === "Enter" && handleNeuralLink()
                      }
                      className="app-shell__chat-input w-full rounded-xl p-5 outline-none transition-all"
                      placeholder="Zadejte vektor dotazu..."
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleNeuralLink}
                      disabled={isLoading || !queryText.trim()}
                      className="app-shell__chat-send absolute right-4 top-1/2 -translate-y-1/2 transition-all disabled:opacity-20"
                      aria-label="Odeslat dotaz"
                    >
                      {isLoading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <Send size={24} />
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="animate-in slide-in-from-bottom-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="app-shell__chat-result app-shell__chat-result--human p-6">
                    <div className="app-shell__chat-result-head app-shell__chat-result-head--human mb-4 flex items-center gap-2">
                      <Fingerprint size={16} />
                      <span className="text-[10px] font-bold uppercase">
                        Human Echo
                      </span>
                    </div>
                    <p className="app-shell__chat-result-copy app-shell__chat-result-copy--human text-sm italic leading-relaxed">
                      "{aiResponse.human}"
                    </p>
                  </div>
                  <div className="app-shell__chat-result app-shell__chat-result--machine p-6">
                    <div className="app-shell__chat-result-head app-shell__chat-result-head--machine mb-4 flex items-center gap-2">
                      <Cpu size={16} />
                      <span className="text-[10px] font-bold uppercase">
                        Machine Logic
                      </span>
                    </div>
                    <p className="app-shell__chat-result-copy app-shell__chat-result-copy--machine font-mono text-sm leading-relaxed">
                      {"> "}
                      {aiResponse.machine}
                    </p>
                  </div>
                  <div className="mt-6 flex justify-center md:col-span-2">
                    <button
                      type="button"
                      onClick={resetSession}
                      className="app-shell__chat-reset border-b pb-1 text-[10px] uppercase tracking-widest"
                    >
                      Nová Session
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </div>
  );
}
