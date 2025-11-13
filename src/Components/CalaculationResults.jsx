import React from 'react';
import { calculateInvestmentResults, createFormatter } from '../util/investment';

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
  
  // Goal tracking
  const targetReached = targetAmount && finalValue >= parseFloat(targetAmount);
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
        </div>
      )}

      {results.length > 0 && (
        <div className="details-toggle">
          <button onClick={onToggleDetails} className="toggle-button">
            {showDetails ? 'Skjul' : 'Vis'} detaljeret oversigt
          </button>
        </div>
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
      
      {chartData.length > 0 && (
        <div className="chart-container">
          <svg width={chartWidth} height={chartHeight} className="chart">
            <defs>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
                <stop offset="100%" stopColor="rgba(59, 130, 246, 0.05)" />
              </linearGradient>
            </defs>
            
            {/* Area under line */}
            <path
              d={`M ${padding},${chartHeight - padding} ${chartData.map((d, i) => {
                const x = padding + (chartData.length > 1 ? (i / (chartData.length - 1)) : 0) * (chartWidth - 2 * padding);
                const y = chartHeight - padding - ((d.value - minValue) / valueRange) * (chartHeight - 2 * padding);
                return `L ${x},${y}`;
              }).join(' ')} L ${chartWidth - padding},${chartHeight - padding} Z`}
              fill="url(#areaGradient)"
            />
            
            {/* Line */}
            <polyline
              points={chartData.map((d, i) => {
                const x = padding + (chartData.length > 1 ? (i / (chartData.length - 1)) : 0) * (chartWidth - 2 * padding);
                const y = chartHeight - padding - ((d.value - minValue) / valueRange) * (chartHeight - 2 * padding);
                return `${x},${y}`;
              }).join(' ')}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
            />
            
            {/* Points */}
            {chartData.map((d, i) => {
              const x = padding + (chartData.length > 1 ? (i / (chartData.length - 1)) : 0) * (chartWidth - 2 * padding);
              const y = chartHeight - padding - ((d.value - minValue) / valueRange) * (chartHeight - 2 * padding);
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#3b82f6"
                  stroke="white"
                  strokeWidth="2"
                />
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
                >
                  {d.year}
                </text>
              );
            })}
          </svg>
        </div>
      )}
    </div>
  )}
