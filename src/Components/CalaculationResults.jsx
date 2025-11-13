import React from 'react';
import { calculateInvestmentResults, createFormatter } from '../util/investment';
import { exportToPDF, exportToCSV } from '../util/export';

export default function CalaculationResults ({data, currency = 'DKK', onReturnChange, onFieldChange, showDetails, onToggleDetails}) {
  const { initialInvestment, monthlyInvestment, expectedReturn, duration, targetAmount } = data;
  const formatter = createFormatter(currency);
  
  // Only calculate results if all required fields are filled and valid
  const results = 
    initialInvestment && 
    monthlyInvestment && 
    expectedReturn && 
    duration &&
    !isNaN(initialInvestment) &&
    !isNaN(monthlyInvestment) &&
    !isNaN(expectedReturn) &&
    !isNaN(duration) &&
    duration > 0
      ? calculateInvestmentResults({
          initialInvestment: parseFloat(initialInvestment),
          monthlyInvestment: parseFloat(monthlyInvestment),
          expectedReturn: parseFloat(expectedReturn),
          duration: parseInt(duration),
        })
      : [];

  const finalValue = results.length > 0 ? results[results.length - 1].valueEndOfYear : 0;
  const totalInvested = results.length > 0 ? results[results.length - 1].totalInvested : 0;
  const profit = finalValue - totalInvested;
  const roiPercentage = totalInvested > 0 ? ((profit / totalInvested) * 100).toFixed(1) : 0;
  
  // Calculate total contributions and total interest
  const totalContributions = results.length > 0 
    ? parseFloat(initialInvestment) + (parseFloat(monthlyInvestment) * 12 * parseInt(duration))
    : 0;
  const totalInterest = results.reduce((sum, year) => sum + year.interest, 0);
  
  // Calculate additional metrics
  const avgMonthlyGrowth = results.length > 0 
    ? (finalValue - parseFloat(initialInvestment)) / (parseInt(duration) * 12)
    : 0;
  const contributionPercentage = finalValue > 0 
    ? ((totalContributions / finalValue) * 100).toFixed(1)
    : 0;
  const interestPercentage = finalValue > 0
    ? ((totalInterest / finalValue) * 100).toFixed(1)
    : 0;
  const avgAnnualGrowth = results.length > 0 && parseInt(duration) > 0
    ? ((finalValue / parseFloat(initialInvestment)) ** (1 / parseInt(duration)) - 1) * 100
    : 0;
  
  // Goal tracking
  const targetReached = targetAmount && finalValue >= parseFloat(targetAmount);
  const goalProgress = targetAmount && parseFloat(targetAmount) > 0
    ? Math.min((finalValue / parseFloat(targetAmount)) * 100, 100)
    : null;
  const yearsToGoal = targetAmount && !targetReached && results.length > 0 && parseFloat(targetAmount) > finalValue
    ? (() => {
        let currentValue = finalValue;
        const monthlyRate = parseFloat(expectedReturn) / 100 / 12;
        const target = parseFloat(targetAmount);
        const monthlyContrib = parseFloat(monthlyInvestment);
        let months = 0;
        while (currentValue < target && months < 1000) {
          currentValue += currentValue * monthlyRate;
          currentValue += monthlyContrib;
          months++;
        }
        return months > 0 ? (months / 12).toFixed(1) : null;
      })()
    : null;
  
  // Prepare data for chart
  const chartData = results.length > 0 
    ? results.map((yearData, index) => ({
        year: new Date().getFullYear() + index,
        value: yearData.valueEndOfYear
      }))
    : [];

  // Calculate chart dimensions
  const maxValue = chartData.length > 0 ? Math.max(...chartData.map(d => d.value)) : 1;
  const minValue = chartData.length > 0 ? Math.min(...chartData.map(d => d.value)) : 0;
  const valueRange = maxValue - minValue || 1; // Prevent division by zero
  const chartHeight = 200;
  const chartWidth = 400;
  const padding = 40;

  return (  
    <div id="results-section">
      <div className="results-summary">
        <div className="result-item">
          <label>Estimeret formue</label>
          <div className="result-value">{formatter.format(finalValue)}</div>
        </div>
        <div className="result-item">
          <label>Din fortjeneste</label>
          <div className="result-value profit">{formatter.format(profit)}</div>
          <div className="result-subtext">ROI: {roiPercentage}%</div>
        </div>
        {targetAmount && (
          <div className="result-item goal-item">
            <label>Målbeløb</label>
            <div className={`result-value ${targetReached ? 'goal-reached' : 'goal-not-reached'}`}>
              {formatter.format(parseFloat(targetAmount))}
            </div>
            {targetReached ? (
              <div className="result-subtext success">✓ Målet er nået!</div>
            ) : yearsToGoal ? (
              <div className="result-subtext">Estimeret tid til mål: {yearsToGoal} år</div>
            ) : null}
          </div>
        )}
        <div className="result-item">
          <label>Gns. afkast pr. år</label>
          <div className="result-value editable">
            <input
              type="number"
              value={expectedReturn || ""}
              onChange={(e) => onReturnChange(e.target.value)}
              className="return-input"
            />
            <span>%</span>
          </div>
        </div>
      </div>

      {results.length > 0 && (
        <>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-label">Samlede indbetalinger</div>
              <div className="metric-value">{formatter.format(totalContributions)}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Samlet rente</div>
              <div className="metric-value">{formatter.format(totalInterest)}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Gns. månedlig indbetaling</div>
              <div className="metric-value">{formatter.format(parseFloat(monthlyInvestment) || 0)}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">ROI</div>
              <div className="metric-value">{roiPercentage}%</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Gns. månedlig vækst</div>
              <div className="metric-value">{formatter.format(avgMonthlyGrowth)}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Gns. årlig vækst</div>
              <div className="metric-value">{avgAnnualGrowth.toFixed(1)}%</div>
            </div>
          </div>

          <div className="dashboard-grid">
            {targetAmount && goalProgress !== null && (
              <div className="dashboard-card goal-card">
                <div className="dashboard-card-header">
                  <h3>Fremgang mod mål</h3>
                  <span className="goal-progress-percentage">{goalProgress.toFixed(1)}%</span>
                </div>
                <div className="goal-progress-bar">
                  <div 
                    className="goal-progress-fill" 
                    style={{ width: `${goalProgress}%` }}
                  ></div>
                </div>
                <div className="goal-progress-info">
                  <div className="goal-info-item">
                    <span className="goal-info-label">Nuværende</span>
                    <span className="goal-info-value">{formatter.format(finalValue)}</span>
                  </div>
                  <div className="goal-info-item">
                    <span className="goal-info-label">Mål</span>
                    <span className="goal-info-value">{formatter.format(parseFloat(targetAmount))}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="dashboard-card breakdown-card">
              <div className="dashboard-card-header">
                <h3>Investeringsfordeling</h3>
              </div>
              <div className="breakdown-content">
                <div className="breakdown-chart">
                  <div className="breakdown-segment contribution-segment" 
                       style={{ 
                         width: `${contributionPercentage}%`,
                         backgroundColor: '#3b82f6'
                       }}>
                    <span className="breakdown-label">Indbetalinger</span>
                    <span className="breakdown-percentage">{contributionPercentage}%</span>
                  </div>
                  <div className="breakdown-segment interest-segment"
                       style={{ 
                         width: `${interestPercentage}%`,
                         backgroundColor: '#22c55e'
                       }}>
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

            <div className="dashboard-card growth-card">
              <div className="dashboard-card-header">
                <h3>Vækstanalyse</h3>
              </div>
              <div className="growth-metrics">
                <div className="growth-metric">
                  <div className="growth-metric-label">Gns. månedlig vækst</div>
                  <div className="growth-metric-value">{formatter.format(avgMonthlyGrowth)}</div>
                </div>
                <div className="growth-metric">
                  <div className="growth-metric-label">Gns. årlig vækst</div>
                  <div className="growth-metric-value">{avgAnnualGrowth.toFixed(1)}%</div>
                </div>
                <div className="growth-metric">
                  <div className="growth-metric-label">Total vækst</div>
                  <div className="growth-metric-value">{formatter.format(profit)}</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {results.length > 0 && (
        <>
          {chartData.length > 0 && (
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
          )}

          <div className="actions-container">
            <div className="details-toggle">
              <button onClick={onToggleDetails} className="toggle-button">
                {showDetails ? 'Skjul' : 'Vis'} detaljeret oversigt
              </button>
            </div>
            <div className="export-buttons">
              <button 
                onClick={() => exportToPDF(data, results, formatter)} 
                className="export-button export-pdf"
              >
                📄 Eksporter som PDF
              </button>
              <button 
                onClick={() => exportToCSV(data, results, formatter)} 
                className="export-button export-csv"
              >
                📊 Eksporter som CSV
              </button>
            </div>
          </div>
        </>
      )}

      {showDetails && results.length > 0 && (
        <div className="details-table-container">
          <table className="details-table">
            <thead>
              <tr>
                <th>År</th>
                <th>Start værdi</th>
                <th>Årlige Indbetalinge</th>
                <th>Rente optjent</th>
                <th>Slut værdi</th>
                <th>Samlet investeret</th>
              </tr>
            </thead>
            <tbody>
              {results.map((yearData, index) => {
                const startValue = index === 0 
                  ? parseFloat(initialInvestment)
                  : results[index - 1].valueEndOfYear;
                return (
                  <tr key={yearData.year}>
                    <td>{yearData.year}</td>
                    <td>{formatter.format(startValue)}</td>
                    <td>{formatter.format(yearData.monthlyInvestment)}</td>
                    <td>{formatter.format(yearData.interest)}</td>
                    <td>{formatter.format(yearData.valueEndOfYear)}</td>
                    <td>{formatter.format(yearData.totalInvested)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
