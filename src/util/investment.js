// This function expects a JS object as an argument
// The object should contain the following properties
// - initialInvestment: The initial investment amount
// - monthlyInvestment: The amount invested every month
// - expectedReturn: The expected (annual) rate of return
// - duration: The investment duration (time frame in years)
export function calculateInvestmentResults({
  initialInvestment,
  monthlyInvestment,
  expectedReturn,
  duration,
}) {
  const annualData = [];
  let investmentValue = initialInvestment;
  const monthlyRate = expectedReturn / 100 / 12; // Monthly interest rate
  const totalMonths = duration * 12; // Total number of months

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
    if (month % 12 === 0) {
      const year = month / 12;
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

// The browser-provided Intl API is used to prepare a formatter object
// This object offers a "format()" method that can be used to format numbers as currency
// Example Usage: formatter.format(1000) => yields "$1,000"
export const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

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
