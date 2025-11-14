export default function MetricsGrid({ 
  totalContributions, 
  totalInterest, 
  monthlyInvestment, 
  roiPercentage, 
  avgMonthlyGrowth, 
  avgAnnualGrowth, 
  formatter 
}) {
  const metrics = [
    { label: 'Samlede indbetalinger', value: formatter.format(totalContributions) },
    { label: 'Samlet rente', value: formatter.format(totalInterest) },
    { label: 'Gns. månedlig indbetaling', value: formatter.format(parseFloat(monthlyInvestment) || 0) },
    { label: 'ROI', value: `${roiPercentage}%` },
    { label: 'Gns. månedlig vækst', value: formatter.format(avgMonthlyGrowth) },
    { label: 'Gns. årlig vækst', value: `${avgAnnualGrowth.toFixed(1)}%` },
  ];

  return (
    <div className="metrics-grid">
      {metrics.map((metric, index) => (
        <div key={index} className="metric-card">
          <div className="metric-label">{metric.label}</div>
          <div className="metric-value">{metric.value}</div>
        </div>
      ))}
    </div>
  );
}


