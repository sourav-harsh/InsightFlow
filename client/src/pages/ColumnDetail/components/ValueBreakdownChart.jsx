import Chart, { baseTooltip } from "../../../utils/Chart";

export default function ValueBreakdownChart({ valid, missing, invalid, height = 260 }) {
  const option = {
    tooltip: { ...baseTooltip, trigger: "item", formatter: "{b}: {c} ({d}%)" },
    legend: { bottom: 0, icon: "circle", itemWidth: 8, itemHeight: 8, textStyle: { color: "#64748b", fontSize: 11 } },
    series: [
      {
        type: "pie",
        radius: ["58%", "80%"],
        center: ["50%", "44%"],
        itemStyle: { borderColor: "#fff", borderWidth: 3 },
        label: { show: false },
        data: [
          { name: "Valid", value: Math.max(valid, 0), itemStyle: { color: "#10b981" } },
          { name: "Missing", value: missing, itemStyle: { color: "#f59e0b" } },
          { name: "Invalid", value: invalid, itemStyle: { color: "#e11d48" } },
        ],
      },
    ],
  };

  return <Chart option={option} height={height} />;
}
