export default function BreakdownCard({ 
  contributionPercentage, 
  interestPercentage, 
  totalContributions, 
  totalInterest, 
  formatter 
}) {
  return (
    <div className="dashboard-card breakdown-card">
      <div className="dashboard-card-header">
        <h3>Investeringsfordeling</h3>
      </div>
      <div className="breakdown-content">
        <div className="breakdown-chart">
          <div 
            className="breakdown-segment contribution-segment" 
            style={{ 
              width: `${contributionPercentage}%`,
              backgroundColor: '#3b82f6'
            }}
          >
            <span className="breakdown-label">Indbetalinger</span>
            <span className="breakdown-percentage">{contributionPercentage}%</span>
          </div>
          <div 
            className="breakdown-segment interest-segment"
            style={{ 
              width: `${interestPercentage}%`,
              backgroundColor: '#22c55e'
            }}
          >
            <span className="breakdown-label">Rente</span>
            <span className="breakdown-percentage">{interestPercentage}%</span>
          </div>
        </div>
        <div className="breakdown-legend">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#3b82f6' }}></div>
            <span>Indbetalinger: {formatter.format(totalContributions)}</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#22c55e' }}></div>
            <span>Rente: {formatter.format(totalInterest)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}


