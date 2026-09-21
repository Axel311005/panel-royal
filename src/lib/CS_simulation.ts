import {
  CS_BASELINE,
  CS_INITIAL_HOUR,
  CS_ORDER_PROB_PER_TICK,
  CS_PRODUCT_PRICE_USD,
} from "./CS_constants";

export type CS_ReferrerRow = {
  id: string;
  label: string;
  value: number;
  previous: number;
};

export type CS_LocationRow = {
  id: string;
  label: string;
  value: number;
  previous: number;
};

export type CS_LandingRow = {
  id: string;
  label: string;
  path: string;
  value: number;
  previous: number;
};

export type CS_HourPoint = {
  hour: number;
  today: number;
  yesterday: number;
};

export type CS_StatsState = {
  sessions: number;
  addedToCart: number;
  reachedCheckout: number;
  completed: number;
  orders: number;
  fulfilledOrders: number;
  grossSales: number;
  netSales: number;
  discounts: number;
  shipping: number;
  taxes: number;
  totalSales: number;
  returningCustomerRate: number;
  averageOrderValue: number;
  homepageSessions: number;
  desktopSessions: number;
  mobileSessions: number;
  referrers: CS_ReferrerRow[];
  locations: CS_LocationRow[];
  landingPages: CS_LandingRow[];
  salesByHour: CS_HourPoint[];
  sessionsByHour: CS_HourPoint[];
  aovByHour: CS_HourPoint[];
  productDirectSalesPct: Record<string, number>;
  socialSources: CS_ReferrerRow[];
  referralChannelSales: Record<string, number>;
  royalCrownUnitsSold: number;
  lastUpdated: Date;
  momentum: number;
};

const REFERRER_SEEDS: Omit<CS_ReferrerRow, "value" | "previous">[] = [
  { id: "google-mga", label: "Búsqueda · google · Managua" },
  { id: "direct-cb", label: "Directo · Ninguno · Council Bluffs" },
  { id: "direct-mvd", label: "Directo · Ninguno · Montevideo" },
  { id: "google-mvd", label: "Búsqueda · google · Montevideo" },
  { id: "direct-mga", label: "Directo · Ninguno · Managua" },
];

const LOCATION_SEEDS: Omit<CS_LocationRow, "value" | "previous">[] = [
  { id: "ni-mga", label: "Nicaragua · Managua Department · Managua" },
  { id: "uy-mvd", label: "Uruguay · Montevideo Department · Montevideo" },
  { id: "us-ia", label: "United States · Iowa · Council Bluffs" },
  { id: "us-ny", label: "United States · New York · New York" },
  { id: "us-none", label: "United States · Ninguno · Ninguno" },
];

const LANDING_SEEDS: Omit<CS_LandingRow, "value" | "previous">[] = [
  { id: "home", label: "Homepage", path: "/" },
  { id: "crown", label: "Product", path: "/products/royal-crown" },
  { id: "pinolera", label: "Product", path: "/products/la-pinolera-full-set" },
  { id: "diamond", label: "Product", path: "/products/diamond-blue-full-set" },
  { id: "collection", label: "Collection", path: "/collections/all" },
  { id: "password", label: "Password", path: "/password" },
];

function buildHourSeries(
  todaySeed: number[],
  yesterdaySeed: number[]
): CS_HourPoint[] {
  return Array.from({ length: 13 }, (_, i) => ({
    hour: i * 2,
    today: todaySeed[i] ?? 0,
    yesterday: yesterdaySeed[i] ?? 0,
  }));
}

function distribute(total: number, weights: number[]): number[] {
  if (total <= 0) return weights.map(() => 0);
  const sum = weights.reduce((a, b) => a + b, 0);
  const raw = weights.map((w) => (total * w) / sum);
  const floors = raw.map((v) => Math.floor(v));
  let remainder = total - floors.reduce((a, b) => a + b, 0);
  const order = raw
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac);
  for (let k = 0; k < remainder; k++) {
    floors[order[k % order.length].i] += 1;
  }
  return floors;
}

