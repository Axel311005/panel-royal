"use client";

import { CS_TrendUp } from "@/components/shopify/CS_Icons";
import { CS_formatCompactGrowth } from "@/lib/CS_format";

export function CS_Card({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-xl border border-[#e3e3e3] bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)] ${className}`}
    >
      <header className="border-b border-[#f0f0f0] px-4 py-3">
        <h2 className="text-[13px] font-semibold text-[#303030]">{title}</h2>
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}

export function CS_MetricHeadline({
  value,
  growthLabel,
  baseline,
  current,
}: {
  value: string;
  growthLabel?: string;
  baseline?: number;
  current?: number;
}) {
  const growth =
    growthLabel ??
    (baseline !== undefined && current !== undefined
      ? CS_formatCompactGrowth(current, baseline)
      : "—");

  const showGreen = growth.startsWith("+");

  return (
    <div className="mb-3 flex flex-wrap items-baseline gap-2">
      <span className="text-xl font-semibold tabular-nums tracking-tight">{value}</span>
      <span
        className={`inline-flex items-center gap-0.5 text-[12px] font-medium ${
          showGreen ? "text-[#008060]" : "text-[#616161]"
        }`}
      >
        {showGreen ? <CS_TrendUp /> : null}
        {growth}
      </span>
    </div>
  );
}

export function CS_EmptyState({ message }: { message: string }) {
  return (
    <div className="flex min-h-[140px] items-center justify-center text-center text-[13px] text-[#616161]">
      {message}
    </div>
  );
}

export function CS_HorizontalBars({
  rows,
}: {
  rows: { id: string; label: string; value: number; previous: number }[];
}) {
  const max = Math.max(...rows.map((r) => r.value), 1);

  return (
    <ul className="space-y-3">
      {rows.map((row) => {
        const pct = (row.value / max) * 100;
        const prevPct = (row.previous / max) * 100;
        const growth = CS_formatCompactGrowth(row.value, row.previous);
        return (
          <li key={row.id}>
            <div className="mb-1 flex items-center justify-between gap-2 text-[12px]">
              <span className="truncate text-[#303030]">{row.label}</span>
              <span className="flex shrink-0 items-center gap-1 tabular-nums">
                <span className="font-medium">{row.value}</span>
                {growth.startsWith("+") ? (
                  <span className="inline-flex items-center text-[#008060]">
                    <CS_TrendUp className="h-3 w-3" />
                    {growth.replace("+", "")}
                  </span>
                ) : null}
              </span>
            </div>
            <div className="relative h-2 rounded-sm bg-[#f0f0f0]">
              <div
                className="absolute inset-y-0 left-0 rounded-sm bg-[#d9d9d9]"
                style={{ width: `${prevPct}%` }}
              />
              <div
                className="absolute inset-y-0 left-0 rounded-sm bg-[#2c6ecb]"
                style={{ width: `${pct}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function CS_Funnel({
  steps,
}: {
  steps: { label: string; pct: number; count: number; growth?: string }[];
}) {
  return (
    <ul className="space-y-2">
      {steps.map((step) => (
        <li key={step.label} className="rounded-lg border border-[#f0f0f0] p-3">
          <div className="mb-2 flex items-center justify-between text-[12px]">
            <span className="font-medium">{step.label}</span>
            <span className="tabular-nums text-[#616161]">
              {step.pct.toFixed(2).replace(".", ",")} %
            </span>
          </div>
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-[#616161]">{step.count} sesiones</span>
            {step.growth ? (
              <span className="inline-flex items-center text-[#008060]">
                <CS_TrendUp className="h-3 w-3" />
                {step.growth}
              </span>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

export function CS_SparklinePlaceholder({ active }: { active?: boolean }) {
  return (
    <svg viewBox="0 0 80 24" className="h-6 w-20 text-[#2c6ecb]" aria-hidden>
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        points={
          active
            ? "0,20 12,18 24,14 36,16 48,8 60,10 72,4 80,6"
            : "0,20 20,20 40,20 60,20 80,20"
        }
      />
    </svg>
  );
}
