import ReactECharts from "echarts-for-react";

export default function Chart({ option, height = 300, className }) {
  return (
    <ReactECharts
      option={option}
      className={className}
      style={{ height, width: "100%" }}
      notMerge
      lazyUpdate
      opts={{ renderer: "canvas" }}
    />
  );
}

export const baseTooltip = {
  backgroundColor: "#0b1220",
  borderWidth: 0,
  textStyle: { color: "#e2e8f0", fontSize: 12 },
  padding: [8, 12],
};

export const baseGrid = { left: 8, right: 16, top: 24, bottom: 8, containLabel: true };

export const axisStyle = {
  axisLine: { lineStyle: { color: "#e2e8f0" } },
  axisTick: { show: false },
  axisLabel: { color: "#64748b", fontSize: 11 },
  splitLine: { lineStyle: { color: "#f1f5f9" } },
};
