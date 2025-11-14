/**
 * AI Service for Investment Calculator
 * 
 * This service provides AI-powered features using Groq (free, fast AI).
 */

import { calculateSummaryMetrics } from '../util/calculations';
import {
  HIGH_RISK_RETURN,
  LOW_RISK_RETURN,
  SHORT_DURATION_YEARS,
  LONG_DURATION_YEARS,
  HIGH_ROI_PERCENTAGE,
  GOOD_ROI_PERCENTAGE,
  GOAL_PROGRESS_THRESHOLD,
  COMPOUND_RATIO_THRESHOLD,
  MONTHLY_RATIO_THRESHOLD,
  OPTIMAL_MONTHLY_RATIO,
  MIN_REQUEST_INTERVAL_MS,
  MONTHS_PER_YEAR,
} from '../constants/investment';

/**
 * Generate AI-powered investment insights based on user's investment data
 * @param {Object} investmentData - User's investment parameters
 * @param {Object} results - Calculated investment results
 * @returns {Promise<Array>} AI-generated insights
 */
export async function generateInvestmentInsights(investmentData, results) {
  const { expectedReturn, duration, targetAmount } = investmentData;
  const { finalValue, profit, roiPercentage } = calculateSummaryMetrics(investmentData, results);

  const insights = generateRuleBasedInsights({
    initialInvestment: parseFloat(investmentData.initialInvestment),
    monthlyInvestment: parseFloat(investmentData.monthlyInvestment),
    expectedReturn: parseFloat(expectedReturn),
    duration: parseInt(duration),
    targetAmount: targetAmount ? parseFloat(targetAmount) : null,
    finalValue,
    profit,
    roiPercentage: parseFloat(roiPercentage),
  });

  return insights;
}

/**
 * Generate insights using rule-based logic
 */
function generateRuleBasedInsights(data) {
  const insights = [];
  
  // Risk assessment
  if (data.expectedReturn > HIGH_RISK_RETURN) {
    insights.push({
      type: 'warning',
      title: 'Høj risiko',
      message: `Et forventet afkast på ${data.expectedReturn}% er meget højt. Overvej at diversificere dine investeringer for at reducere risikoen.`,
    });
  } else if (data.expectedReturn < LOW_RISK_RETURN) {
    insights.push({
      type: 'info',
      title: 'Konservativ strategi',
      message: 'Din investeringsstrategi er konservativ. Dette er sikkert, men overvej om du kan acceptere mere risiko for højere afkast.',
    });
  }

  // Monthly investment analysis
  const monthlyRatio = data.monthlyInvestment / data.initialInvestment;
  if (monthlyRatio > MONTHLY_RATIO_THRESHOLD) {
    insights.push({
      type: 'success',
      title: 'Stærk månedlig opsparing',
      message: `Din månedlige opsparing er ${(monthlyRatio * 100).toFixed(0)}% af din startkapital. Dette er en solid strategi for langsigtet vækst.`,
    });
  }

  // Duration analysis
  if (data.duration < SHORT_DURATION_YEARS) {
    insights.push({
      type: 'warning',
      title: 'Kort investeringshorisont',
      message: `Med en investeringshorisont under ${SHORT_DURATION_YEARS} år, bør du overveje mere konservative investeringer for at reducere risikoen.`,
    });
  } else if (data.duration >= LONG_DURATION_YEARS) {
    insights.push({
      type: 'success',
      title: 'Langsigtet perspektiv',
      message: 'Din langsigtede investeringshorisont giver dig mulighed for at tage mere risiko og potentielt opnå højere afkast.',
    });
  }

  // Goal tracking
  if (data.targetAmount) {
    const progress = (data.finalValue / data.targetAmount) * 100;
    if (progress >= 100) {
      insights.push({
        type: 'success',
        title: 'Mål nået!',
        message: `Tillykke! Du har nået dit målbeløb på ${data.targetAmount.toLocaleString('da-DK')} kr.`,
      });
    } else if (progress >= GOAL_PROGRESS_THRESHOLD) {
      insights.push({
        type: 'info',
        title: 'Tæt på målet',
        message: `Du er ${progress.toFixed(0)}% af vejen til dit mål. Overvej at øge din månedlige opsparing for at nå målet hurtigere.`,
      });
    } else {
      insights.push({
        type: 'info',
        title: 'Målstatus',
        message: `Du er ${progress.toFixed(0)}% af vejen til dit mål. Overvej at justere din strategi for at nå målet.`,
      });
    }
  }

  // ROI analysis
  if (data.roiPercentage > HIGH_ROI_PERCENTAGE) {
    insights.push({
      type: 'success',
      title: 'Fremragende ROI',
      message: `Din ROI på ${data.roiPercentage}% er meget god. Dette indikerer en effektiv investeringsstrategi.`,
    });
  }

  // Compound interest power
  const totalInvested = data.initialInvestment + data.monthlyInvestment * MONTHS_PER_YEAR * data.duration;
  const compoundRatio = data.finalValue / totalInvested;
  if (compoundRatio > COMPOUND_RATIO_THRESHOLD) {
    insights.push({
      type: 'info',
      title: 'Rentes rente effekt',
      message: `Rentes rente effekten har øget din formue betydeligt. Dette viser kraften i langsigtet investering.`,
    });
  }

  return insights;
}

