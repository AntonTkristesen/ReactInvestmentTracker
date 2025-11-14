/**
 * Shared calculation utilities to avoid duplication
 */

import { MONTHS_PER_YEAR, PERCENTAGE_DIVISOR } from '../constants/investment';

/**
 * Calculate summary metrics from investment results
 * @param {Object} data - Investment data
 * @param {Array} results - Calculated investment results
 * @returns {Object} Summary metrics
 */
export function calculateSummaryMetrics(data, results) {
  if (results.length === 0) {
    return {
      finalValue: 0,
      totalInvested: 0,
      profit: 0,
      roiPercentage: 0,
      totalContributions: 0,
      totalInterest: 0,
    };
  }

  const { initialInvestment, monthlyInvestment, duration } = data;
  const finalValue = results[results.length - 1].valueEndOfYear;
  const totalInvested = results[results.length - 1].totalInvested;
  const profit = finalValue - totalInvested;
  const roiPercentage = totalInvested > 0 
    ? ((profit / totalInvested) * PERCENTAGE_DIVISOR).toFixed(1) 
    : 0;
  const totalContributions = parseFloat(initialInvestment) + 
    (parseFloat(monthlyInvestment) * MONTHS_PER_YEAR * parseInt(duration));
  const totalInterest = results.reduce((sum, year) => sum + year.interest, 0);

  return {
    finalValue,
    totalInvested,
    profit,
    roiPercentage,
    totalContributions,
    totalInterest,
  };
}

