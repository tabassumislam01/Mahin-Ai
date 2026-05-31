class MockProvider {
  async chat(messages) {
    const last = messages[messages.length - 1];
    return `Mahin AI (mock): ${last?.content || 'Hello!'}`;
  }
}

module.exports = MockProvider;
