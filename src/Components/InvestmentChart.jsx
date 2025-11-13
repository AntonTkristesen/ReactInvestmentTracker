export default function InvestmentChart({ chartData, formatter }) {
  if (chartData.length === 0) return null;

  const chartHeight = 200;
  const chartWidth = 400;
  const padding = 40;
  
  const maxValue = Math.max(...chartData.map(d => d.value));
  const minValue = Math.min(...chartData.map(d => d.value));
  const valueRange = maxValue - minValue || 1;

  return (
    <div className="chart-container">
      <svg width={chartWidth} height={chartHeight} className="chart">
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map((i) => {
          const y = padding + (i / 4) * (chartHeight - 2 * padding);
          return (
            <line
              key={i}
              x1={padding}
              y1={y}
              x2={chartWidth - padding}
              y2={y}
              stroke="#e9ecef"
              strokeWidth="1"
              strokeDasharray="4,4"
            />
          );
        })}
        
        {/* Bars */}
        {chartData.map((d, i) => {
          const x = padding + (chartData.length > 1 ? (i / (chartData.length - 1)) : 0) * (chartWidth - 2 * padding);
          const barWidth = (chartWidth - 2 * padding) / chartData.length * 0.6;
          const barHeight = ((d.value - minValue) / valueRange) * (chartHeight - 2 * padding);
          const barY = chartHeight - padding - barHeight;

          return (
            <g key={i}>
              <rect
                x={x - barWidth / 2}
                y={barY}
                width={barWidth}
                height={barHeight}
                fill="#667eea"
                rx="4"
                opacity="0.8"
              />
              <text
                x={x}
                y={barY - 5}
                textAnchor="middle"
                fontSize="10"
                fill="#495057"
                fontWeight="600"
              >
                {formatter.format(d.value)}
              </text>
            </g>
          );
        })}

        {/* X-axis labels */}
        {chartData.map((d, i) => {
          const x = padding + (chartData.length > 1 ? (i / (chartData.length - 1)) : 0) * (chartWidth - 2 * padding);
          return (
            <text
              key={i}
              x={x}
              y={chartHeight - padding + 20}
              textAnchor="middle"
              fontSize="12"
              fill="#666"
              fontWeight="500"
            >
              {d.year}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

