"use client";

import {
  Cell,
  Funnel,
  FunnelChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface SalesFunnelData {
  name: string;
  value: number;
  fill: string;
}

interface SalesFunnelChartProps {
  data: SalesFunnelData[];
}

export function SalesFunnelChart({ data }: SalesFunnelChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <FunnelChart>
        <Tooltip />
        <Funnel dataKey="value" data={data} isAnimationActive>
          <LabelList
            position="right"
            fill="#000"
            stroke="none"
            dataKey="name"
          />
          <LabelList
            position="right"
            fill="#000"
            stroke="none"
            dataKey="value"
          />
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Funnel>
      </FunnelChart>
    </ResponsiveContainer>
  );
}
