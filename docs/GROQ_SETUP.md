# Getting Groq API Key

Groq provides fast LLM inference which Vanna AI uses to generate SQL from natural language.

## Step-by-Step Guide

### 1. Visit Groq Console

Go to: https://console.groq.com

### 2. Sign Up / Login

- Click "Sign In" or "Get Started"
- Use Google, GitHub, or email to sign up
- Verify your email if required

### 3. Create API Key

1. Once logged in, go to **API Keys** section
2. Click **"Create API Key"**
3. Give it a name: `flowbit-analytics`
4. Click **"Create"**
5. **Copy the API key** (starts with `gsk_`)

⚠️ **Important**: Save this key immediately! You won't be able to see it again.

### 4. Add to Environment File

Paste your API key in `services/vanna/.env`:

```env
GROQ_API_KEY=gsk_your_actual_key_here
```

### 5. Test the Key

```powershell
cd services\vanna

# Create test script
$testScript = @"
import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(
    api_key=os.getenv('GROQ_API_KEY'),
    base_url='https://api.groq.com/openai/v1'
)

try:
    response = client.chat.completions.create(
        model='llama3-70b-8192',
        messages=[{'role': 'user', 'content': 'Hello!'}],
        max_tokens=10
    )
    print('✅ Groq API key is valid!')
    print(response.choices[0].message.content)
except Exception as e:
    print('❌ Error:', str(e))
"@

$testScript | Out-File -FilePath test_groq.py -Encoding utf8

# Run test
python test_groq.py

# Clean up
Remove-Item test_groq.py
```

## Available Models

Groq offers several fast models:

1. **llama3-70b-8192** (Default)
   - 70 billion parameters
   - 8,192 token context
   - Best for complex SQL generation

2. **llama3-8b-8192**
   - 8 billion parameters
   - Faster, but less accurate

3. **mixtral-8x7b-32768**
   - Mixture of experts
   - 32,768 token context

To change model, edit `services/vanna/main.py`:

```python
vn = MyVanna(config={
    'api_key': os.getenv('GROQ_API_KEY'),
    'model': 'mixtral-8x7b-32768',  # Change here
    'base_url': 'https://api.groq.com/openai/v1'
})
```

## Rate Limits (Free Tier)

- **Requests**: 30 requests/minute
- **Tokens**: 20,000 tokens/minute

For production, consider:
- Rate limiting on your API
- Caching common queries
- Upgrading to paid plan

## Troubleshooting

### "Invalid API Key"

```
❌ Error: Invalid API key
```

**Solution**: 
- Double-check you copied the full key
- Key should start with `gsk_`
- No extra spaces or quotes
- Regenerate key if needed

### "Rate limit exceeded"

```
❌ Error: Rate limit exceeded
```

**Solution**:
- Wait 1 minute
- Implement request throttling
- Upgrade to paid plan

### "Model not found"

```
❌ Error: Model 'xxx' not found
```

**Solution**:
- Use exact model names from list above
- Check Groq docs for latest models

## Alternative: Using OpenAI Instead

If you prefer OpenAI's GPT-4:

1. Get API key from https://platform.openai.com
2. Edit `services/vanna/main.py`:

```python
vn = MyVanna(config={
    'api_key': os.getenv('OPENAI_API_KEY'),
    'model': 'gpt-4',
    # Remove base_url for OpenAI
})
```

3. Update `.env`:
```env
OPENAI_API_KEY=sk-...
```

Note: OpenAI is slower and more expensive than Groq.

## Security Best Practices

✅ **DO**:
- Keep API keys in `.env` files
- Add `.env` to `.gitignore`
- Use different keys for dev/prod
- Rotate keys regularly

❌ **DON'T**:
- Commit keys to git
- Share keys publicly
- Use production keys in development
- Hardcode keys in source code

## Cost Tracking

Groq free tier is generous, but monitor usage:

1. Dashboard: https://console.groq.com/usage
2. Set up alerts
3. Monitor tokens used

## Support

Groq documentation: https://console.groq.com/docs

Questions? Email: recruit@flowbitai.com
