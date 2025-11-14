# Free AI Setup Guide

Your investment calculator now supports **completely FREE** AI providers! No credit card required.

## 🆓 Free Options (Recommended)

### Option 1: Groq (BEST - Completely Free, Fast, No Limits)

**Why Groq?**
- ✅ 100% FREE - No credit card needed
- ✅ Very fast responses
- ✅ No rate limits
- ✅ Easy setup

**Setup Steps:**

1. **Get your free API key:**
   - Go to: https://console.groq.com/
   - Sign up with Google/GitHub (free)
   - Go to "API Keys" section
   - Click "Create API Key"
   - Copy your key

2. **Add to .env file:**
   ```env
   VITE_GROQ_API_KEY=gsk_your_actual_key_here
   ```

3. **Restart your dev server:**
   ```bash
   npm run dev
   ```

**That's it!** Groq will be used automatically.

---

### Option 2: Google Gemini (Free Tier)

**Why Gemini?**
- ✅ Free tier available
- ✅ Good quality responses
- ✅ 60 requests per minute (free tier)

**Setup Steps:**

1. **Get your free API key:**
   - Go to: https://makersuite.google.com/app/apikey
   - Sign in with Google account
   - Click "Create API Key"
   - Copy your key

2. **Add to .env file:**
   ```env
   VITE_GEMINI_API_KEY=your_actual_key_here
   ```

3. **Restart your dev server**

---

## Priority Order

The app will automatically try providers in this order:
1. **Groq** (if `VITE_GROQ_API_KEY` is set) - Recommended!
2. **Gemini** (if `VITE_GEMINI_API_KEY` is set)
3. **OpenAI** (if `VITE_OPENAI_API_KEY` is set) - Paid
4. **Fallback** (rule-based responses) - Always works

## Recommended: Use Groq

Groq is the best free option:
- No credit card required
- No rate limits
- Very fast
- Easy to set up

Just get a free API key from https://console.groq.com/ and add it to your `.env` file!

## Your .env File Should Look Like:

```env
# Free AI Provider (Recommended)
VITE_GROQ_API_KEY=gsk_your_groq_key_here

# OR use Gemini (also free)
# VITE_GEMINI_API_KEY=your_gemini_key_here

# OR use OpenAI (paid)
# VITE_OPENAI_API_KEY=sk-your_openai_key_here
```

## Troubleshooting

**"No AI API keys found"**
- Make sure you've added a key to `.env`
- Restart your dev server after adding the key
- Check that the variable name is correct (starts with `VITE_`)

**Groq not working?**
- Verify your API key is correct
- Check https://console.groq.com/ to see if your key is active
- Try Gemini as an alternative

**Still having issues?**
- The app will automatically fall back to rule-based responses
- Chat will still work, just without AI

## Cost Comparison

| Provider | Cost | Rate Limits | Speed |
|----------|------|-------------|-------|
| **Groq** | FREE | None | Very Fast ⚡ |
| **Gemini** | FREE | 60/min | Fast |
| **OpenAI** | Paid | 3/min (free tier) | Fast |

**Recommendation: Use Groq for the best free experience!**

