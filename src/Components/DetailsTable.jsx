export default function DetailsTable({ results, initialInvestment, formatter }) {
  return (
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
  );
}

