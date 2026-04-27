"use client";

import type { ReactNode } from "react";
import {
  DataThemeProvider,
  IconProvider,
  LayoutProvider,
  ThemeProvider,
  ToastProvider,
} from "@once-ui-system/core";

import { style } from "../resources/once-ui.config";
import { onceUiIcons } from "../resources/once-ui-icons";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <LayoutProvider>
      <ThemeProvider
        theme={style.theme}
        brand={style.brand}
        accent={style.accent}
        neutral={style.neutral}
        solid={style.solid}
        solidStyle={style.solidStyle}
        border={style.border}
        surface={style.surface}
        transition={style.transition}
        scaling={style.scaling}
      >
        <DataThemeProvider>
          <ToastProvider>
            <IconProvider icons={onceUiIcons}>{children}</IconProvider>
          </ToastProvider>
        </DataThemeProvider>
      </ThemeProvider>
    </LayoutProvider>
  );
}
