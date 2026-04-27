"use client";

import { BarChart, Column, Flex, LineChart, PieChart, Text } from "@once-ui-system/core";
import { Badge } from "@once-ui-system/core/components/Badge";
import { BarChart3, Clock3, ShieldCheck, TrendingUp, Zap } from "lucide-react";
import styles from "./ExpectedResultsPage.module.css";

const efficiencyData = [
  { date: "2024-01-01", label: "Start", "Nové řešení": 100, "Původní stav": 100 },
  { date: "2024-02-01", label: "Měsíc 1", "Nové řešení": 115, "Původní stav": 102 },
  { date: "2024-03-01", label: "Měsíc 2", "Nové řešení": 135, "Původní stav": 103 },
  { date: "2024-04-01", label: "Měsíc 3", "Nové řešení": 160, "Původní stav": 105 },
  { date: "2024-05-01", label: "Měsíc 4", "Nové řešení": 185, "Původní stav": 106 },
  { date: "2024-06-01", label: "Měsíc 5", "Nové řešení": 210, "Původní stav": 108 },
  { date: "2024-07-01", label: "Měsíc 6", "Nové řešení": 245, "Původní stav": 110 },
] as const;

const riskData = [
  { date: "2024-01-01", label: "Doba odezvy", "Před implementací": 85, "Po implementaci": 12 },
  { date: "2024-02-01", label: "Manuální práce", "Před implementací": 70, "Po implementaci": 15 },
  { date: "2024-03-01", label: "Incidenty", "Před implementací": 45, "Po implementaci": 5 },
  { date: "2024-04-01", label: "Údržba", "Před implementací": 90, "Po implementaci": 40 },
] as const;

const benefitSegments = [
  { name: "Úspora nákladů", value: 35 },
  { name: "Zvýšení bezpečnosti", value: 40 },
  { name: "Rychlost procesů", value: 25 },
] as const;

const legendColors = ["#3b82f6", "#10b981", "#f59e0b"] as const;

const metrics = [
  {
    label: "Nárůst efektivity",
    value: "+145 %",
    meta: "v horizontu 6 měsíců",
    icon: TrendingUp,
    iconColor: "#10b981",
    metaClass: styles.metricMetaSafe,
  },
  {
    label: "Snížení rizik",
    value: "-88 %",
    meta: "u kritických incidentů",
    icon: ShieldCheck,
    iconColor: "#3b82f6",
    metaClass: styles.metricMeta,
  },
  {
    label: "Návratnost investice",
    value: "4,5 měsíce",
    meta: "předpokládaný break-even",
    icon: Clock3,
    iconColor: "#f59e0b",
    metaClass: styles.metricMetaWarn,
  },
] as const;

type ExpectedResultsPageProps = {
  embedded?: boolean;
};

