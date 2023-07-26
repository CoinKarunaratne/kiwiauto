"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { Sale } from "../dashboard/page";

type overviewProps = {
  sales: Sale[] | undefined;
  salesLoading: boolean;
  chart: string;
};

export function Overview({ sales, salesLoading, chart }: overviewProps) {
  const isMobile = window.innerWidth <= 768;
  const [chartHeight, setChartHeight] = useState(500);
  const [chartData, setChartData] = useState<{ name: string; total: number }[]>(
    []
  );

  useEffect(() => {
    const monthlySales = sales?.reduce(
      (result: { name: string; total: number }[], sale) => {
        const saleDate = sale.createdAt;
        const monthName = new Intl.DateTimeFormat("en-us", {
          month: "short",
        }).format(saleDate);
        const objectFinder = (obj: any, value: any) => {
          return obj[value];
        };
        const salePrice =
          chart === "count" ? 1 : Number(objectFinder(sale, chart));

        const existingMonth = result.find((item) => item.name === monthName);
        if (existingMonth) {
          existingMonth.total += salePrice;
        } else {
          result.push({ name: monthName, total: salePrice });
        }

        return result;
      },
      [
        {
          name: "Jan",
          total: 0,
        },
        {
          name: "Feb",
          total: 0,
        },
        {
          name: "Mar",
          total: 0,
        },
        {
          name: "Apr",
          total: 0,
        },
        {
          name: "May",
          total: 0,
        },
        {
          name: "Jun",
          total: 0,
        },
        {
          name: "Jul",
          total: 0,
        },
        {
          name: "Aug",
          total: 0,
        },
        {
          name: "Sep",
          total: 0,
        },
        {
          name: "Oct",
          total: 0,
        },
        {
          name: "Nov",
          total: 0,
        },
        {
          name: "Dec",
          total: 0,
        },
      ]
    );
    if (monthlySales) {
      setChartData(monthlySales);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sales, salesLoading]);

  useEffect(() => {
    function handleResize() {
      const windowHeight = window.innerHeight;
      const newChartHeight = windowHeight * 0.6;

      setChartHeight(newChartHeight);
    }

    handleResize(); // Set initial height

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      {isMobile ? (
        <LineChart data={chartData}>
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) =>
              chart === "count" ? `${parseInt(value)}` : `$${parseInt(value)}`
            }
          />
          <Line dataKey="total" stroke="#adfa1d" dot={false} />
        </LineChart>
      ) : (
        <BarChart data={chartData}>
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) =>
              chart === "count" ? `${parseInt(value)}` : `$${parseInt(value)}`
            }
          />
          <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
        </BarChart>
      )}
    </ResponsiveContainer>
  );
}
