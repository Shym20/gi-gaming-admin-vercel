import React from "react";
import type { RevenueData } from "../../types";

interface RevenueChartProps {
  data: RevenueData[];
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
 const maxValue = Math.max(...data.map((d) => d.amount), 1);

  return (
    <div className="brutal-card p-6  border-4  border-black bg-white shadow-[6px_6px_0_black]">
      
      <h3 className="font-bold uppercase text-lg border-b-2 border-black pb-2 mb-6">
        Revenue (Last 7 Days)
      </h3>

      {/* Chart Area */}
      <div className="flex items-end justify-between gap-4 h-56 border-black pb-2">
        {data.map((item) => {
          const height = (item.amount / maxValue) * 100;

          return (
            <div
              key={item.day}
              className="flex flex-col items-center flex-1"
            >
              {/* Bar */}
              <div
                style={{ height: `${height}%` }}
                className="w-full bg-black border-2 border-black"
              />

              {/* Day */}
              <span className="font-mono text-xs font-bold mt-2">
                {item.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RevenueChart;