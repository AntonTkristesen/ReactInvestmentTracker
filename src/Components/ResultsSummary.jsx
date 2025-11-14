export default function ResultsSummary({ 
  finalValue, 
  profit, 
  roiPercentage, 
  targetAmount, 
  targetReached, 
  yearsToGoal, 
  expectedReturn, 
  onReturnChange, 
  formatter 
}) {
  return (
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
            <div className="result-subtext success">Målet er nået!</div>
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
  );
}


