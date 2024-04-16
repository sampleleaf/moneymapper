import { Chart } from "react-google-charts";
import { useOutletContext } from "react-router-dom";
import pay from "@/css/Pay.module.css";

export const data = [
  ["Major", "Degrees"],
  ["Work", 5],
  ["Eat", 2],
  ["Commute", 2],
  ["Watch TV", 8],
  ["Sleep", 7],
];

export const options = {
  pieHole: 0.5,
  is3D: false,
  legend: "none",
};

type ContextType = { years: number };

const Pay = () => {

  const {years} = useOutletContext<ContextType>()

  return (
    <>
      <div className={pay.googleChart}>
        <Chart
          chartType="PieChart"
          width="100%"
          height="400px"
          data={data}
          options={options}
        />
      </div>
      <div>{years}</div>
    </>
  );
};

export default Pay;
