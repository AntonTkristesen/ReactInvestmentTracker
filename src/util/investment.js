import { MONTHS_PER_YEAR, PERCENTAGE_DIVISOR } from '../constants/investment';

/**
 * Calculate investment results with compound interest
 * @param {Object} params - Investment parameters
 * @param {number} params.initialInvestment - Initial investment amount
 * @param {number} params.monthlyInvestment - Monthly investment amount
 * @param {number} params.expectedReturn - Expected annual return percentage
 * @param {number} params.duration - Investment duration in years
 * @returns {Array} Annual investment data
 */
export function calculateInvestmentResults({
  initialInvestment,
  monthlyInvestment,
  expectedReturn,
  duration,
}) {
  const annualData = [];
  let investmentValue = initialInvestment;
  const monthlyRate = expectedReturn / PERCENTAGE_DIVISOR / MONTHS_PER_YEAR;
  const totalMonths = duration * MONTHS_PER_YEAR;

  let totalInterestEarnedInYear = 0;
  let totalMonthlyInvestmentsInYear = 0;
  let cumulativeInvested = initialInvestment; // Track total amount invested (initial + all monthly contributions)

  for (let month = 1; month <= totalMonths; month++) {
    // Apply compound interest on the current balance
    const monthlyInterest = investmentValue * monthlyRate;
    investmentValue += monthlyInterest;
    
    // Add monthly contribution after interest is applied
    investmentValue += monthlyInvestment;
    cumulativeInvested += monthlyInvestment;
    
    // Track yearly totals
    totalInterestEarnedInYear += monthlyInterest;
    totalMonthlyInvestmentsInYear += monthlyInvestment;

    // At the end of each year, record the data
    if (month % MONTHS_PER_YEAR === 0) {
      const year = month / MONTHS_PER_YEAR;
      annualData.push({
        year: year, // year identifier
        interest: totalInterestEarnedInYear, // the amount of interest earned in this year
        valueEndOfYear: investmentValue, // investment value at end of year
        monthlyInvestment: totalMonthlyInvestmentsInYear, // total monthly investments added in this year
        totalInvested: cumulativeInvested, // cumulative total amount invested (initial + all monthly contributions)
      });
      
      // Reset yearly counters for next year
      totalInterestEarnedInYear = 0;
      totalMonthlyInvestmentsInYear = 0;
    }
  }

  return annualData;
}

// Create a formatter function that accepts a currency code
export function createFormatter(currency = 'USD') {
  // Map currency codes to locale strings for proper formatting
  const localeMap = {
    'USD': 'en-US',
    'EUR': 'de-DE',
    'GBP': 'en-GB',
    'JPY': 'ja-JP',
    'DKK': 'da-DK',
    'NOK': 'nb-NO',
    'SEK': 'sv-SE',
  };
  
  const locale = localeMap[currency] || 'en-US';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}
