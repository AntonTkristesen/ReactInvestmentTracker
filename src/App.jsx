import Header from "./Components/Header.jsx"
import CalaculationBox from "./Components/CalculationBox.jsx"
import CalaculationResults from "./Components/CalaculationResults.jsx"
import SplashScreen from "./Components/SplashScreen.jsx"
import { useState } from "react"

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [formData, setFormData] = useState({
    initialInvestment: "",
    monthlyInvestment: "",
    expectedReturn: "8",
    duration: "",
    targetAmount: "",
  });

  const [showDetails, setShowDetails] = useState(false);

  const handleFieldChange = (name, value) => {
    const updated = { ...formData, [name]: value };
    setFormData(updated);
  };

  const handleReturnChange = (value) => {
    handleFieldChange('expectedReturn', value);
  };

  return (
    <>
      {showSplash && (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      )}
      {!showSplash && (
        <>
          <div className="video-background">
            <video autoPlay loop muted playsInline>
              <source src="https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_30fps.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="app-container">
            <Header />
            <div className="main-content">
              <CalaculationBox 
                formData={formData}
                onFieldChange={handleFieldChange}
              />
              <CalaculationResults 
                data={formData} 
                onReturnChange={handleReturnChange}
                showDetails={showDetails}
                onToggleDetails={() => setShowDetails(!showDetails)}
              />
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default App
