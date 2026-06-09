import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Basic", value: 120 },
  { name: "Intermediate", value: 80 },
  { name: "Proficient", value: 250 },
  { name: "Advanced", value: 60 },
];

const COLORS = ["#7B6EF6", "#F58C85", "#42B8D5", "#F4A742"];

const ParticipantLevelChart = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      
      {/* Chart */}
      <div className="w-full h-65">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={60}
              outerRadius={110}
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-2 flex flex-col gap-3">
        {data.map((item, index) => (
          <div
            key={item.name}
            className="flex items-center gap-3 text-sm text-gray-600"
          >
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: COLORS[index] }}
            />
            <span>
              {item.name} ({item.value})
            </span>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ParticipantLevelChart;