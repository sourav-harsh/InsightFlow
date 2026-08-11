import Chart, { axisStyle, baseGrid, baseTooltip } from "../../../utils/Chart";
import { TONE_CLASSES, qualityTone } from "../../../utils/format";

export default function ColumnQualityChart({ statistics = {}, height = 300 }) {
  const entries = Object.entries(statistics).sort((a, b) => b[1].qualityScore - a[1].qualityScore);

  const option = {
    tooltip: { ...baseTooltip, trigger: "axis", axisPointer: { type: "shadow" } },
    grid: baseGrid,
    xAxis: { type: "value", max: 100, ...axisStyle, axisLabel: { ...axisStyle.axisLabel, formatter: "{value}%" } },
    yAxis: { type: "category", data: entries.map(([name]) => name).reverse(), ...axisStyle, splitLine: { show: false } },
    series: [
      {
        name: "Quality score",
        type: "bar",
        barWidth: 14,
        itemStyle: { borderRadius: [0, 7, 7, 0] },
        data: entries
          .map(([, stat]) => ({
            value: Number(stat.qualityScore.toFixed(2)),
            itemStyle: { color: TONE_CLASSES[qualityTone(stat.qualityScore)].hex },
          }))
          .reverse(),
      },
    ],
  };

  return <Chart option={option} height={height} />;
}
