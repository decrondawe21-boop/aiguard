import "@once-ui-system/core/css/styles.css";
import "@once-ui-system/core/css/tokens.css";
import "./globals.css";

import type { ReactNode } from "react";
import classNames from "classnames";
import { Column, ThemeInit } from "@once-ui-system/core";
import { Meta } from "@once-ui-system/core/modules";

import { Providers } from "./providers";
import { defaultMeta } from "./resources/seo";
import { fonts, themeInit } from "../resources/once-ui.config";

export const metadata = Meta.generate(defaultMeta);

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="cs"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={classNames(
        fonts.primary.variable,
        fonts.secondary.variable,
        fonts.tertiary.variable,
        fonts.code.variable,
      )}
    >
      <head>
        <ThemeInit config={themeInit} />
      </head>
      <body>
        <Providers>
          <Column
            as="div"
            background="page"
            fillWidth
            margin="0"
            padding="0"
            style={{ minHeight: "100vh" }}
          >
            {children}
          </Column>
        </Providers>
      </body>
    </html>
  );
}
