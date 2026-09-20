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
import {
  CS_createInitialStats,
  CS_tickStats,
  type CS_StatsState,
} from "@/lib/CS_simulation";

type CS_StatsContextValue = {
  stats: CS_StatsState;
  reset: () => void;
};

const CS_StatsContext = createContext<CS_StatsContextValue | null>(null);

function nextDelayMs(momentum: number): number {
  const base = 4200 - momentum * 1200;
  return base + Math.random() * 4500;
}

export function CS_StatsProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<CS_StatsState>(() => CS_createInitialStats());
  const momentumRef = useRef(stats.momentum);

  const reset = useCallback(() => {
    const initial = CS_createInitialStats();
    momentumRef.current = initial.momentum;
    setStats(initial);
  }, []);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const schedule = () => {
      timeoutId = setTimeout(() => {
        setStats((prev) => {
          const next = CS_tickStats(prev);
          momentumRef.current = next.momentum;
          return next;
        });
        schedule();
      }, nextDelayMs(momentumRef.current));
    };

    schedule();
    return () => clearTimeout(timeoutId);
  }, []);

  const value = useMemo(() => ({ stats, reset }), [stats, reset]);

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
