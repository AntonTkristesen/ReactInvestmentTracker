import React from 'react';
import { calculateInvestmentResults, createFormatter } from '../util/investment';

export default function CalaculationResults ({data, currency = 'USD'}) {
  const { initialInvestment, annualInvestment, expectedReturn, duration } = data;
  const formatter = createFormatter(currency);
  
  // Only calculate results if all required fields are filled and valid
  const results = 
    initialInvestment && 
    annualInvestment && 
    expectedReturn && 
    duration &&
    !isNaN(initialInvestment) &&
    !isNaN(annualInvestment) &&
    !isNaN(expectedReturn) &&
    !isNaN(duration) &&
    duration > 0
      ? calculateInvestmentResults({
          initialInvestment: parseFloat(initialInvestment),
          annualInvestment: parseFloat(annualInvestment),
          expectedReturn: parseFloat(expectedReturn),
          duration: parseInt(duration),
        })
      : [];

  return (  
    <section id="results">
        <table id="result">
            <thead>
                <tr>
                    <th className="center">Year</th>
                    <th>Interest Earned</th>
                    <th>End of Year Value</th>
                    <th>Annual Investment</th>
                </tr>
            </thead>
            <tbody>
                {results.length > 0 ? (
                  results.map((yearData) => (
                    <tr key={yearData.year}>
                      <td className="center">{yearData.year}</td>
                      <td>{formatter.format(yearData.interest)}</td>
                      <td>{formatter.format(yearData.valueEndOfYear)}</td>
                      <td>{formatter.format(yearData.annualInvestment)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="center">Please fill in all fields to see results</td>
                  </tr>
                )}
            </tbody>
        </table>
    </section>
  )}