export function CS_createInitialStats(): CS_StatsState {
  const referrers: CS_ReferrerRow[] = [
    { ...REFERRER_SEEDS[0], value: 27, previous: 1 },
    { ...REFERRER_SEEDS[1], value: 18, previous: 5 },
    { ...REFERRER_SEEDS[2], value: 9, previous: 1 },
    { ...REFERRER_SEEDS[3], value: 8, previous: 0 },
    { ...REFERRER_SEEDS[4], value: 4, previous: 2 },
  ];

  const locations: CS_LocationRow[] = [
    { ...LOCATION_SEEDS[0], value: 31, previous: 3 },
    { ...LOCATION_SEEDS[1], value: 18, previous: 1 },
    { ...LOCATION_SEEDS[2], value: 18, previous: 5 },
    { ...LOCATION_SEEDS[3], value: 2, previous: 0 },
    { ...LOCATION_SEEDS[4], value: 2, previous: 2 },
  ];

  const landingPages: CS_LandingRow[] = [
    { ...LANDING_SEEDS[0], value: 66, previous: 12 },
    { ...LANDING_SEEDS[1], value: 4, previous: 0 },
    { ...LANDING_SEEDS[2], value: 1, previous: 0 },
    { ...LANDING_SEEDS[3], value: 1, previous: 0 },
    { ...LANDING_SEEDS[4], value: 1, previous: 0 },
    { ...LANDING_SEEDS[5], value: 2, previous: 1 },
  ];

  const salesHourToday = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const sessionsHourToday = [2, 3, 4, 5, 6, 8, 10, 12, 14, 10, 6, 4, 2];
  const idx = Math.min(Math.floor(CS_INITIAL_HOUR / 2), 12);
  sessionsHourToday[idx] = Math.max(sessionsHourToday[idx], 8);

  return {
    sessions: 76,
    addedToCart: 34,
    reachedCheckout: 27,
    completed: 0,
    orders: 0,
    fulfilledOrders: 0,
    grossSales: 0,
    netSales: 0,
    discounts: 0,
    shipping: 0,
    taxes: 0,
    totalSales: 0,
    returningCustomerRate: 0,
    averageOrderValue: 0,
    homepageSessions: 66,
    desktopSessions: 49,
    mobileSessions: 27,
    referrers,
    locations,
    landingPages,
    salesByHour: buildHourSeries(salesHourToday, [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]),
    sessionsByHour: buildHourSeries(sessionsHourToday, [
      1, 1, 2, 2, 2, 3, 3, 4, 4, 3, 2, 1, 1,
    ]),
    aovByHour: buildHourSeries(
      salesHourToday.map(() => 0),
      salesHourToday.map(() => 0)
    ),
    productDirectSalesPct: {
      "Royal Crown · Default Title · Ninguno": 0,
      "Diamond Blue · Default Title · Ninguno": 0,
      "La Pinolera · Default Title · Ninguno": 0,
    },
    socialSources: [
      { id: "facebook", label: "Facebook", value: 2, previous: 0 },
      { id: "instagram", label: "Instagram", value: 1, previous: 1 },
    ],
    referralChannelSales: {
      direct: 0,
      facebook: 0,
      google: 0,
      instagram: 0,
      shopify: 0,
    },
    royalCrownUnitsSold: 0,
    lastUpdated: new Date(),
    momentum: 0.35,
  };
}

function pickWeightedIndex(weights: number[]): number {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r <= 0) return i;
  }
  return weights.length - 1;
}

function clampHourIndex(): number {
  const h = new Date().getHours();
  return Math.min(Math.floor(h / 2), 12);
}

