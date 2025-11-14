import { useMemo } from 'react';
import { calculateInvestmentResults } from '../util/investment';
import { MONTHS_PER_YEAR } from '../constants/investment';

export function useInvestmentCalculations(data) {
  const { initialInvestment, monthlyInvestment, expectedReturn, duration, targetAmount } = data;

  const results = useMemo(() => {
    if (
      !initialInvestment || 
      !monthlyInvestment || 
      !expectedReturn || 
      !duration ||
      isNaN(initialInvestment) ||
      isNaN(monthlyInvestment) ||
      isNaN(expectedReturn) ||
      isNaN(duration) ||
      duration <= 0
    ) {
      return [];
    }

    return calculateInvestmentResults({
      initialInvestment: parseFloat(initialInvestment),
      monthlyInvestment: parseFloat(monthlyInvestment),
      expectedReturn: parseFloat(expectedReturn),
      duration: parseInt(duration),
    });
  }, [initialInvestment, monthlyInvestment, expectedReturn, duration]);

  const calculations = useMemo(() => {
    if (results.length === 0) {
      return {
        finalValue: 0,
        totalInvested: 0,
        profit: 0,
        roiPercentage: 0,
        totalContributions: 0,
        totalInterest: 0,
        avgMonthlyGrowth: 0,
        contributionPercentage: 0,
        interestPercentage: 0,
        avgAnnualGrowth: 0,
        targetReached: false,
        goalProgress: null,
        yearsToGoal: null,
        chartData: [],
      };
    }

    const finalValue = results[results.length - 1].valueEndOfYear;
    const totalInvested = results[results.length - 1].totalInvested;
    const profit = finalValue - totalInvested;
    const roiPercentage = totalInvested > 0 ? ((profit / totalInvested) * 100).toFixed(1) : 0;
    
    const totalContributions = parseFloat(initialInvestment) + (parseFloat(monthlyInvestment) * MONTHS_PER_YEAR * parseInt(duration));
    const totalInterest = results.reduce((sum, year) => sum + year.interest, 0);
    
    const avgMonthlyGrowth = (finalValue - parseFloat(initialInvestment)) / (parseInt(duration) * MONTHS_PER_YEAR);
    const contributionPercentage = finalValue > 0 ? ((totalContributions / finalValue) * 100).toFixed(1) : 0;
    const interestPercentage = finalValue > 0 ? ((totalInterest / finalValue) * 100).toFixed(1) : 0;
    const avgAnnualGrowth = parseInt(duration) > 0
      ? ((finalValue / parseFloat(initialInvestment)) ** (1 / parseInt(duration)) - 1) * 100
      : 0;
    
    const targetReached = targetAmount && finalValue >= parseFloat(targetAmount);
    const goalProgress = targetAmount && parseFloat(targetAmount) > 0
      ? Math.min((finalValue / parseFloat(targetAmount)) * 100, 100)
      : null;
    
    const yearsToGoal = targetAmount && !targetReached && parseFloat(targetAmount) > finalValue
      ? (() => {
          let currentValue = finalValue;
          const monthlyRate = parseFloat(expectedReturn) / 100 / MONTHS_PER_YEAR;
          const target = parseFloat(targetAmount);
          const monthlyContrib = parseFloat(monthlyInvestment);
          let months = 0;
          const MAX_MONTHS = 1000;
          while (currentValue < target && months < MAX_MONTHS) {
            currentValue += currentValue * monthlyRate;
            currentValue += monthlyContrib;
            months++;
          }
          return months > 0 ? (months / MONTHS_PER_YEAR).toFixed(1) : null;
        })()
      : null;
    
    const chartData = results.map((yearData, index) => ({
      year: new Date().getFullYear() + index,
      value: yearData.valueEndOfYear
    }));

    return {
      finalValue,
      totalInvested,
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
    };
  }, [results, initialInvestment, monthlyInvestment, expectedReturn, duration, targetAmount]);

  return {
    results,
    ...calculations,
  };
}


