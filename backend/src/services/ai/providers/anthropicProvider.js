const env = require('../../../config/env');

class AnthropicProvider {
  async chat(messages) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-latest',
        max_tokens: 500,
        messages: messages.filter((m) => m.role !== 'system'),
      }),
    });

    if (!response.ok) throw new Error('Anthropic request failed');
    const data = await response.json();
    return data.content?.[0]?.text || 'No response';
  }
}

module.exports = AnthropicProvider;
