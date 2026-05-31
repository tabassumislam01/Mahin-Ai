const env = require('../../../config/env');

class OpenAIProvider {
  async chat(messages) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: ['Bearer', env.OPENAI_API_KEY].join(' '),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model: 'gpt-4o-mini', messages }),
    });

    if (!response.ok) throw new Error('OpenAI request failed');
    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'No response';
  }
}

module.exports = OpenAIProvider;
