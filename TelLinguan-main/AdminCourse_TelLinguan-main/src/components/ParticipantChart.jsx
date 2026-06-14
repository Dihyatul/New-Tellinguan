import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#7B6EF6", "#F58C85", "#42B8D5", "#F4A742"];

const ParticipantLevelChart = ({ data = [] }) => {
  const display = data.length ? data : [
    { name: "Basic", value: 0 },
    { name: "Intermediate", value: 0 },
    { name: "Proficient", value: 0 },
    { name: "Advanced", value: 0 },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-full h-65">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={display} dataKey="value"
              innerRadius={60} outerRadius={110} paddingAngle={2}
            >
              {display.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [`${value} peserta`, name]} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex flex-col gap-3">
        {display.map((item, index) => (
          <div key={item.name} className="flex items-center gap-3 text-sm text-gray-600">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
            <span>{item.name} ({item.value}){item.percentage !== undefined ? ` — ${item.percentage}%` : ""}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParticipantLevelChart;