/**
 * Generate AI-powered investment recommendations
 * @param {Object} investmentData - User's investment parameters
 * @returns {Promise<Array>} Array of recommendations
 */
export async function generateRecommendations(investmentData) {
  const { initialInvestment, monthlyInvestment, expectedReturn, duration } = investmentData;
  const recommendations = [];

  // Calculate optimal monthly investment
  const currentMonthly = parseFloat(monthlyInvestment);
  const optimalMonthly = parseFloat(initialInvestment) * OPTIMAL_MONTHLY_RATIO;
  
  if (currentMonthly < optimalMonthly * MONTHLY_RATIO_THRESHOLD) {
    recommendations.push({
      type: 'suggestion',
      title: 'Overvej at øge månedlig opsparing',
      message: `At øge din månedlige opsparing til ${optimalMonthly.toLocaleString('da-DK')} kr. kunne betydeligt forbedre dine langsigtede resultater.`,
      action: 'increase_monthly',
    });
  }

  // Duration recommendations
  const HIGH_RETURN_THRESHOLD = 8;
  if (parseInt(duration) < LONG_DURATION_YEARS && parseFloat(expectedReturn) > HIGH_RETURN_THRESHOLD) {
    recommendations.push({
      type: 'suggestion',
      title: 'Forlæng investeringshorisonten',
      message: 'En længere investeringshorisont ville give rentes rente effekten mere tid til at virke.',
      action: 'extend_duration',
    });
  }

  return recommendations;
}

// Request throttling
let lastRequestTime = 0;

/**
 * Chat with AI about investments using Groq
 * @param {string} question - User's question
 * @param {Object} context - Investment context
 * @param {Array} conversationHistory - Previous messages for context
 * @returns {Promise<string>} AI response
 */
export async function chatWithAI(question, context, conversationHistory = []) {
  const groqKey = import.meta.env.VITE_GROQ_API_KEY;

  // Throttle requests slightly
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL_MS) {
    await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL_MS - timeSinceLastRequest));
  }

  // Use Groq if API key is available
  if (groqKey && groqKey !== 'your_groq_api_key_here') {
    try {
      return await chatWithGroq(question, context, conversationHistory, groqKey);
    } catch (error) {
      console.error('Groq error:', error);
      throw error;
    }
  }

  // No API key - use rule-based fallback
  return getFallbackResponse(question, context);
}

/**
 * Chat with Groq (FREE, fast, no rate limits)
 */
async function chatWithGroq(question, context, conversationHistory, apiKey) {
  try {
    const { Groq } = await import('groq-sdk');
    const groq = new Groq({ 
      apiKey,
      dangerouslyAllowBrowser: true
    });

    const systemMessage = `Du er en dansk finansiel rådgiver. Svar kort og præcist på dansk.
Investeringsdata: Profit ${context.profit?.toLocaleString('da-DK') || '0'} kr, ROI ${context.roiPercentage || '0'}%, Mål ${context.targetAmount ? context.targetAmount.toLocaleString('da-DK') : 'Ikke sat'} kr.`;

    const limitedHistory = conversationHistory.slice(-4);
    const messages = [
      { role: 'system', content: systemMessage },
      ...limitedHistory.map(msg => ({ role: msg.role, content: msg.content })),
      { role: 'user', content: question }
    ];

    lastRequestTime = Date.now();

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: messages,
      temperature: 0.7,
      max_tokens: 300,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from Groq API');
    }
    return response;
  } catch (error) {
    console.error('Groq API error:', error);
    if (error.status === 401) {
      throw new Error('Groq API key er ugyldig. Tjek din VITE_GROQ_API_KEY i .env filen.');
    } else if (error.status === 429) {
      throw new Error('Groq rate limit nået. Vent et øjeblik og prøv igen.');
    } else if (error.message) {
      throw new Error(`Groq fejl: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Fallback response when Groq is not available
 */
function getFallbackResponse(question, context) {
  const lowerQuestion = question.toLowerCase();
  
  const responses = {
    'profit': `Baseret på dine nuværende indstillinger, vil din forventede profit være cirka ${context.profit?.toLocaleString('da-DK') || 'beregnes'} kr.`,
    'mål': context.yearsToGoal 
      ? `Du vil nå dit mål om cirka ${context.yearsToGoal} år.`
      : 'Baseret på dine nuværende indstillinger, vil du nå dit mål inden for den valgte periode.',
    'strategi': 'Din investeringsstrategi ser fornuftig ud. Husk at diversificere dine investeringer for at reducere risiko.',
    'roi': `Din nuværende ROI er ${context.roiPercentage || '0'}%. Dette er en ${context.roiPercentage > HIGH_ROI_PERCENTAGE ? 'fremragende' : context.roiPercentage > GOOD_ROI_PERCENTAGE ? 'god' : 'akseptabel'} præstation.`,
    'hvordan': 'For at forbedre dine investeringer, overvej at øge din månedlige opsparing, forlænge din investeringshorisont, eller diversificere dine investeringer.',
  };

  for (const [key, response] of Object.entries(responses)) {
    if (lowerQuestion.includes(key)) {
      return response;
    }
  }

  return 'Jeg kan hjælpe dig med spørgsmål om dine investeringer. Prøv at spørge om din profit, målbeløb, strategi, eller ROI.';
}

