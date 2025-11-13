import { createFormatter } from '../util/investment';
import { useInvestmentCalculations } from '../hooks/useInvestmentCalculations';
import ResultsSummary from './ResultsSummary';
import MetricsGrid from './MetricsGrid';
import GoalProgressCard from './GoalProgressCard';
import BreakdownCard from './BreakdownCard';
import GrowthCard from './GrowthCard';
import InvestmentChart from './InvestmentChart';
import ActionsContainer from './ActionsContainer';
import DetailsTable from './DetailsTable';

export default function CalaculationResults ({
  data, 
  currency = 'DKK', 
  onReturnChange, 
  showDetails, 
  onToggleDetails
}) {
  const formatter = createFormatter(currency);
  const {
    results,
    finalValue,
    profit,
    roiPercentage,
    totalContributions,
    totalInterest,
    avgMonthlyGrowth,
    contributionPercentage,
    interestPercentage,
    avgAnnualGrowth,
    targetReached,
    goalProgress,
    yearsToGoal,
    chartData,
  } = useInvestmentCalculations(data);

  return (  
    <div id="results-section">
      <ResultsSummary
        finalValue={finalValue}
        profit={profit}
        roiPercentage={roiPercentage}
        targetAmount={data.targetAmount}
        targetReached={targetReached}
        yearsToGoal={yearsToGoal}
        expectedReturn={data.expectedReturn}
        onReturnChange={onReturnChange}
        formatter={formatter}
      />

      {results.length > 0 && (
        <>
          <MetricsGrid
            totalContributions={totalContributions}
            totalInterest={totalInterest}
            monthlyInvestment={data.monthlyInvestment}
            roiPercentage={roiPercentage}
            avgMonthlyGrowth={avgMonthlyGrowth}
            avgAnnualGrowth={avgAnnualGrowth}
            formatter={formatter}
          />

          <div className="dashboard-grid">
            <GoalProgressCard
              goalProgress={goalProgress}
              finalValue={finalValue}
              targetAmount={data.targetAmount}
              formatter={formatter}
            />

            <BreakdownCard
              contributionPercentage={contributionPercentage}
              interestPercentage={interestPercentage}
              totalContributions={totalContributions}
              totalInterest={totalInterest}
              formatter={formatter}
            />

            <GrowthCard
              avgMonthlyGrowth={avgMonthlyGrowth}
              avgAnnualGrowth={avgAnnualGrowth}
              profit={profit}
              formatter={formatter}
            />
          </div>
        </>
      )}

      {results.length > 0 && (
        <>
          <InvestmentChart
            chartData={chartData}
            formatter={formatter}
          />

          <ActionsContainer
            data={data}
            results={results}
            formatter={formatter}
            showDetails={showDetails}
            onToggleDetails={onToggleDetails}
          />
        </>
      )}

      {showDetails && results.length > 0 && (
        <DetailsTable
          results={results}
          initialInvestment={data.initialInvestment}
          formatter={formatter}
        />
      )}
    </div>
  );
}
