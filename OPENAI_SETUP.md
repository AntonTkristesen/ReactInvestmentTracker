# OpenAI Integration Setup

Your investment calculator is now integrated with OpenAI's GPT-3.5 Turbo for intelligent chat responses!

## Quick Setup

### 1. Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in to your account
3. Click "Create new secret key"
4. Copy your API key (you'll only see it once!)

### 2. Create Environment File

Create a `.env` file in the root directory of your project:

```bash
# In the project root (/Users/antonkristensen/Desktop/CalcApp/)
touch .env
```

### 3. Add Your API Key

Open the `.env` file and add:

```env
VITE_OPENAI_API_KEY=sk-your-actual-api-key-here
```

**Important:** Replace `sk-your-actual-api-key-here` with your actual API key from OpenAI.

### 4. Restart Development Server

If your dev server is running, restart it to load the new environment variable:

```bash
# Stop the server (Ctrl+C) and restart:
npm run dev
```

## How It Works

- **With API Key**: The chat uses OpenAI GPT-3.5 Turbo for intelligent, contextual responses
- **Without API Key**: Falls back to rule-based responses (still functional!)

## Features

✅ **Context-Aware**: AI knows your investment data (profit, ROI, goals, etc.)
✅ **Conversation History**: Remembers previous messages in the conversation
✅ **Danish Language**: All responses are in Danish
✅ **Error Handling**: Graceful fallback if API is unavailable
✅ **Cost Efficient**: Uses GPT-3.5 Turbo (cheaper than GPT-4)

## Cost Information

- **GPT-3.5 Turbo**: ~$0.002 per 1K tokens (very affordable)
- Average conversation: ~$0.01-0.02 per chat session
- First-time users get $5 free credit from OpenAI

## Troubleshooting

### "API-nøglen er ugyldig"
- Check that your API key is correct in `.env`
- Make sure the key starts with `sk-`
- Restart your dev server after adding the key

### "For mange anmodninger"
- You've hit OpenAI's rate limit
- Wait a minute and try again
- Consider upgrading your OpenAI plan

### Chat not working?
- Check browser console for errors
- Verify `.env` file is in the project root
- Make sure variable name is exactly `VITE_OPENAI_API_KEY`
- Restart the dev server

## Upgrading to GPT-4

To use GPT-4 (more powerful but more expensive), edit `src/services/aiService.js`:

```javascript
// Change this line:
model: 'gpt-3.5-turbo',

// To:
model: 'gpt-4',
```

## Security Note

⚠️ **Never commit your `.env` file to git!** It's already in `.gitignore` for safety.

The API key is only used client-side in this implementation. For production apps, consider using a backend proxy to keep your API key secure.

## Testing

Try asking:
- "Hvad er min forventede profit?"
- "Hvornår når jeg mit mål?"
- "Er min strategi god?"
- "Hvordan kan jeg forbedre min ROI?"
- "Forklar mig rentes rente effekten"

The AI will provide intelligent, contextual responses based on your investment data!

