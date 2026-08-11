import Chart, { baseTooltip } from "../../../utils/Chart";
import { TONE_CLASSES, qualityTone } from "../../../utils/format";

export default function QualityGauge({ score = 0, height = 260 }) {
  const color = TONE_CLASSES[qualityTone(score)].hex;

  const option = {
    tooltip: { ...baseTooltip, formatter: () => `Quality score: ${score.toFixed(2)}%` },
    series: [
      {
        type: "gauge",
        startAngle: 210,
        endAngle: -30,
        min: 0,
        max: 100,
        radius: "94%",
        progress: { show: true, width: 16, roundCap: true, itemStyle: { color } },
        axisLine: { lineStyle: { width: 16, color: [[1, "#eef2f7"]] } },
        pointer: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { color: "#94a3b8", fontSize: 10, distance: -6 },
        anchor: { show: false },
        title: { show: true, offsetCenter: [0, "36%"], color: "#64748b", fontSize: 12 },
        detail: {
          valueAnimation: true,
          offsetCenter: [0, "4%"],
          fontSize: 34,
          fontWeight: 700,
          color: "#0b1220",
          formatter: (value) => `${value.toFixed(2)}%`,
        },
        data: [{ value: score, name: "Overall quality" }],
      },
    ],
  };

  return <Chart option={option} height={height} />;
}
