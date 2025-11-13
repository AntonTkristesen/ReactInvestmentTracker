import Header from "./Components/Header.jsx"
import CalaculationBox from "./Components/CalculationBox.jsx"
import CalaculationResults from "./Components/CalaculationResults.jsx"
import { useState } from "react"

function App() {
  const [formData, setFormData] = useState({
    initialInvestment: "",
    annualInvestment: "",
    expectedReturn: "",
    duration: "",
  });

  const [currency, setCurrency] = useState('DKK');

  const handleFieldChange = (name, value) => {
    const updated = { ...formData, [name]: value };
    setFormData(updated);
  };

  return (
    <div>
      <Header />
      <CalaculationBox 
        formData={formData}
        onFieldChange={handleFieldChange}
      />
      <CalaculationResults data={formData} currency={currency} />
    </div>
  )
}

export default App
