import Chart, { baseTooltip } from "../../../utils/Chart";

export default function IssueRadar({ statistics = {}, height = 300 }) {
  const names = Object.keys(statistics);

  const option = {
    tooltip: baseTooltip,
    radar: {
      indicator: names.map((name) => ({ name, max: 100 })),
      radius: "66%",
      splitLine: { lineStyle: { color: "#e2e8f0" } },
      splitArea: { areaStyle: { color: ["#f8fafc", "#ffffff"] } },
      axisLine: { lineStyle: { color: "#e2e8f0" } },
      axisName: { color: "#64748b", fontSize: 11 },
    },
    series: [
      {
        type: "radar",
        symbolSize: 5,
        lineStyle: { color: "#2f83fb", width: 2 },
        itemStyle: { color: "#2f83fb" },
        areaStyle: { color: "rgba(47,131,251,0.18)" },
        data: [{ value: names.map((name) => Number(statistics[name].qualityScore.toFixed(2))), name: "Quality score" }],
      },
    ],
  };

  return <Chart option={option} height={height} />;
}
