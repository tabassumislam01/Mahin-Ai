import axios from 'axios';
import { logger } from '../utils/logger.js';

const ollamaClient = axios.create({
  baseURL: process.env.OLLAMA_API_URL || 'http://localhost:11434',
  timeout: 300000, // 5 minutes for AI responses
});

export const generateAIResponse = async (messages, stream = false) => {
  try {
    logger.info(`🤖 Calling Ollama with model: ${process.env.OLLAMA_MODEL}`);

    const response = await ollamaClient.post('/api/chat', {
      model: process.env.OLLAMA_MODEL || 'qwen2:3b',
      messages: messages,
      stream: false,
      options: {
        temperature: parseFloat(process.env.OLLAMA_TEMPERATURE || 0.7),
        top_p: parseFloat(process.env.OLLAMA_TOP_P || 0.9),
        top_k: parseInt(process.env.OLLAMA_TOP_K || 40),
      },
    });

    logger.info(`✅ AI response generated successfully`);
    return response.data.message.content;
  } catch (error) {
    logger.error(`❌ Ollama error: ${error.message}`);
    throw new Error(`AI service error: ${error.message}`);
  }
};

export const checkOllamaHealth = async () => {
  try {
    const response = await ollamaClient.get('/api/tags');
    return response.data.models.some(m => m.name.includes(process.env.OLLAMA_MODEL || 'qwen2'));
  } catch (error) {
    logger.error(`Ollama health check failed: ${error.message}`);
    return false;
  }
};
