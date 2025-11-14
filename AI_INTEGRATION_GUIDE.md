# AI Integration Guide

This guide explains how to integrate real AI APIs into your investment calculator.

## Current Implementation

The app currently uses **rule-based AI insights** that analyze investment data and provide recommendations based on predefined logic. This works well for demonstration, but you can enhance it with real AI APIs.

## Integration Options

### 1. OpenAI (GPT-4/GPT-3.5)

**Installation:**
```bash
npm install openai
```

**Update `src/services/aiService.js`:**

```javascript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY, // Store in .env file
  dangerouslyAllowBrowser: true // Only for client-side usage
});

export async function generateInvestmentInsights(investmentData, results) {
  const prompt = `Analyze this investment scenario and provide insights in Danish:
    - Initial Investment: ${investmentData.initialInvestment} DKK
    - Monthly Investment: ${investmentData.monthlyInvestment} DKK
    - Expected Return: ${investmentData.expectedReturn}%
    - Duration: ${investmentData.duration} years
    - Final Value: ${results[results.length - 1]?.valueEndOfYear || 0} DKK
    - Profit: ${results[results.length - 1]?.valueEndOfYear - results[results.length - 1]?.totalInvested || 0} DKK
    
    Provide 3-5 insights as JSON array with {type, title, message} format.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a financial advisor providing investment insights in Danish." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const response = JSON.parse(completion.choices[0].message.content);
    return response.insights || [];
  } catch (error) {
    console.error('OpenAI API error:', error);
    return generateRuleBasedInsights(investmentData, results); // Fallback
  }
}
```

### 2. Anthropic Claude

**Installation:**
```bash
npm install @anthropic-ai/sdk
```

**Update `src/services/aiService.js`:**

```javascript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.VITE_ANTHROPIC_API_KEY,
});

export async function generateInvestmentInsights(investmentData, results) {
  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    messages: [{
      role: "user",
      content: `Analyze this investment and provide insights in Danish...`
    }]
  });

  // Parse response and return insights
}
```

### 3. Local AI Models (Ollama)

For privacy and cost savings, you can run models locally:

**Installation:**
```bash
# Install Ollama locally
# Then use fetch to call local API
```

**Update `src/services/aiService.js`:**

```javascript
export async function generateInvestmentInsights(investmentData, results) {
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama2',
      prompt: `Analyze investment...`,
      stream: false
    })
  });

  const data = await response.json();
  // Parse and return insights
}
```

### 4. Google Gemini

**Installation:**
```bash
npm install @google/generative-ai
```

**Update `src/services/aiService.js`:**

```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);

export async function generateInvestmentInsights(investmentData, results) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
  const prompt = `Analyze investment scenario...`;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  // Parse and return insights
}
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_OPENAI_API_KEY=your_api_key_here
# or
VITE_ANTHROPIC_API_KEY=your_api_key_here
# or
VITE_GEMINI_API_KEY=your_api_key_here
```

**Important:** Never commit `.env` files to git! Add `.env` to `.gitignore`.

## Enhanced Features You Can Add

### 1. Market Data Integration
- Fetch real market data to suggest realistic return rates
- Compare user's expected return with historical averages

### 2. Risk Analysis
- Use AI to analyze risk levels based on investment strategy
- Provide personalized risk warnings

### 3. Portfolio Recommendations
- Suggest optimal asset allocation
- Recommend specific investment types (stocks, bonds, ETFs)

### 4. Natural Language Queries
- Enhanced chat with full context understanding
- Answer complex questions about investment strategies

### 5. Predictive Analytics
- Use AI to predict future market conditions
- Adjust recommendations based on economic forecasts

## Cost Considerations

- **OpenAI GPT-4**: ~$0.03 per request (expensive but high quality)
- **OpenAI GPT-3.5**: ~$0.002 per request (affordable)
- **Anthropic Claude**: Similar pricing to GPT-4
- **Google Gemini**: Free tier available, then pay-as-you-go
- **Local Models (Ollama)**: Free but requires local setup

## Best Practices

1. **Caching**: Cache AI responses to avoid repeated API calls
2. **Error Handling**: Always have fallback to rule-based insights
3. **Rate Limiting**: Implement rate limiting to control costs
4. **User Privacy**: Be transparent about data sent to AI services
5. **Cost Monitoring**: Track API usage to avoid unexpected bills

## Example: Enhanced Chat Function

```javascript
export async function chatWithAI(question, context) {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `You are a Danish financial advisor. Help users understand their investments. 
        Context: Profit: ${context.profit} DKK, ROI: ${context.roiPercentage}%, 
        Years to goal: ${context.yearsToGoal || 'N/A'}`
      },
      { role: "user", content: question }
    ],
    temperature: 0.7,
    max_tokens: 200
  });

  return response.choices[0].message.content;
}
```

## Testing

Test your AI integration with various scenarios:
- Low/high risk investments
- Short/long durations
- Different return rates
- With/without goals

## Support

For issues or questions about AI integration, refer to:
- OpenAI: https://platform.openai.com/docs
- Anthropic: https://docs.anthropic.com
- Google Gemini: https://ai.google.dev/docs

