const env = require('../../config/env');
const MockProvider = require('./providers/mockProvider');
const OpenAIProvider = require('./providers/openaiProvider');
const AnthropicProvider = require('./providers/anthropicProvider');

function createProvider() {
  if (env.AI_PROVIDER === 'openai' && env.OPENAI_API_KEY) return new OpenAIProvider();
  if (env.AI_PROVIDER === 'anthropic' && env.ANTHROPIC_API_KEY) return new AnthropicProvider();
  return new MockProvider();
}

module.exports = createProvider;
