"use client";

import { useCS_Stats } from "@/components/CS_StatsProvider";
import {
  CS_PRODUCT_NAME,
  CS_PRODUCT_PRICE_USD,
  CS_STORE_NAME,
} from "@/lib/CS_constants";
import { CS_formatMoney, CS_formatNumber } from "@/lib/CS_format";

function CS_FieldCard({
  title,
  children,
  extra,
}: {
  title: string;
  children: React.ReactNode;
  extra?: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[#e3e3e3] bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)]">
      <header className="flex items-center justify-between border-b border-[#f0f0f0] px-4 py-3">
        <h2 className="text-[13px] font-semibold">{title}</h2>
        {extra}
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}

export function CS_ProductRoyalCrownView() {
  const { stats } = useCS_Stats();
  const crownViews =
    stats.landingPages.find((p) => p.id === "crown")?.value ?? 0;
  const revenue = stats.royalCrownUnitsSold * CS_PRODUCT_PRICE_USD;

  return (
    <div className="mx-auto max-w-[1200px] space-y-4 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[#616161]">🏷</span>
          <h1 className="text-[20px] font-semibold">{CS_PRODUCT_NAME}</h1>
          <span className="rounded-full bg-[#e3f1df] px-2 py-0.5 text-[12px] font-medium text-[#008060]">
            Activo
          </span>
        </div>
        <div className="flex flex-wrap gap-2 text-[13px]">
          <button type="button" className="rounded-lg border border-[#c9c9c9] bg-white px-3 py-1.5">
            Ver
          </button>
          <button type="button" className="rounded-lg border border-[#c9c9c9] bg-white px-3 py-1.5">
            Compartir ▾
          </button>
          <button type="button" className="rounded-lg border border-[#c9c9c9] bg-white px-3 py-1.5">
            Más acciones ▾
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <CS_FieldCard title="Título">
            <input
              readOnly
              value={CS_PRODUCT_NAME}
              className="w-full rounded-lg border border-[#c9c9c9] px-3 py-2 text-[13px]"
            />
          </CS_FieldCard>

          <CS_FieldCard title="Descripción">
            <div className="mb-2 flex flex-wrap gap-1 border-b border-[#f0f0f0] pb-2 text-[12px] text-[#616161]">
              <span className="rounded px-1">Párrafo ▾</span>
              <span className="rounded px-1 font-bold">B</span>
              <span className="rounded px-1 italic">I</span>
              <span className="rounded px-1 underline">U</span>
            </div>
            <textarea
              readOnly
              className="min-h-[160px] w-full resize-none rounded-lg border border-[#e3e3e3] p-3 text-[13px] text-[#616161]"
              value="Gorra Royal Crown · edición Royal Boss Nicaragua. Material premium, bordado exclusivo."
            />
          </CS_FieldCard>

          <CS_FieldCard title="Multimedia">
            <div className="flex flex-wrap gap-3">
              <div className="flex h-28 w-40 items-center justify-center rounded-lg bg-[#1a1a1a] text-4xl">
                🧢
              </div>
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="flex h-20 w-20 items-center justify-center rounded-lg bg-[#303030] text-2xl"
                >
                  🧢
                </div>
              ))}
              <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-dashed border-[#c9c9c9] text-[#616161]">
                +
              </div>
            </div>
          </CS_FieldCard>

          <CS_FieldCard
            title="Categoría"
            extra={
              <span className="text-[12px] text-[#616161]">8 metacampos</span>
            }
          >
            <select className="w-full rounded-lg border border-[#c9c9c9] px-3 py-2 text-[13px]">
              <option>Complementos en Ropa y accesorios</option>
            </select>
            <div className="mt-2 inline-flex items-center gap-2 rounded-lg bg-[#f4f0ff] px-2 py-1 text-[12px] text-[#5c3dbb]">
              Gorras de béisbol en Sombreros
              <span className="rounded bg-white px-1 text-[10px]">Sugerido</span>
            </div>
          </CS_FieldCard>

          <CS_FieldCard title="Precio">
            <div className="relative max-w-[200px]">
              <input
                readOnly
                value={CS_PRODUCT_PRICE_USD.toFixed(2).replace(".", ",")}
                className="w-full rounded-lg border border-[#c9c9c9] px-3 py-2 pr-8 text-[13px] tabular-nums"
              />
              <span className="absolute right-3 top-2 text-[#616161]">$</span>
            </div>
          </CS_FieldCard>
        </div>

        <div className="space-y-4">
          <CS_FieldCard title="Estado">
            <select className="w-full rounded-lg border border-[#c9c9c9] px-3 py-2 text-[13px]">
              <option>Activo</option>
            </select>
          </CS_FieldCard>

          <CS_FieldCard title="Publicación">
            <ul className="space-y-2 text-[13px] text-[#616161]">
              <li>Todos los canales</li>
              <li>Todos los catálogos</li>
              <li>Shopify Catalog</li>
            </ul>
          </CS_FieldCard>

          <CS_FieldCard title="Ventas">
            {stats.royalCrownUnitsSold <= 0 ? (
              <p className="text-[13px] text-[#616161]">
                No hay ventas recientes de este producto
              </p>
            ) : (
              <div className="space-y-2 text-[13px]">
                <p className="font-medium text-[#303030]">
                  {CS_formatNumber(stats.royalCrownUnitsSold)} unidades ·{" "}
                  {CS_formatMoney(revenue)}
                </p>
                <p className="text-[#616161]">
                  {CS_formatNumber(crownViews)} visitas al producto hoy
                </p>
                <p className="text-[#008060]">
                  +{CS_formatNumber(stats.orders)} pedidos en la tienda
                </p>
              </div>
            )}
            <button type="button" className="mt-2 text-[13px] text-[#2c6ecb]">
              Ver detalles
            </button>
          </CS_FieldCard>

          <CS_FieldCard title="Organización del producto">
            <div className="space-y-3 text-[13px]">
              <label className="block">
                <span className="mb-1 block text-[#616161]">Tipo</span>
                <select className="w-full rounded-lg border border-[#c9c9c9] px-3 py-2">
                  <option>Ninguna</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-[#616161]">Proveedor</span>
                <select className="w-full rounded-lg border border-[#c9c9c9] px-3 py-2">
                  <option>{CS_STORE_NAME}</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-[#616161]">Colecciones</span>
                <div className="flex flex-wrap gap-1 rounded-lg border border-[#c9c9c9] px-2 py-1.5">
                  <span className="rounded bg-[#f0f0f0] px-2 py-0.5 text-[12px]">
                    {CS_STORE_NAME}
                  </span>
                </div>
              </label>
            </div>
          </CS_FieldCard>
        </div>
      </div>
    </div>
  );
}
