import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const monthlyData = [
  {
    month: "Jan",

    // nanti dari database
    // participants: data.totalParticipants,
    // subscribers: data.totalSubscribers,

    participants: 21,
    subscribers: 2,
  },

  {
    month: "Feb",
    participants: 27,
    subscribers: 8,
  },

  {
    month: "Mar",
    participants: 24,
    subscribers: 6,
  },

  {
    month: "Apr",
    participants: 29,
    subscribers: 7,
  },

  {
    month: "Mei",
    participants: 18,
    subscribers: 9,
  },

  {
    month: "Jun",
    participants: 31,
    subscribers: 4,
  },

  {
    month: "Jul",
    participants: 26,
    subscribers: 7,
  },

  {
    month: "Agu",
    participants: 24,
    subscribers: 11,
  },
];

const MonthlyGrowthChart = () => {
  return (
    <div className="w-full h-full">

      <ResponsiveContainer width="100%" height="100%">

        <LineChart
          data={monthlyData}
          margin={{
            top: 10,
            right: 20,
            left: -10,
            bottom: 10,
          }}
        >

          {/* GRID */}
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e7eb"
          />

          {/* X AXIS */}
          <XAxis
            dataKey="month"
            tick={{
              fill: "#6b7280",
              fontSize: 12,
            }}
            tickLine={false}
          />

          {/* Y AXIS */}
          <YAxis
            tick={{
              fill: "#6b7280",
              fontSize: 12,
            }}
            tickLine={false}
            axisLine={false}
          />

          {/* TOOLTIP */}
          <Tooltip />

          {/* LEGEND */}
          <Legend />

          {/* PARTICIPANTS */}
          <Line
            type="monotone"
            dataKey="participants"
            stroke="#ef4444"
            strokeWidth={3}
            dot={{
              r: 5,
              fill: "#fff",
              stroke: "#ef4444",
              strokeWidth: 2,
            }}
            activeDot={{
              r: 7,
            }}
            name="Participants"
          />

          {/* SUBSCRIBERS */}
          <Line
            type="monotone"
            dataKey="subscribers"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{
              r: 5,
              fill: "#fff",
              stroke: "#3b82f6",
              strokeWidth: 2,
            }}
            activeDot={{
              r: 7,
            }}
            name="Subscriber"
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
};

export default MonthlyGrowthChart;