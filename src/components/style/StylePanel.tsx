"use client";

import { forwardRef, useEffect, useState } from "react";
import type { ComponentProps } from "react";
import classNames from "classnames";
import {
  Column,
  Flex,
  Scroller,
  SegmentedControl,
  Text,
  ThemeSwitcher,
} from "@once-ui-system/core/components";
import { useDataTheme, useStyle } from "@once-ui-system/core/contexts";
import type {
  BorderStyle,
  NeutralColor,
  ScalingSize,
  SolidStyle,
  SolidType,
  SurfaceStyle,
  TransitionStyle,
} from "@once-ui-system/core/contexts";
import type { ChartMode } from "@once-ui-system/core/modules";
import type { Schemes } from "@once-ui-system/core";
import styles from "./StylePanel.module.scss";

type StylePanelProps = ComponentProps<typeof Column>;
type ShapeOption = BorderStyle | "sharp";

const schemes = [
  "blue",
  "aqua",
  "magenta",
  "pink",
  "yellow",
  "orange",
  "red",
  "moss",
  "green",
  "emerald",
  "cyan",
  "violet",
  "indigo",
] as const satisfies readonly Schemes[];

const shapes = ["sharp", "conservative", "playful", "rounded"] as const;
const neutralOptions = [
  "gray",
  "sand",
  "slate",
  "dusk",
  "mint",
  "rose",
] as const;

type SchemeOption = (typeof schemes)[number];
type NeutralOption = (typeof neutralOptions)[number];
type SwatchColor = SchemeOption | NeutralOption | "neutral";

const colorOptions = {
  brand: [...schemes],
  accent: [...schemes],
  neutral: [...neutralOptions],
} as const;

type SwatchButtonProps = {
  color: SwatchColor;
  selected: boolean;
  onClick: () => void;
};

type ColorRowProps<T extends string> = {
  label: string;
  options: readonly T[];
  value: T;
  onSelect: (color: T) => void;
};

function SwatchButton({ color, selected, onClick }: SwatchButtonProps) {
  return (
    <button
      type="button"
      className={classNames(styles.select, selected && styles.selected)}
      onClick={onClick}
      aria-pressed={selected}
      title={color}
    >
      <div className={classNames(styles[color], styles.swatch)} />
    </button>
  );
}

function ColorRow<T extends string>({
  label,
  options,
  value,
  onSelect,
}: ColorRowProps<T>) {
  return (
    <Flex
      borderBottom="neutral-alpha-medium"
      horizontal="between"
      vertical="center"
      fillWidth
      paddingX="24"
      paddingY="16"
      gap="24"
    >
      <Flex textVariant="label-default-s" minWidth={3}>
        {label}
      </Flex>
      <Scroller minWidth={0} fitWidth>
        {options.map((color) => (
          <Flex marginRight="2" key={color} center>
            <SwatchButton
              color={color as SwatchColor}
              selected={value === color}
              onClick={() => onSelect(color)}
            />
          </Flex>
        ))}
      </Scroller>
    </Flex>
  );
}

