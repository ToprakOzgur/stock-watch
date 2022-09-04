import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import finnhub from "../api/finnhub";
import { StockChart } from "../components/StockChart";
import { StockData } from "../components/StockData";

const formatData = (data) => {
  return data.t.map((el, index) => {
    return {
      x: el * 1000,
      y: Math.floor(data.c[index]),
    };
  });
};

export const StockDetailPage = () => {
  const [chartData, setChartData] = useState();
  const { symbol } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const date = new Date();
      const currentTime = Math.floor(date.getTime() / 1000);
      let oneDayAgo;

      if (date.getDay() === 6) {
        oneDayAgo = currentTime - 2 * 24 * 60 * 60;
      } else if (date.getDay() === 0) {
        oneDayAgo = currentTime - 3 * 24 * 60 * 60;
      } else {
        oneDayAgo = currentTime - 24 * 60 * 60;
      }

      const oneWeekAgo = currentTime - 7 * 24 * 60 * 60;
      const oneYearAgo = currentTime - 365 * 24 * 60 * 60;

      try {
        const responses = await Promise.all([
          finnhub.get("/stock/candle", {
            params: {
              symbol,
              from: oneDayAgo,
              to: currentTime,
              resolution: 30,
            },
          }),
          finnhub.get("/stock/candle", {
            params: {
              symbol,
              from: oneWeekAgo,
              to: currentTime,
              resolution: "D",
            },
          }),
          finnhub.get("/stock/candle", {
            params: {
              symbol,
              from: oneYearAgo,
              to: currentTime,
              resolution: "W",
            },
          }),
        ]);
        console.log(responses);
        setChartData({
          day: formatData(responses[0].data),
          week: formatData(responses[1].data),
          year: formatData(responses[2].data),
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [symbol]);

  return (
    <div>
      {chartData && (
        <div>
          <StockChart chartData={chartData} symbol={symbol}></StockChart>
          <StockData symbol={symbol}></StockData>
        </div>
      )}
    </div>
  );
};
