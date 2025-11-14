import { useState, useEffect } from 'react';
import { generateInvestmentInsights, generateRecommendations } from '../services/aiService';

export default function AIInsights({ investmentData, results }) {
  const [insights, setInsights] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (results.length > 0) {
      loadInsights();
    }
  }, [investmentData, results]);

  const loadInsights = async () => {
    setLoading(true);
    try {
      const [insightsData, recommendationsData] = await Promise.all([
        generateInvestmentInsights(investmentData, results),
        generateRecommendations(investmentData),
      ]);
      setInsights(insightsData);
      setRecommendations(recommendationsData);
    } catch (error) {
      console.error('Error loading AI insights:', error);
    } finally {
      setLoading(false);
    }
  };

  if (results.length === 0) return null;

  const getIcon = (type) => {
    // Icons removed for cleaner design
    return '';
  };

  const getColor = (type) => {
    switch (type) {
      case 'success': return '#22c55e';
      case 'warning': return '#f59e0b';
      case 'info': return '#3b82f6';
      case 'suggestion': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  return (
    <div className="ai-insights-container">
      <div 
        className="ai-insights-header"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="ai-insights-title">
          <h3>AI Investeringsindsigter</h3>
        </div>
        <span className="ai-toggle">{expanded ? 'Skjul' : 'Vis'}</span>
      </div>

      {expanded && (
        <div className="ai-insights-content">
          {loading ? (
            <div className="ai-loading">Indlæser indsigter...</div>
          ) : (
            <>
              {insights.length > 0 && (
                <div className="ai-section">
                  <h4>Indsigter</h4>
                  <div className="ai-items">
                    {insights.map((insight, index) => (
                      <div 
                        key={index} 
                        className="ai-item"
                        style={{ borderLeftColor: getColor(insight.type) }}
                      >
                        <div className="ai-item-header">
                          <span className="ai-item-title">{insight.title}</span>
                        </div>
                        <p className="ai-item-message">{insight.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {recommendations.length > 0 && (
                <div className="ai-section">
                  <h4>Anbefalinger</h4>
                  <div className="ai-items">
                    {recommendations.map((rec, index) => (
                      <div 
                        key={index} 
                        className="ai-item"
                        style={{ borderLeftColor: getColor(rec.type) }}
                      >
                        <div className="ai-item-header">
                          <span className="ai-item-title">{rec.title}</span>
                        </div>
                        <p className="ai-item-message">{rec.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {insights.length === 0 && recommendations.length === 0 && (
                <div className="ai-empty">
                  Ingen indsigter tilgængelige for øjeblikket.
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

