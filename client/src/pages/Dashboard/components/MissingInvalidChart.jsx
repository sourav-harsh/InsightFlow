import Chart, { axisStyle, baseGrid, baseTooltip } from "../../../utils/Chart";

export default function MissingInvalidChart({ statistics = {}, height = 300 }) {
  const names = Object.keys(statistics);

  const option = {
    tooltip: { ...baseTooltip, trigger: "axis", axisPointer: { type: "shadow" } },
    legend: { top: 0, right: 0, icon: "circle", itemWidth: 8, itemHeight: 8, textStyle: { color: "#64748b", fontSize: 11 } },
    grid: { ...baseGrid, top: 36 },
    xAxis: { type: "category", data: names, ...axisStyle, splitLine: { show: false } },
    yAxis: { type: "value", ...axisStyle },
    series: [
      {
        name: "Missing",
        type: "bar",
        stack: "issues",
        barWidth: 26,
        itemStyle: { color: "#f59e0b", borderRadius: [0, 0, 0, 0] },
        data: names.map((name) => statistics[name].missingCount),
      },
      {
        name: "Invalid",
        type: "bar",
        stack: "issues",
        barWidth: 26,
        itemStyle: { color: "#e11d48", borderRadius: [6, 6, 0, 0] },
        data: names.map((name) => statistics[name].invalidCount),
      },
    ],
  };

  return <Chart option={option} height={height} />;
}
