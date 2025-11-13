export default function GoalProgressCard({ 
  goalProgress, 
  finalValue, 
  targetAmount, 
  formatter 
}) {
  if (!goalProgress) return null;

  return (
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
  );
}

