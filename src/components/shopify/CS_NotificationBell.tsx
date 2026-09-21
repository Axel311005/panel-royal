"use client";

import { useEffect, useState } from "react";
import { useCS_Stats } from "@/components/CS_StatsProvider";

export function CS_NotificationBell() {
  const { notificationCount, orderAlertTick } = useCS_Stats();
  const [ringing, setRinging] = useState(false);

  useEffect(() => {
    if (orderAlertTick <= 0) return;
    setRinging(true);
    const id = window.setTimeout(() => setRinging(false), 1300);
    return () => window.clearTimeout(id);
  }, [orderAlertTick]);

  return (
    <button
      type="button"
      className={`relative flex h-9 w-9 items-center justify-center rounded-lg hover:bg-white/10 ${
        ringing ? "cs-bell-alarm-glow" : ""
      }`}
      aria-label={`Notificaciones${notificationCount > 0 ? `: ${notificationCount}` : ""}`}
    >
      <span
        className={`inline-block text-xl leading-none ${
          ringing ? "cs-bell-ring-alarm" : ""
        }`}
      >
        🔔
      </span>
      {notificationCount > 0 ? (
        <span
          key={orderAlertTick}
          className={`absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ff0000] px-1 text-[11px] font-bold tabular-nums text-white shadow-[0_0_10px_rgba(255,0,0,0.9)] ${
            ringing ? "cs-badge-alarm" : "cs-badge-pop"
          }`}
        >
          {notificationCount}
        </span>
      ) : null}
    </button>
  );
}