export function CS_tickStats(prev: CS_StatsState): CS_StatsState {
  const hourIdx = clampHourIndex();
  let momentum = prev.momentum + (Math.random() - 0.42) * 0.08;
  momentum = Math.max(0.15, Math.min(1.2, momentum));

  const burst = Math.random() < 0.08 + momentum * 0.05;
  const newSessions = burst
    ? 2 + Math.floor(Math.random() * 4)
    : Math.random() < 0.55 + momentum * 0.2
      ? 1
      : 0;

  let sessions = prev.sessions + newSessions;
  let addedToCart = prev.addedToCart;
  let reachedCheckout = prev.reachedCheckout;
  let completed = prev.completed;
  let orders = prev.orders;
  let fulfilledOrders = prev.fulfilledOrders;
  let grossSales = prev.grossSales;
  let discounts = prev.discounts;
  let shipping = prev.shipping;
  let taxes = prev.taxes;

  const cartRate = 0.38 + momentum * 0.12 + Math.random() * 0.08;
  const checkoutRate = 0.72 + Math.random() * 0.12;
  let royalCrownUnitsSold = prev.royalCrownUnitsSold;
  const referralChannelSales = { ...prev.referralChannelSales };
  const socialSources = prev.socialSources.map((s) => ({ ...s }));

  const CS_registerOrder = () => {
    completed += 1;
    orders += 1;
    const useDiscount = Math.random() < 0.12;
    const lineGross = CS_PRODUCT_PRICE_USD;
    const lineDiscount = useDiscount ? lineGross * (0.05 + Math.random() * 0.1) : 0;
    const lineNet = lineGross - lineDiscount;
    const lineShip = Math.random() < 0.35 ? 4.5 + Math.random() * 3 : 0;
    const lineTax = lineNet * 0.08;
    grossSales += lineGross;
    discounts += lineDiscount;
    shipping += lineShip;
    taxes += lineTax;
    royalCrownUnitsSold += 1;
    const channelRoll = Math.random();
    const lineTotal = lineNet + lineShip + lineTax;
    if (channelRoll < 0.45) referralChannelSales.google += lineTotal;
    else if (channelRoll < 0.7) referralChannelSales.direct += lineTotal;
    else if (channelRoll < 0.85) referralChannelSales.instagram += lineTotal;
    else if (channelRoll < 0.95) referralChannelSales.facebook += lineTotal;
    else referralChannelSales.shopify += lineTotal;
  };

  for (let i = 0; i < newSessions; i++) {
    if (Math.random() < 0.06 + momentum * 0.04) {
      const socialIdx = Math.random() < 0.65 ? 0 : 1;
      socialSources[socialIdx].value += 1;
    }
    if (Math.random() < cartRate) {
      addedToCart += 1;
      if (Math.random() < checkoutRate) {
        reachedCheckout += 1;
      }
    }
  }

  if (Math.random() < CS_ORDER_PROB_PER_TICK) {
    if (reachedCheckout <= completed) {
      reachedCheckout += 1;
    }
    CS_registerOrder();
  }

  const pendingFulfillment = orders - fulfilledOrders;
  if (pendingFulfillment > 0 && Math.random() < 0.14 + momentum * 0.06) {
    fulfilledOrders += 1;
  }

  const netSales = grossSales - discounts;
  const totalSales = netSales + shipping + taxes;
  const averageOrderValue = orders > 0 ? totalSales / orders : 0;
  const returningCustomerRate =
    orders > 0 ? Math.min(28, 4 + orders * 1.2 + Math.random() * 2) : 0;

  const refWeights = prev.referrers.map((r) => r.value + 1);
  const locWeights = prev.locations.map((l) => l.value + 1);
  const landWeights = prev.landingPages.map((l, i) =>
    i === 0 ? l.value + 3 : l.value + (i === 1 ? 2 : 0.5)
  );

  const refAdds = distribute(newSessions, refWeights);
  const locAdds = distribute(newSessions, locWeights);
  const landAdds = distribute(newSessions, landWeights);

  const referrers = prev.referrers.map((r, i) => ({
    ...r,
    value: r.value + refAdds[i],
  }));
  const locations = prev.locations.map((l, i) => ({
    ...l,
    value: l.value + locAdds[i],
  }));
  const landingPages = prev.landingPages.map((l, i) => ({
    ...l,
    value: l.value + landAdds[i],
  }));

  let homepageSessions = prev.homepageSessions + landAdds[0];
  const deviceSplit = Math.random() < 0.62 ? "desktop" : "mobile";
  let desktopSessions =
    prev.desktopSessions + (deviceSplit === "desktop" ? newSessions : 0);
  let mobileSessions =
    prev.mobileSessions + (deviceSplit === "mobile" ? newSessions : 0);
  if (deviceSplit === "desktop" && newSessions > 1) {
    mobileSessions += Math.floor(newSessions / 3);
  } else if (newSessions > 1) {
    desktopSessions += Math.floor(newSessions / 3);
  }

  const salesByHour = prev.salesByHour.map((p, i) => {
    if (i !== hourIdx) return p;
    const orderDelta = orders - prev.orders;
    return {
      ...p,
      today: p.today + orderDelta * CS_PRODUCT_PRICE_USD * 0.9,
    };
  });

  const sessionsByHour = prev.sessionsByHour.map((p, i) =>
    i === hourIdx ? { ...p, today: p.today + newSessions } : p
  );

  const aovByHour = prev.aovByHour.map((p, i) =>
    i === hourIdx
      ? {
          ...p,
          today: averageOrderValue > 0 ? averageOrderValue : p.today,
        }
      : p
  );

  const crownKey = "Royal Crown · Default Title · Ninguno";
  const productDirectSalesPct = { ...prev.productDirectSalesPct };
  if (orders > prev.orders) {
    const newOrders = orders - prev.orders;
    productDirectSalesPct[crownKey] = Math.min(
      100,
      productDirectSalesPct[crownKey] +
        newOrders * (8 + Math.random() * 6) +
        momentum * 2
    );
    const others = Object.keys(productDirectSalesPct).filter((k) => k !== crownKey);
    for (const k of others) {
      productDirectSalesPct[k] = Math.min(
        35,
        productDirectSalesPct[k] + Math.random() * 0.4
      );
    }
  }

  if (newSessions > 0 && Math.random() < 0.3) {
    const bumpIdx = pickWeightedIndex(refWeights);
    referrers[bumpIdx] = {
      ...referrers[bumpIdx],
      value: referrers[bumpIdx].value + 1,
    };
  }

  return {
    sessions,
    addedToCart,
    reachedCheckout,
    completed,
    orders,
    fulfilledOrders,
    grossSales,
    netSales,
    discounts,
    shipping,
    taxes,
    totalSales,
    returningCustomerRate,
    averageOrderValue,
    homepageSessions,
    desktopSessions,
    mobileSessions,
    referrers,
    locations,
    landingPages,
    salesByHour,
    sessionsByHour,
    aovByHour,
    productDirectSalesPct,
    socialSources,
    referralChannelSales,
    royalCrownUnitsSold,
    lastUpdated: new Date(),
    momentum,
  };
}

export function CS_growthPct(current: number, baseline: number): number | null {
  if (baseline <= 0 && current <= 0) return null;
  if (baseline <= 0) return null;
  return ((current - baseline) / baseline) * 100;
}

export { CS_BASELINE };
