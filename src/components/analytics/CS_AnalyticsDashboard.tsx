"use client";

import { useCS_Stats } from "@/components/CS_StatsProvider";
import { CS_formatSimulationStartLabel } from "@/lib/CS_constants";
import { CS_BASELINE } from "@/lib/CS_simulation";
import {
  CS_formatCompactGrowth,
  CS_formatDateLabel,
  CS_formatDateTimeLabel,
  CS_formatMoney,
  CS_formatNumber,
  CS_formatPercent,
} from "@/lib/CS_format";
import { CS_ComparisonLineChart, CS_DeviceDonut } from "./CS_Charts";
import {
  CS_Card,
  CS_EmptyState,
  CS_Funnel,
  CS_HorizontalBars,
  CS_MetricHeadline,
  CS_SparklinePlaceholder,
} from "./CS_CardParts";

function CS_UpdatedLabel({ date }: { date: Date }) {
  const text = CS_formatDateTimeLabel(date);
  return (
    <span className="text-[12px] text-[#616161]" suppressHydrationWarning>
      Actualizado {text}
    </span>
  );
}

export function CS_AnalyticsDashboard() {
  const { stats, simulationActive } = useCS_Stats();

  const sessionGrowth = CS_formatCompactGrowth(stats.sessions, CS_BASELINE.sessions);
  const cartPct = stats.sessions > 0 ? (stats.addedToCart / stats.sessions) * 100 : 0;
  const checkoutPct =
    stats.sessions > 0 ? (stats.reachedCheckout / stats.sessions) * 100 : 0;
  const completePct =
    stats.sessions > 0 ? (stats.completed / stats.sessions) * 100 : 0;
  const conversionPct =
    stats.sessions > 0 ? (stats.orders / stats.sessions) * 100 : 0;

  const salesBreakdown = [
    { label: "Ventas brutas", value: stats.grossSales },
    { label: "Descuentos", value: -stats.discounts },
    { label: "Reversiones de ventas", value: 0 },
    { label: "Ventas netas", value: stats.netSales },
    { label: "Cargos de envío", value: stats.shipping },
    { label: "Cargos por devolución", value: 0 },
    { label: "Impuestos", value: stats.taxes },
    { label: "Ventas totales", value: stats.totalSales },
  ];

  const todayLabel = CS_formatDateLabel(stats.lastUpdated);
  const yesterday = new Date(stats.lastUpdated);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayLabel = CS_formatDateLabel(yesterday);

  return (
    <div className="mx-auto max-w-[1400px] space-y-4 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-semibold">Informes y estadísticas</h1>
            <CS_UpdatedLabel date={stats.lastUpdated} />
          </div>
          {!simulationActive ? (
            <p className="mt-2 rounded-lg border border-[#ffc96b] bg-[#fff5e6] px-3 py-2 text-[13px] text-[#6d4c00]">
              Las métricas en vivo comienzan a las{" "}
              <strong>{CS_formatSimulationStartLabel()}</strong> (hora Nicaragua).
            </p>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-2">
            {["Hoy", "Comparación", "$ USD $"].map((chip, i) => (
              <button
                key={chip}
                type="button"
                className="rounded-lg border border-[#c9c9c9] bg-white px-3 py-1.5 text-[13px] shadow-sm"
              >
                {i === 0 ? `${chip} · ${todayLabel}` : chip}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-lg border border-[#c9c9c9] bg-white px-3 py-1.5 text-[13px]"
          >
            Probar objetivos
          </button>
          <button
            type="button"
            className="rounded-lg bg-[#303030] px-3 py-1.5 text-[13px] font-medium text-white"
          >
            Nueva exploración
          </button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "Ventas brutas",
            value: CS_formatMoney(stats.grossSales),
            growth: CS_formatCompactGrowth(stats.grossSales, CS_BASELINE.grossSales),
            spark: stats.grossSales > 0,
          },
          {
            title: "Tasa de clientes habituales",
            value: CS_formatPercent(stats.returningCustomerRate, 1),
            growth: stats.orders > 0 ? "+100 %" : "—",
            spark: stats.orders > 0,
          },
          {
            title: "Pedidos preparados",
            value: CS_formatNumber(stats.fulfilledOrders),
            growth: CS_formatCompactGrowth(stats.fulfilledOrders, 0),
            spark: stats.fulfilledOrders > 0,
          },
          {
            title: "Pedidos",
            value: CS_formatNumber(stats.orders),
            growth: CS_formatCompactGrowth(stats.orders, CS_BASELINE.orders),
            spark: stats.orders > 0,
          },
        ].map((kpi) => (
          <CS_Card key={kpi.title} title={kpi.title}>
            <div className="flex items-end justify-between">
              <CS_MetricHeadline value={kpi.value} growthLabel={kpi.growth} />
              <CS_SparklinePlaceholder active={kpi.spark} />
            </div>
          </CS_Card>
        ))}
      </div>

      <div className="grid gap-3 xl:grid-cols-3">
        <CS_Card title="Ventas totales a lo largo del tiempo" className="xl:col-span-2">
          <CS_MetricHeadline
            value={CS_formatMoney(stats.totalSales)}
            growthLabel={CS_formatCompactGrowth(stats.totalSales, 0)}
          />
          <CS_ComparisonLineChart
            data={stats.salesByHour}
            valuePrefix=""
            maxHint={Math.max(stats.averageOrderValue * 1.2, 85)}
          />
          <div className="mt-2 flex gap-4 text-[11px] text-[#616161]">
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[#2c6ecb]" />
              {todayLabel}
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full border border-[#2c6ecb] bg-[#a4cafe]" />
              {yesterdayLabel}
            </span>
          </div>
        </CS_Card>

        <CS_Card title="Desglose de ventas totales">
          <ul className="space-y-2 text-[13px]">
            {salesBreakdown.map((row) => (
              <li key={row.label} className="flex justify-between gap-2 border-b border-[#f5f5f5] pb-2">
                <span className="text-[#616161]">{row.label}</span>
                <span className="tabular-nums font-medium">
                  {CS_formatMoney(Math.abs(row.value))}
                  {row.value !== 0 ? "" : " —"}
                </span>
              </li>
            ))}
          </ul>
        </CS_Card>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <CS_Card title="Ventas totales por canal de ventas">
          {stats.totalSales <= 0 ? (
            <CS_EmptyState message="No hay datos para este rango de fechas" />
          ) : (
            <div className="text-[13px]">
              <div className="font-medium">Tienda online</div>
              <div className="mt-1 tabular-nums">{CS_formatMoney(stats.totalSales)}</div>
            </div>
          )}
        </CS_Card>
        <CS_Card title="Valor medio del pedido a lo largo del tiempo">
          <CS_MetricHeadline
            value={CS_formatMoney(stats.averageOrderValue)}
            growthLabel={stats.orders > 0 ? "+100 %" : "—"}
          />
          <CS_ComparisonLineChart
            data={stats.aovByHour}
            height={160}
            maxHint={100}
          />
        </CS_Card>
        <CS_Card title="Ventas totales por producto">
          {stats.orders <= 0 ? (
            <CS_EmptyState message="No hay datos para este rango de fechas" />
          ) : (
            <ul className="space-y-2 text-[13px]">
              <li className="flex justify-between">
                <span>Royal Crown</span>
                <span className="tabular-nums">{CS_formatMoney(stats.grossSales)}</span>
              </li>
            </ul>
          )}
        </CS_Card>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <CS_Card title="Sesiones a lo largo del tiempo">
          <CS_MetricHeadline
            value={CS_formatNumber(stats.sessions)}
            growthLabel={sessionGrowth}
          />
          <CS_ComparisonLineChart data={stats.sessionsByHour} height={180} />
        </CS_Card>
        <CS_Card title="Tasa de conversión a lo largo del tiempo">
          <CS_MetricHeadline
            value={CS_formatPercent(conversionPct, 2)}
            growthLabel={stats.orders > 0 ? "+100 %" : "—"}
          />
          <CS_ComparisonLineChart
            data={stats.sessionsByHour.map((p) => ({
              ...p,
              today: stats.sessions > 0 ? (p.today / stats.sessions) * conversionPct * 10 : 0,
              yesterday: 0,
            }))}
            height={180}
            maxHint={5}
          />
        </CS_Card>
        <CS_Card title="Desglose de la tasa de conversión">
          <CS_Funnel
            steps={[
              {
                label: "Sesiones",
                pct: 100,
                count: stats.sessions,
                growth: sessionGrowth.startsWith("+") ? sessionGrowth : undefined,
              },
              {
                label: "Añadido al carrito",
                pct: cartPct,
                count: stats.addedToCart,
                growth: CS_formatCompactGrowth(stats.addedToCart, CS_BASELINE.cart),
              },
              {
                label: "Llegaron al pago",
                pct: checkoutPct,
                count: stats.reachedCheckout,
              },
              {
                label: "Completado",
                pct: completePct,
                count: stats.completed,
                growth:
                  stats.completed > 0
                    ? CS_formatCompactGrowth(stats.completed, CS_BASELINE.completed)
                    : undefined,
              },
            ]}
          />
        </CS_Card>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <CS_Card title="Sesiones por tipo de dispositivo">
          <CS_DeviceDonut
            desktop={stats.desktopSessions}
            mobile={stats.mobileSessions}
            total={stats.sessions}
          />
          <ul className="mt-2 space-y-1 text-[12px]">
            <li className="flex justify-between">
              <span>Escritorio</span>
              <span className="tabular-nums">
                {stats.desktopSessions}{" "}
                <span className="text-[#008060]">
                  {CS_formatCompactGrowth(stats.desktopSessions, CS_BASELINE.desktopSessions)}
                </span>
              </span>
            </li>
            <li className="flex justify-between">
              <span>Móvil</span>
              <span className="tabular-nums">
                {stats.mobileSessions}{" "}
                <span className="text-[#008060]">
                  {CS_formatCompactGrowth(stats.mobileSessions, CS_BASELINE.mobileSessions)}
                </span>
              </span>
            </li>
          </ul>
        </CS_Card>
        <CS_Card title="Sesiones por ubicación">
          <CS_HorizontalBars rows={stats.locations} />
        </CS_Card>
        <CS_Card title="Ventas totales por referente social">
          {stats.totalSales <= 0 ? (
            <CS_EmptyState message="No hay datos para este rango de fechas" />
          ) : (
            <CS_HorizontalBars
              rows={[
                {
                  id: "fb-sales",
                  label: "Facebook",
                  value: Math.round(stats.referralChannelSales.facebook),
                  previous: 0,
                },
                {
                  id: "ig-sales",
                  label: "Instagram",
                  value: Math.round(stats.referralChannelSales.instagram),
                  previous: 0,
                },
              ]}
            />
          )}
        </CS_Card>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <CS_Card title="Sesiones por fuente social">
          <CS_HorizontalBars rows={stats.socialSources} />
        </CS_Card>
        <CS_Card title="Ventas totales por referente">
          {stats.totalSales <= 0 ? (
            <CS_EmptyState message="No hay datos para este rango de fechas" />
          ) : (
            <ul className="space-y-2 text-[13px]">
              {Object.entries(stats.referralChannelSales)
                .filter(([, v]) => v > 0)
                .map(([key, value]) => (
                  <li key={key} className="flex justify-between">
                    <span>{key}</span>
                    <span className="tabular-nums">{CS_formatMoney(value)}</span>
                  </li>
                ))}
            </ul>
          )}
        </CS_Card>
        <CS_Card title="Rendimiento por canal de referencia">
          <ul className="space-y-2 text-[13px]">
            {Object.entries(stats.referralChannelSales).map(([key, value]) => (
              <li key={key} className="flex justify-between gap-2">
                <span className="text-[#616161]">{key}</span>
                <span className="tabular-nums font-medium">
                  {CS_formatMoney(value)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex gap-3 text-[11px] text-[#616161]">
            <span>● Directo</span>
            <span>● Orgánico</span>
            <span>● Desconocido</span>
          </div>
        </CS_Card>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <CS_Card title="Análisis de cohorte de clientes">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] border-collapse text-center text-[11px]">
              <thead>
                <tr className="text-[#616161]">
                  <th className="p-1 text-left font-normal">Mes</th>
                  {[0, 1, 2, 3, 4, 5, 6].map((m) => (
                    <th key={m} className="p-1 font-normal">
                      {m}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {["mar 2026", "abr 2026", "may 2026", "jun 2026", "jul 2026"].map(
                  (month, ri) => (
                    <tr key={month}>
                      <td className="p-1 text-left">{month}</td>
                      {[0, 1, 2, 3, 4, 5, 6].map((ci) => {
                        const val =
                          ri === 0 && ci === 0
                            ? 7.89
                            : ri === 1 && ci === 1
                              ? Math.min(20 + stats.orders * 0.5, 35)
                              : 0;
                        const bg =
                          val >= 15
                            ? "bg-[#2c6ecb] text-white"
                            : val > 0
                              ? "bg-[#b4daf8]"
                              : "bg-[#fafafa]";
                        return (
                          <td key={ci} className={`p-1 ${bg} tabular-nums`}>
                            {val > 0 ? `${val.toFixed(2).replace(".", ",")} %` : "0 %"}
                          </td>
                        );
                      })}
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </CS_Card>
        <CS_Card title="Sesiones por página de destino">
          <ul className="space-y-2 text-[12px]">
            {stats.landingPages.map((page) => (
              <li key={page.id} className="flex justify-between gap-2">
                <span className="truncate">
                  {page.label} · {page.path}
                </span>
                <span className="shrink-0 tabular-nums">
                  {page.value}{" "}
                  {page.previous > 0 ? (
                    <span className="text-[#008060]">
                      {CS_formatCompactGrowth(page.value, page.previous)}
                    </span>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        </CS_Card>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <CS_Card title="Sesiones por referente">
          <CS_HorizontalBars rows={stats.referrers} />
        </CS_Card>
        <CS_Card title="Ventas totales por sucursal de POS">
          <CS_EmptyState message="No hay datos para este rango de fechas" />
        </CS_Card>
        <CS_Card title="Productos por tasa de ventas directas">
          <ul className="space-y-3">
            {Object.entries(stats.productDirectSalesPct).map(([name, pct]) => (
              <li key={name}>
                <div className="mb-1 flex justify-between text-[12px]">
                  <span className="truncate pr-2">{name}</span>
                  <span className="tabular-nums">{CS_formatPercent(pct, 1)}</span>
                </div>
                <div className="h-2 rounded-full bg-[#f0f0f0]">
                  <div
                    className="h-2 rounded-full bg-[#2c6ecb] transition-all duration-700"
                    style={{ width: `${Math.min(100, pct)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </CS_Card>
      </div>

      <CS_Card title="Ventas totales del personal de POS">
        <CS_EmptyState message="No hay datos para este rango de fechas" />
      </CS_Card>
    </div>
  );
}
