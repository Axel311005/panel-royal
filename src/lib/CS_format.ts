const CS_MONTHS_SHORT = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
] as const;

/** Formato estable SSR/cliente (evita espacios Unicode de Intl). */
export function CS_formatDateLabel(date: Date): string {
  return `${date.getDate()} ${CS_MONTHS_SHORT[date.getMonth()]} ${date.getFullYear()}`;
}

export function CS_formatDateTimeLabel(date: Date): string {
  const hours24 = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const isPm = hours24 >= 12;
  const hours12 = hours24 % 12 || 12;
  const period = isPm ? "p. m." : "a. m.";
  return `${CS_formatDateLabel(date)}, ${hours12}:${minutes} ${period}`;
}

function CS_formatDecimal(value: number, fractionDigits: number): string {
  const fixed = value.toFixed(fractionDigits);
  const [intPart, fracPart] = fixed.split(".");
  const withThousands = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return fracPart !== undefined ? `${withThousands},${fracPart}` : withThousands;
}

export function CS_formatMoney(value: number): string {
  return `${CS_formatDecimal(value, 2)} US$`;
}

export function CS_formatCompactGrowth(current: number, baseline: number): string {
  if (baseline <= 0 && current <= 0) return "—";
  if (baseline <= 0) return "+∞";
  const pct = ((current - baseline) / baseline) * 100;
  if (pct <= 0) return `${Math.round(pct)} %`;
  if (pct >= 1000) {
    const thousands = pct / 1000;
    const label =
      thousands >= 10
        ? `${Math.round(thousands)} mil %`
        : `${thousands.toFixed(1).replace(".", ",")} mil %`;
    return `+${label}`;
  }
  return `+${Math.round(pct)} %`;
}

export function CS_formatPercent(value: number, decimals = 0): string {
  return `${value.toFixed(decimals).replace(".", ",")} %`;
}

export function CS_formatNumber(value: number): string {
  return CS_formatDecimal(value, 0);
}
