export default function GrowthCard({ 
  avgMonthlyGrowth, 
  avgAnnualGrowth, 
  profit, 
  formatter 
}) {
  const growthMetrics = [
    { label: 'Gns. månedlig vækst', value: formatter.format(avgMonthlyGrowth) },
    { label: 'Gns. årlig vækst', value: `${avgAnnualGrowth.toFixed(1)}%` },
    { label: 'Total vækst', value: formatter.format(profit) },
  ];

  return (
    <div className="dashboard-card growth-card">
      <div className="dashboard-card-header">
        <h3>Vækstanalyse</h3>
      </div>
      <div className="growth-metrics">
        {growthMetrics.map((metric, index) => (
          <div key={index} className="growth-metric">
            <div className="growth-metric-label">{metric.label}</div>
            <div className="growth-metric-value">{metric.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

