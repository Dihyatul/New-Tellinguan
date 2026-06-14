import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const MonthlyGrowthChart = ({ data = [] }) => (
  <div className="w-full h-full">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 12 }} tickLine={false} />
        <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} tickLine={false} axisLine={false} />
        <Tooltip
          formatter={(value, name) => [value, name === "participants" ? "Participants" : "Subscribers"]}
          labelFormatter={(label) => `Bulan: ${label}`}
        />
        <Legend formatter={(v) => v === "participants" ? "Participants" : "Subscribers"} />
        <Line
          type="monotone" dataKey="participants" stroke="#ef4444" strokeWidth={3}
          dot={{ r: 5, fill: "#fff", stroke: "#ef4444", strokeWidth: 2 }}
          activeDot={{ r: 7 }} name="participants"
        />
        <Line
          type="monotone" dataKey="subscribers" stroke="#3b82f6" strokeWidth={3}
          dot={{ r: 5, fill: "#fff", stroke: "#3b82f6", strokeWidth: 2 }}
          activeDot={{ r: 7 }} name="subscribers"
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default MonthlyGrowthChart;