export function ExpectedResultsPage({ embedded = false }: ExpectedResultsPageProps) {
  return (
    <section
      id={embedded ? "expected-results" : undefined}
      className={embedded ? styles.embeddedSection : styles.page}
    >
      <div className={`${styles.shell} ${embedded ? styles.shellEmbedded : ""}`}>
        <header className={styles.hero}>
          <Badge
            className={styles.eyebrow}
            border="neutral-alpha-medium"
            background="surface"
            textVariant="label-default-s"
          >
            {embedded ? "AEGIS Outcome Layer" : "AEGIS Outcome Modeling"}
          </Badge>
          <Text as="h1" className={styles.title}>
            {embedded ? "Metriky dopadu a návratnosti" : "Analýza očekávaných výsledků AEGIS"}
          </Text>
          <Text as="p" className={styles.copy}>
            {embedded
              ? "Vnořená analytická vrstva ukazuje, jak by se po nasazení AEGIS měnila efektivita, úroveň rizika a návratnost investice. Vizualizace stojí přímo na Once UI data komponentách."
              : "Vizualizace klíčových metrik, rizik a návratnosti po implementaci řešení v ekosystému AEGIS. Page používá přímo Once UI data komponenty místo ruční práce s `recharts` wrappery."}
          </Text>
        </header>

        <section className={styles.metrics}>
          {metrics.map((metric) => {
            const Icon = metric.icon;

            return (
              <article key={metric.label} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.metricLabel}>{metric.label}</span>
                  <span className={styles.iconWrap}>
                    <Icon size={18} color={metric.iconColor} />
                  </span>
                </div>
                <span className={styles.metricValue}>{metric.value}</span>
                <div className={`${styles.metricMeta} ${metric.metaClass}`}>{metric.meta}</div>
              </article>
            );
          })}
        </section>

        <section className={styles.charts}>
          <article className={styles.chartCard}>
            <div className={styles.chartShell}>
              <LineChart
                title="Projekce výkonu v čase"
                description="Srovnání růstu nové vrstvy s baseline provozem."
                axis="x"
                grid="y"
                curve="linear"
                tooltip
                date={{
                  start: new Date("2024-01-01"),
                  end: new Date("2024-07-01"),
                  format: "MMM",
                }}
                legend={{
                  display: true,
                  position: "top-left",
                }}
                series={[
                  { key: "Nové řešení", color: "blue" },
                  { key: "Původní stav", color: "gray" },
                ]}
                data={efficiencyData as unknown as Array<Record<string, string | number>>}
                data-viz-style="sequential"
              />
            </div>
          </article>

          <article className={styles.chartCard}>
            <div className={styles.chartShell}>
              <BarChart
                title="Srovnání klíčových parametrů"
                description="Před implementací vs. po implementaci."
                axis="both"
                grid="y"
                tooltip
                hover
                barWidth="m"
                legend={{
                  display: true,
                  position: "top-left",
                }}
                series={[
                  { key: "Před implementací", color: "gray" },
                  { key: "Po implementaci", color: "green" },
                ]}
                data={riskData as unknown as Array<Record<string, string | number>>}
                data-viz-style="categorical"
              />
            </div>
          </article>

          <article className={styles.summaryCard}>
            <div className={styles.summaryGrid}>
              <div className={styles.chartShell}>
                <PieChart
                  title="Struktura celkového přínosu"
                  description="Podíl nákladové úspory, bezpečnosti a zrychlení procesů."
                  tooltip
                  legend={{ display: false }}
                  series={{ key: "value", color: "blue" }}
                  data={benefitSegments as unknown as Array<Record<string, string | number>>}
                  dataKey="value"
                  nameKey="name"
                  ring={{ inner: 52, outer: 78 }}
                  data-viz-style="categorical"
                />
              </div>

              <div className={styles.legendList}>
                {benefitSegments.map((segment, index) => (
                  <div key={segment.name} className={styles.legendItem}>
                    <span
                      className={styles.legendDot}
                      style={{ backgroundColor: legendColors[index] }}
                    />
                    <span className={styles.legendLabel}>{segment.name}</span>
                    <span className={styles.legendValue}>{segment.value} %</span>
                  </div>
                ))}
                <Flex
                  marginTop="16"
                  padding="16"
                  radius="l"
                  border="neutral-alpha-medium"
                  background="surface"
                  gap="12"
                  direction="column"
                >
                  <Flex horizontal="start" gap="8" vertical="center">
                    <Zap size={16} color="#f59e0b" />
                    <Text variant="label-default-s">Interpretace modelu</Text>
                  </Flex>
                  <Text variant="body-default-s" onBackground="neutral-medium">
                    Největší podíl přínosu přichází ze zvýšení bezpečnosti, ale finanční návratnost
                    táhne kombinace provozní úspory a zrychlení reakčních procesů.
                  </Text>
                </Flex>
              </div>
            </div>
          </article>
        </section>

        <footer className={styles.footer}>
          © 2026 Modelová predikce výsledků. Data reprezentují orientační scénář pro SMB nasazení.
        </footer>
      </div>
    </section>
  );
}
