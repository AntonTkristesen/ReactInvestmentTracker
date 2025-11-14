import jsPDF from 'jspdf';
import { calculateSummaryMetrics } from './calculations';

export function exportToPDF(data, results, formatter) {
  const { initialInvestment, monthlyInvestment, expectedReturn, duration, targetAmount } = data;
  const {
    finalValue,
    totalInvested,
    profit,
    roiPercentage,
    totalContributions,
    totalInterest,
  } = calculateSummaryMetrics(data, results);

  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.setTextColor(33, 37, 41);
  doc.text('Investeringsberegning', 105, 20, { align: 'center' });
  
  // Summary Section
  doc.setFontSize(12);
  doc.setTextColor(73, 80, 87);
  let yPos = 35;
  
  doc.setFontSize(14);
  doc.setTextColor(33, 37, 41);
  doc.text('Oversigt', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(10);
  doc.setTextColor(73, 80, 87);
  doc.text(`Nuværende opsparing: ${formatter.format(parseFloat(initialInvestment) || 0)}`, 20, yPos);
  yPos += 7;
  doc.text(`Månedlig opsparing: ${formatter.format(parseFloat(monthlyInvestment) || 0)}`, 20, yPos);
  yPos += 7;
  doc.text(`Forventet afkast: ${expectedReturn}% pr. år`, 20, yPos);
  yPos += 7;
  doc.text(`Varighed: ${duration} år`, 20, yPos);
  if (targetAmount) {
    yPos += 7;
    doc.text(`Målbeløb: ${formatter.format(parseFloat(targetAmount))}`, 20, yPos);
  }
  
  yPos += 15;
  
  // Results Section
  doc.setFontSize(14);
  doc.setTextColor(33, 37, 41);
  doc.text('Resultater', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(10);
  doc.setTextColor(73, 80, 87);
  doc.text(`Estimeret formue: ${formatter.format(finalValue)}`, 20, yPos);
  yPos += 7;
  doc.text(`Din fortjeneste: ${formatter.format(profit)}`, 20, yPos);
  yPos += 7;
  doc.text(`ROI: ${roiPercentage}%`, 20, yPos);
  yPos += 7;
  doc.text(`Samlede indbetalinger: ${formatter.format(totalContributions)}`, 20, yPos);
  yPos += 7;
  doc.text(`Samlet rente: ${formatter.format(totalInterest)}`, 20, yPos);
  
  yPos += 15;
  
  // Detailed Table
  if (results.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(33, 37, 41);
    doc.text('Detaljeret oversigt', 20, yPos);
    yPos += 10;
    
    // Table headers
    doc.setFontSize(9);
    doc.setTextColor(73, 80, 87);
    const tableHeaders = ['År', 'Start værdi', 'Årlige Indbetalinge', 'Rente optjent', 'Slut værdi', 'Samlet investeret'];
    const colWidths = [15, 35, 40, 35, 35, 40];
    let xPos = 20;
    
    tableHeaders.forEach((header, i) => {
      doc.text(header, xPos, yPos);
      xPos += colWidths[i];
    });
    
    yPos += 7;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPos - 2, 190, yPos - 2);
    
    // Table rows
    results.forEach((yearData, index) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      const startValue = index === 0 
        ? parseFloat(initialInvestment)
        : results[index - 1].valueEndOfYear;
      
      xPos = 20;
      const rowData = [
        yearData.year.toString(),
        formatter.format(startValue),
        formatter.format(yearData.monthlyInvestment),
        formatter.format(yearData.interest),
        formatter.format(yearData.valueEndOfYear),
        formatter.format(yearData.totalInvested)
      ];
      
      doc.setFontSize(8);
      rowData.forEach((data, i) => {
        doc.text(data, xPos, yPos);
        xPos += colWidths[i];
      });
      
      yPos += 7;
    });
  }
  
  // Footer
  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Side ${i} af ${pageCount} - Genereret ${new Date().toLocaleDateString('da-DK')}`,
      105,
      285,
      { align: 'center' }
    );
  }
  
  doc.save(`investeringsberegning-${new Date().toISOString().split('T')[0]}.pdf`);
}

export function exportToCSV(data, results, formatter) {
  const { initialInvestment, monthlyInvestment, expectedReturn, duration, targetAmount } = data;
  const {
    finalValue,
    totalInvested,
    profit,
    roiPercentage,
    totalContributions,
    totalInterest,
  } = calculateSummaryMetrics(data, results);

  let csv = 'Investeringsberegning\n';
  csv += `Genereret: ${new Date().toLocaleDateString('da-DK')}\n\n`;
  
  // Summary
  csv += 'Oversigt\n';
  csv += `Nuværende opsparing,${formatter.format(parseFloat(initialInvestment) || 0)}\n`;
  csv += `Månedlig opsparing,${formatter.format(parseFloat(monthlyInvestment) || 0)}\n`;
  csv += `Forventet afkast,${expectedReturn}%\n`;
  csv += `Varighed,${duration} år\n`;
  if (targetAmount) {
    csv += `Målbeløb,${formatter.format(parseFloat(targetAmount))}\n`;
  }
  csv += '\n';
  
  // Results
  csv += 'Resultater\n';
  csv += `Estimeret formue,${formatter.format(finalValue)}\n`;
  csv += `Din fortjeneste,${formatter.format(profit)}\n`;
  csv += `ROI,${roiPercentage}%\n`;
  csv += `Samlede indbetalinger,${formatter.format(totalContributions)}\n`;
  csv += `Samlet rente,${formatter.format(totalInterest)}\n`;
  csv += '\n';
  
  // Detailed table
  csv += 'Detaljeret oversigt\n';
  csv += 'År,Start værdi,Årlige Indbetalinge,Rente optjent,Slut værdi,Samlet investeret\n';
  
  results.forEach((yearData, index) => {
    const startValue = index === 0 
      ? parseFloat(initialInvestment)
      : results[index - 1].valueEndOfYear;
    
    csv += `${yearData.year},"${formatter.format(startValue)}","${formatter.format(yearData.monthlyInvestment)}","${formatter.format(yearData.interest)}","${formatter.format(yearData.valueEndOfYear)}","${formatter.format(yearData.totalInvested)}"\n`;
  });
  
  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `investeringsberegning-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

