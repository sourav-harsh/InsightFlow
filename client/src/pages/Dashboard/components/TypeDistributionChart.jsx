import Chart, { baseTooltip } from "../../../utils/Chart";
import { TYPE_COLORS } from "../../../utils/format";

export default function TypeDistributionChart({ distribution = {}, height = 280 }) {
  const data = Object.entries(distribution).map(([name, value]) => ({
    name,
    value,
    itemStyle: { color: TYPE_COLORS[name] || "#94a3b8" },
  }));

  const option = {
    tooltip: { ...baseTooltip, trigger: "item", formatter: "{b}: {c} column(s) ({d}%)" },
    legend: { bottom: 0, icon: "circle", itemWidth: 8, itemHeight: 8, textStyle: { color: "#64748b", fontSize: 11 } },
    series: [
      {
        type: "pie",
        radius: ["55%", "78%"],
        center: ["50%", "44%"],
        avoidLabelOverlap: true,
        itemStyle: { borderColor: "#fff", borderWidth: 3 },
        label: { show: false },
        data,
      },
    ],
  };

  return <Chart option={option} height={height} />;
}
