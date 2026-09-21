/** Precio del producto estrella (Royal Crown) para calcular ventas orgánicas */
export const CS_PRODUCT_PRICE_USD = 85;

export const CS_STORE_NAME = "Royal Boss Nicaragua";

export const CS_PRODUCT_NAME = "Royal Crown";

/** Valores base del día anterior (comparación en informes) */
export const CS_BASELINE = {
  sessions: 13,
  cart: 1,
  checkout: 1,
  completed: 0,
  grossSales: 0,
  orders: 0,
  homepageSessions: 12,
  desktopSessions: 7,
  mobileSessions: 6,
};

export const CS_INITIAL_HOUR = new Date().getHours();

/** Inicio del incremento en vivo (hora Nicaragua / America/Managua) */
export const CS_SIMULATION_TIMEZONE = "America/Managua";
export const CS_SIMULATION_START_HOUR = 18;
export const CS_SIMULATION_START_MINUTE = 30;

export function CS_getManaguaTimeParts(date: Date = new Date()) {
  const formatted = new Intl.DateTimeFormat("en-GB", {
    timeZone: CS_SIMULATION_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
  const [hourStr, minuteStr] = formatted.split(":");
  return { hour: Number(hourStr), minute: Number(minuteStr) };
}

export function CS_isSimulationActive(date: Date = new Date()): boolean {
  const { hour, minute } = CS_getManaguaTimeParts(date);
  const nowMinutes = hour * 60 + minute;
  const startMinutes =
    CS_SIMULATION_START_HOUR * 60 + CS_SIMULATION_START_MINUTE;
  return nowMinutes >= startMinutes;
}

export function CS_formatSimulationStartLabel(): string {
  const h = CS_SIMULATION_START_HOUR;
  const m = CS_SIMULATION_START_MINUTE.toString().padStart(2, "0");
  const period = h >= 12 ? "p. m." : "a. m.";
  const h12 = h % 12 || 12;
  return `${h12}:${m} ${period}`;
}
