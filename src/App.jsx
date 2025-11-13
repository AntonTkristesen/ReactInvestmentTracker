import Header from "./Components/Header.jsx"
import CalaculationBox from "./Components/CalculationBox.jsx"
import CalaculationResults from "./Components/CalaculationResults.jsx"
import { useState } from "react"

function App() {
  const [formData, setFormData] = useState({
    initialInvestment: "",
    monthlyInvestment: "",
    expectedReturn: "8",
    duration: "",
    targetAmount: "",
  });

  const [currency, setCurrency] = useState('DKK');
  const [showDetails, setShowDetails] = useState(false);

  const handleFieldChange = (name, value) => {
    const updated = { ...formData, [name]: value };
    setFormData(updated);
  };

  const handleReturnChange = (value) => {
    handleFieldChange('expectedReturn', value);
  };

  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        <CalaculationBox 
          formData={formData}
          onFieldChange={handleFieldChange}
        />
        <CalaculationResults 
          data={formData} 
          currency={currency}
          onReturnChange={handleReturnChange}
          onFieldChange={handleFieldChange}
          showDetails={showDetails}
          onToggleDetails={() => setShowDetails(!showDetails)}
        />
      </div>
    </div>
  )
}

export default App
