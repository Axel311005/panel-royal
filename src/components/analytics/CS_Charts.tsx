"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CS_HourPoint } from "@/lib/CS_simulation";

const CS_BLUE = "#2c6ecb";
const CS_BLUE_LIGHT = "#a4cafe";

export function CS_ComparisonLineChart({
  data,
  height = 220,
  valuePrefix = "",
  maxHint,
}: {
  data: CS_HourPoint[];
  height?: number;
  valuePrefix?: string;
  maxHint?: number;
}) {
  const maxVal = Math.max(
    maxHint ?? 0,
    ...data.map((d) => Math.max(d.today, d.yesterday)),
    10
  );

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#ebebeb" vertical={false} />
          <XAxis
            dataKey="hour"
            tick={{ fontSize: 11, fill: "#616161" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#616161" }}
            axisLine={false}
            tickLine={false}
            domain={[0, maxVal]}
            tickFormatter={(v) => `${valuePrefix}${v}`}
          />
          <Tooltip
            contentStyle={{
              fontSize: 12,
              borderRadius: 8,
              border: "1px solid #e3e3e3",
            }}
            formatter={(value) => [`${valuePrefix}${value ?? 0}`, ""]}
          />
          <Area
            type="monotone"
            dataKey="yesterday"
            stroke={CS_BLUE_LIGHT}
            fill="transparent"
            strokeDasharray="4 4"
            strokeWidth={2}
            dot={false}
            isAnimationActive
          />
          <Area
            type="monotone"
            dataKey="today"
            stroke={CS_BLUE}
            fill="rgba(44, 110, 203, 0.08)"
            strokeWidth={2}
            dot={false}
            isAnimationActive
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CS_DeviceDonut({
  desktop,
  mobile,
  total,
}: {
  desktop: number;
  mobile: number;
  total: number;
}) {
  const data = [
    { name: "Escritorio", value: desktop, color: "#8ccbf9" },
    { name: "Móvil", value: mobile, color: "#9c6ade" },
  ];

  return (
    <div className="relative h-[180px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={55}
            outerRadius={78}
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold tabular-nums">{total}</span>
      </div>
    </div>
  );
}
