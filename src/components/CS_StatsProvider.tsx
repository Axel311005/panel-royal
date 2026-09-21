"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CS_isSimulationActive } from "@/lib/CS_constants";
import {
  CS_createInitialStats,
  CS_tickStats,
  type CS_StatsState,
} from "@/lib/CS_simulation";
import { CS_playNewOrderSound } from "@/lib/CS_orderSound";

type CS_StatsContextValue = {
  stats: CS_StatsState;
  reset: () => void;
  notificationCount: number;
  orderAlertTick: number;
  simulationActive: boolean;
};

const CS_StatsContext = createContext<CS_StatsContextValue | null>(null);

/** Intervalo fijo entre actualizaciones de métricas (2 min). */
const CS_TICK_INTERVAL_MS = 120_000;

function nextDelayMs(_momentum: number): number {
  return CS_TICK_INTERVAL_MS;
}

export function CS_StatsProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<CS_StatsState>(() => CS_createInitialStats());
  const momentumRef = useRef(stats.momentum);
  const prevOrdersRef = useRef(stats.orders);
  const [notificationCount, setNotificationCount] = useState(0);
  const [orderAlertTick, setOrderAlertTick] = useState(0);
  const [simulationActive, setSimulationActive] = useState(() =>
    CS_isSimulationActive()
  );

  const reset = useCallback(() => {
    const initial = CS_createInitialStats();
    momentumRef.current = initial.momentum;
    prevOrdersRef.current = initial.orders;
    setNotificationCount(0);
    setOrderAlertTick(0);
    setStats(initial);
  }, []);

  useEffect(() => {
    const prevOrders = prevOrdersRef.current;
    if (stats.orders > prevOrders) {
      const newOrders = stats.orders - prevOrders;
      setNotificationCount((n) => n + newOrders);
      setOrderAlertTick((t) => t + newOrders);
      for (let i = 0; i < newOrders; i++) {
        window.setTimeout(() => {
          void CS_playNewOrderSound();
        }, i * 900);
      }
    }
    prevOrdersRef.current = stats.orders;
  }, [stats.orders]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const schedule = () => {
      timeoutId = setTimeout(() => {
        const active = CS_isSimulationActive();
        setSimulationActive(active);

        if (active) {
          setStats((prev) => {
            const next = CS_tickStats(prev);
            momentumRef.current = next.momentum;
            return next;
          });
        }

        schedule();
      }, nextDelayMs(momentumRef.current));
    };

    schedule();
    return () => clearTimeout(timeoutId);
  }, []);

  const value = useMemo(
    () => ({
      stats,
      reset,
      notificationCount,
      orderAlertTick,
      simulationActive,
    }),
    [stats, reset, notificationCount, orderAlertTick, simulationActive]
  );

  return (
    <CS_StatsContext.Provider value={value}>{children}</CS_StatsContext.Provider>
  );
}

export function useCS_Stats(): CS_StatsContextValue {
  const ctx = useContext(CS_StatsContext);
  if (!ctx) {
    throw new Error("useCS_Stats debe usarse dentro de CS_StatsProvider");
  }
  return ctx;
}
