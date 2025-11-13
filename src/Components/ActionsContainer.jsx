import { exportToPDF, exportToCSV } from '../util/export';

export default function ActionsContainer({ 
  data, 
  results, 
  formatter, 
  showDetails, 
  onToggleDetails 
}) {
  return (
    <div className="actions-container">
      <div className="details-toggle">
        <button onClick={onToggleDetails} className="toggle-button">
          {showDetails ? 'Skjul' : 'Vis'} detaljeret oversigt
        </button>
      </div>
      <div className="export-buttons">
        <button 
          onClick={() => exportToPDF(data, results, formatter)} 
          className="export-button export-pdf"
        >
          📄 Eksporter som PDF
        </button>
        <button 
          onClick={() => exportToCSV(data, results, formatter)} 
          className="export-button export-csv"
        >
          📊 Eksporter som CSV
        </button>
      </div>
    </div>
  );
}

