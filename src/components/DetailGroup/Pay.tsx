import React from "react";
import { Chart } from "react-google-charts";

export const data = [
  ["Task", "Hours per Day"],
  ["Work", 5],
  ["Eat", 2],
  ["Commute", 2],
  ["Watch TV", 8],
  ["Sleep", 7], 
];

export const options = {
  pieHole: 0.4,
  is3D: false,
  legend: 'none',
};

const Pay = () => {
  return (
    <div className="hahaha">
      <Chart
        chartType="PieChart"
        width="100%"
        height="400px"
        data={data}
        options={options}
      />
    </div>
  );
};

export default Pay;