const StylePanel = forwardRef<HTMLDivElement, StylePanelProps>(function StylePanel(
  { className, style, ...rest },
  ref,
) {
  const styleContext = useStyle();
  const { mode: chartMode, setChartOptions } = useDataTheme();
  const [mounted, setMounted] = useState(false);
  const [borderValue, setBorderValue] = useState<ShapeOption>("playful");
  const [brandValue, setBrandValue] = useState<SchemeOption>("cyan");
  const [accentValue, setAccentValue] = useState<SchemeOption>("indigo");
  const [neutralValue, setNeutralValue] = useState<NeutralOption>("gray");
  const [solidValue, setSolidValue] = useState<SolidType>("contrast");
  const [solidStyleValue, setSolidStyleValue] = useState<SolidStyle>("flat");
  const [surfaceValue, setSurfaceValue] = useState<SurfaceStyle>("filled");
  const [scalingValue, setScalingValue] = useState<ScalingSize>("100");
  const [chartModeValue, setChartModeValue] = useState<ChartMode>("categorical");
  const [transitionValue, setTransitionValue] = useState<TransitionStyle>("all");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setBorderValue(styleContext.border as ShapeOption);
    setBrandValue(styleContext.brand as SchemeOption);
    setAccentValue(styleContext.accent as SchemeOption);
    setNeutralValue(styleContext.neutral as NeutralOption);
    setSolidValue(styleContext.solid);
    setSolidStyleValue(styleContext.solidStyle);
    setSurfaceValue(styleContext.surface);
    setScalingValue(styleContext.scaling);
    setTransitionValue(styleContext.transition);
    setChartModeValue(chartMode);
  }, [
    chartMode,
    styleContext.accent,
    styleContext.border,
    styleContext.brand,
    styleContext.neutral,
    styleContext.scaling,
    styleContext.solid,
    styleContext.solidStyle,
    styleContext.surface,
    styleContext.transition,
  ]);

  return (
    <Column
      fillWidth
      gap="16"
      ref={ref}
      className={classNames(styles.panel, className)}
      style={style}
      {...rest}
    >
      <Column fillWidth paddingTop="12" paddingLeft="16" gap="4">
        <Text variant="heading-strong-s">Page</Text>
        <Text variant="body-default-s" onBackground="neutral-weak">
          Customize page theme
        </Text>
      </Column>

      <Column fillWidth border="neutral-alpha-medium" radius="l-4">
        <Flex
          horizontal="between"
          vertical="center"
          fillWidth
          paddingX="24"
          paddingY="16"
          borderBottom="neutral-alpha-medium"
        >
          <Text variant="label-default-s">Theme</Text>
          <ThemeSwitcher />
        </Flex>

        <Flex
          horizontal="between"
          vertical="center"
          fillWidth
          paddingX="24"
          paddingY="16"
        >
          <Text variant="label-default-s">Shape</Text>
          <Flex gap="4">
            {shapes.map((radius) => (
              <SwatchButton
                key={radius}
                color="neutral"
                selected={mounted && borderValue === radius}
                onClick={() => {
                  styleContext.setStyle({ border: radius as BorderStyle });
                  setBorderValue(radius);
                }}
              />
            ))}
          </Flex>
        </Flex>
      </Column>

      <Column fillWidth paddingTop="12" paddingLeft="16" gap="4">
        <Text variant="heading-strong-s">Color</Text>
        <Text variant="body-default-s" onBackground="neutral-weak">
          Customize color schemes
        </Text>
      </Column>

      <Column fillWidth border="neutral-alpha-medium" radius="l-4">
        <ColorRow
          label="Brand"
          options={colorOptions.brand}
          value={brandValue}
          onSelect={(color) => {
            styleContext.setStyle({ brand: color });
            setBrandValue(color);
          }}
        />

        <ColorRow
          label="Accent"
          options={colorOptions.accent}
          value={accentValue}
          onSelect={(color) => {
            styleContext.setStyle({ accent: color });
            setAccentValue(color);
          }}
        />

        <Flex
          horizontal="between"
          vertical="center"
          fillWidth
          paddingX="24"
          paddingY="16"
          gap="24"
        >
          <Flex textVariant="label-default-s" minWidth={3}>
            Neutral
          </Flex>
          <Scroller minWidth={0} fitWidth>
            {colorOptions.neutral.map((color) => (
              <Flex marginRight="2" key={color} center>
                <SwatchButton
                  color={color}
                  selected={mounted && neutralValue === color}
                  onClick={() => {
                    styleContext.setStyle({ neutral: color as NeutralColor });
                    setNeutralValue(color);
                  }}
                />
              </Flex>
            ))}
          </Scroller>
        </Flex>
      </Column>

      <Column fillWidth paddingTop="12" paddingLeft="16" gap="4">
        <Text variant="heading-strong-s">Solid style</Text>
        <Text variant="body-default-s" onBackground="neutral-weak">
          Customize the appearance of interactive elements
        </Text>
      </Column>

      <Column fillWidth border="neutral-alpha-medium" radius="l-4">
        <Flex
          borderBottom="neutral-alpha-medium"
          horizontal="between"
          vertical="center"
          fillWidth
          paddingX="24"
          paddingY="16"
          gap="24"
        >
          <Text variant="label-default-s">Style</Text>
          <SegmentedControl
            maxWidth={22}
            minWidth={0}
            buttons={[
              {
                size: "l",
                label: (
                  <Flex vertical="center" gap="12">
                    <Flex
                      border="brand-strong"
                      solid="brand-weak"
                      width="24"
                      height="24"
                      radius="s"
                    />
                    Color
                  </Flex>
                ),
                value: "color",
              },
              {
                size: "l",
                label: (
                  <Flex vertical="center" gap="12">
                    <Flex
                      border="brand-strong"
                      solid="brand-strong"
                      width="24"
                      height="24"
                      radius="s"
                    />
                    Inverse
                  </Flex>
                ),
                value: "inverse",
              },
              {
                size: "l",
                label: (
                  <Flex vertical="center" gap="12">
                    <Flex
                      border="brand-strong"
                      solid="brand-strong"
                      width="24"
                      height="24"
                      radius="s"
                    />
                    Contrast
                  </Flex>
                ),
                value: "contrast",
              },
            ]}
            onToggle={(value) => {
              styleContext.setStyle({ solid: value as SolidType });
              setSolidValue(value as SolidType);
            }}
            selected={mounted ? solidValue : undefined}
            defaultSelected="contrast"
          />
        </Flex>

        <Flex
          horizontal="between"
          vertical="center"
          fillWidth
          paddingX="24"
          paddingY="16"
          gap="24"
        >
          <Text variant="label-default-s">Effect</Text>
          <SegmentedControl
            maxWidth={22}
            minWidth={0}
            buttons={[
              {
                size: "l",
                label: (
                  <Flex vertical="center" gap="12">
                    <Flex
                      border="brand-strong"
                      solid="brand-weak"
                      width="24"
                      height="24"
                      radius="s"
                    />
                    Flat
                  </Flex>
                ),
                value: "flat",
              },
              {
                size: "l",
                label: (
                  <Flex vertical="center" gap="12">
                    <Flex
                      border="brand-strong"
                      solid="brand-weak"
                      width="24"
                      height="24"
                      radius="s"
                      style={{
                        boxShadow:
                          "inset 0 calc(-1 * var(--static-space-8)) var(--static-space-8) var(--brand-solid-strong)",
                      }}
                    />
                    Plastic
                  </Flex>
                ),
                value: "plastic",
              },
            ]}
            onToggle={(value) => {
              styleContext.setStyle({ solidStyle: value as SolidStyle });
              setSolidStyleValue(value as SolidStyle);
            }}
            selected={mounted ? solidStyleValue : undefined}
            defaultSelected="flat"
          />
        </Flex>
      </Column>

      <Column fillWidth paddingTop="12" paddingLeft="16" gap="4">
        <Text variant="heading-strong-s">Advanced</Text>
        <Text variant="body-default-s" onBackground="neutral-weak">
          Customize advanced styling options
        </Text>
      </Column>

      <Column fillWidth border="neutral-alpha-medium" radius="l-4">
        <Flex
          borderBottom="neutral-alpha-medium"
          horizontal="between"
          vertical="center"
          fillWidth
          paddingX="24"
          paddingY="16"
          gap="24"
        >
          <Text variant="label-default-s">Surface</Text>
          <SegmentedControl
            maxWidth={22}
            minWidth={0}
            onToggle={(value) => {
              styleContext.setStyle({ surface: value as SurfaceStyle });
              setSurfaceValue(value as SurfaceStyle);
            }}
            selected={mounted ? surfaceValue : undefined}
            defaultSelected="filled"
            buttons={[
              { size: "l", label: "Filled", value: "filled" },
              { size: "l", label: "Translucent", value: "translucent" },
            ]}
          />
        </Flex>

        <Flex
          borderBottom="neutral-alpha-medium"
          horizontal="between"
          vertical="center"
          fillWidth
          paddingX="24"
          paddingY="16"
          gap="24"
        >
          <Text variant="label-default-s">Scaling</Text>
          <SegmentedControl
            maxWidth={22}
            minWidth={0}
            onToggle={(value) => {
              styleContext.setStyle({ scaling: value as ScalingSize });
              setScalingValue(value as ScalingSize);
            }}
            selected={mounted ? scalingValue : undefined}
            defaultSelected="100"
            buttons={[
              { size: "l", label: "90", value: "90" },
              { size: "l", label: "95", value: "95" },
              { size: "l", label: "100", value: "100" },
              { size: "l", label: "105", value: "105" },
              { size: "l", label: "110", value: "110" },
            ]}
          />
        </Flex>

        <Flex
          borderBottom="neutral-alpha-medium"
          horizontal="between"
          vertical="center"
          fillWidth
          paddingX="24"
          paddingY="16"
          gap="24"
        >
          <Text variant="label-default-s">Data Style</Text>
          <SegmentedControl
            maxWidth={22}
            minWidth={0}
            onToggle={(value) => {
              setChartOptions({ mode: value as ChartMode });
              setChartModeValue(value as ChartMode);
            }}
            selected={mounted ? chartModeValue : undefined}
            defaultSelected="categorical"
            buttons={[
              { size: "l", label: "Categorical", value: "categorical" },
              { size: "l", label: "Divergent", value: "divergent" },
              { size: "l", label: "Sequential", value: "sequential" },
            ]}
          />
        </Flex>

        <Flex
          horizontal="between"
          vertical="center"
          fillWidth
          paddingX="24"
          paddingY="16"
          gap="24"
        >
          <Text variant="label-default-s">Transition</Text>
          <SegmentedControl
            maxWidth={22}
            minWidth={0}
            onToggle={(value) => {
              styleContext.setStyle({ transition: value as TransitionStyle });
              setTransitionValue(value as TransitionStyle);
            }}
            selected={mounted ? transitionValue : undefined}
            defaultSelected="all"
            buttons={[
              { size: "l", label: "All", value: "all" },
              { size: "l", label: "Micro", value: "micro" },
              { size: "l", label: "Macro", value: "macro" },
              { size: "l", label: "None", value: "none" },
            ]}
          />
        </Flex>
      </Column>
    </Column>
  );
});

StylePanel.displayName = "StylePanel";

export { StylePanel };
