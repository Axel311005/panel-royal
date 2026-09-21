"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useCS_Stats } from "@/components/CS_StatsProvider";
import { CS_STORE_NAME } from "@/lib/CS_constants";
import { CS_unlockOrderAudio } from "@/lib/CS_orderSound";
import { CS_ChevronRight, CS_NavIcon } from "./CS_Icons";
import { CS_NotificationBell } from "./CS_NotificationBell";
import { CS_StoreLogo } from "./CS_StoreLogo";

type CS_NavChild = { label: string; href?: string };

type CS_NavItem = {
  label: string;
  icon: string;
  href: string;
  section?: "products" | "analytics";
  badgeOrders?: boolean;
  children?: CS_NavChild[];
};

const CS_NAV_MAIN: CS_NavItem[] = [
  { label: "Inicio", icon: "home", href: "#" },
  { label: "Pedidos", icon: "orders", href: "#", badgeOrders: true },
  {
    label: "Productos",
    icon: "products",
    href: "/productos/royal-crown",
    section: "products",
    children: [
      { label: "Colecciones" },
      { label: "Inventario" },
      { label: "Órdenes de compra" },
      { label: "Transferencias" },
      { label: "Tarjetas de regalo" },
    ],
  },
  { label: "Clientes", icon: "customers", href: "#" },
  { label: "Crecimiento", icon: "growth", href: "#" },
  { label: "Descuentos", icon: "discounts", href: "#" },
  { label: "Contenido", icon: "content", href: "#" },
  { label: "Mercados", icon: "markets", href: "#" },
  { label: "Finanzas", icon: "finances", href: "#" },
  {
    label: "Informes y estadísticas",
    icon: "analytics",
    href: "/informes",
    section: "analytics",
    children: [{ label: "Informes" }, { label: "Vista en tiempo real" }],
  },
];

function CS_NavRow({
  item,
  active,
  ordersBadge,
}: {
  item: CS_NavItem;
  active: boolean;
  ordersBadge: string;
}) {
  const content = (
    <>
      <CS_NavIcon name={item.icon} />
      <span className="flex-1 truncate leading-tight">{item.label}</span>
      {item.badgeOrders ? (
        <span className="min-w-[22px] rounded-md bg-[#e3e3e3] px-1.5 py-0.5 text-center text-[11px] font-medium tabular-nums text-[#303030]">
          {ordersBadge}
        </span>
      ) : null}
    </>
  );

  const className = `flex items-center gap-2 rounded-[10px] px-2 py-[6px] text-[13px] font-medium text-[#303030] ${
    active
      ? "bg-white shadow-[0_1px_0_rgba(0,0,0,0.05)]"
      : "hover:bg-[#e3e3e3]/70"
  }`;

  if (item.href === "#") {
    return (
      <div className={`${className} cursor-default`} aria-current={active ? "page" : undefined}>
        {content}
      </div>
    );
  }

  return (
    <Link href={item.href} className={className} aria-current={active ? "page" : undefined}>
      {content}
    </Link>
  );
}

function CS_SubNav({ children }: { children: CS_NavChild[] }) {
  return (
    <ul className="ml-[30px] mt-0.5 space-y-0.5 pb-1 pl-1">
      {children.map((child) => (
        <li key={child.label}>
          {child.href ? (
            <Link
              href={child.href}
              className="block rounded-md px-2 py-[5px] text-[13px] font-normal text-[#303030] hover:bg-[#e3e3e3]/60"
            >
              {child.label}
            </Link>
          ) : (
            <span className="block cursor-default px-2 py-[5px] text-[13px] font-normal text-[#303030]">
              {child.label}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

export function CS_ShopifyShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { stats } = useCS_Stats();
  const ordersBadge =
    stats.orders > 0 ? String(stats.orders) : "1";

  useEffect(() => {
    const unlock = () => {
      CS_unlockOrderAudio();
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-[#f1f1f1] text-[#303030]">
      <aside className="flex w-[240px] shrink-0 flex-col bg-[#ebebeb]">
        <div className="px-3 pb-2 pt-3">
          <CS_StoreLogo size={40} />
        </div>

        <nav className="flex-1 space-y-0.5 px-2 pb-3">
          {CS_NAV_MAIN.map((item) => {
            const activeProducts =
              item.section === "products" && pathname.startsWith("/productos");
            const activeAnalytics =
              item.section === "analytics" && pathname.startsWith("/informes");
            const active = activeProducts || activeAnalytics;

            return (
              <div key={item.label}>
                <CS_NavRow item={item} active={active} ordersBadge={ordersBadge} />
                {active && item.children ? <CS_SubNav children={item.children} /> : null}
              </div>
            );
          })}
        </nav>

        <div className="space-y-2 px-2 pb-4 pt-2">
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-md px-2 py-1 text-[13px] font-semibold text-[#303030]"
          >
            Canales de ventas
            <CS_ChevronRight />
          </button>
          <div className="flex items-center gap-2 rounded-[10px] px-2 py-[6px] text-[13px] font-medium hover:bg-[#e3e3e3]/70">
            <CS_NavIcon name="online-store" />
            Tienda online
          </div>
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-md px-2 py-1 text-[13px] font-semibold text-[#303030]"
          >
            Apps
            <CS_ChevronRight />
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-4 border-b border-[#e3e3e3] bg-[#1a1a1a] px-4 text-white">
          <div className="flex flex-1 justify-center">
            <div className="flex w-full max-w-xl items-center rounded-lg bg-[#303030] px-3 py-2 text-sm text-[#b5b5b5]">
              <span className="flex-1">Buscar</span>
              <kbd className="rounded border border-[#4a4a4a] px-1.5 text-[10px]">
                CTRL K
              </kbd>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <CS_NotificationBell />
            <div className="flex max-w-[220px] items-center gap-2 rounded-lg bg-[#303030] py-1 pl-1 pr-2 text-xs font-medium text-white ring-1 ring-white/10">
              <CS_StoreLogo size={26} className="shrink-0 rounded-[6px]" />
              <span className="min-w-0 flex-1 truncate">{CS_STORE_NAME}</span>
              <button
                type="button"
                className="shrink-0 rounded p-0.5 text-[14px] leading-none text-white/60 hover:text-white"
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
