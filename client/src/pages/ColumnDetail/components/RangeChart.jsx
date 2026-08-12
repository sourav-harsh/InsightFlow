import Chart, { axisStyle, baseGrid, baseTooltip } from "../../../utils/Chart";

export default function RangeChart({ min, max, average, height = 240 }) {
  const option = {
    tooltip: { ...baseTooltip, trigger: "axis", axisPointer: { type: "shadow" } },
    grid: baseGrid,
    xAxis: { type: "category", data: ["Minimum", "Average", "Maximum"], ...axisStyle, splitLine: { show: false } },
    yAxis: { type: "value", ...axisStyle },
    series: [
      {
        type: "bar",
        barWidth: 46,
        itemStyle: { borderRadius: [8, 8, 0, 0] },
        data: [
          { value: min, itemStyle: { color: "#8ec6ff" } },
          { value: Number(average?.toFixed(2)), itemStyle: { color: "#2f83fb" } },
          { value: max, itemStyle: { color: "#124fdb" } },
        ],
      },
    ],
  };

  return <Chart option={option} height={height} />;
}
