# Contributing to Mahin AI

## 📖 Contributing Guidelines

Thank you for your interest in contributing to Mahin AI! This document provides guidelines and instructions for contributing.

## 🎯 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Follow the project's values
- Report issues respectfully

## 🚀 Getting Started

### 1. Fork the Repository

```bash
# Go to https://github.com/tabassumislam01/Mahin-Ai
# Click "Fork" button
git clone https://github.com/your-username/Mahin-Ai.git
cd Mahin-Ai
git remote add upstream https://github.com/tabassumislam01/Mahin-Ai.git
```

### 2. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or for bugs
git checkout -b fix/bug-description
```

Branch naming convention:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions

### 3. Make Your Changes

- Follow the existing code style
- Write clear, descriptive commits
- Add tests for new features
- Update documentation as needed

### 4. Commit Messages

Follow conventional commits:

```
feat: Add user authentication
fix: Resolve MongoDB connection timeout
docs: Update API documentation
refactor: Improve error handling
test: Add tests for chat service
style: Format code with Prettier
chore: Update dependencies
```

## 🧪 Testing

### Running Tests

```bash
# Backend tests
cd backend
npm run test
npm run test:coverage

# Frontend tests
cd ../frontend
npm run test
npm run test:coverage
```

### Writing Tests

```javascript
// Example: Jest test
describe('Chat Service', () => {
  it('should send a message successfully', async () => {
    const message = await chatService.sendMessage({
      conversationId: 'conv_123',
      message: 'Hello!'
    });

    expect(message).toBeDefined();
    expect(message.userMessage).toBe('Hello!');
    expect(message.aiResponse).toBeDefined();
  });
});
```

## 🔍 Code Style

### ESLint & Prettier

```bash
# Format code
cd backend
npm run format

# Lint check
npm run lint

# Fix linting issues
npm run lint:fix
```

### Code Style Guidelines

- Use semicolons
- 2-space indentation
- Single quotes for strings (unless content has single quotes)
- Maximum line length: 100 characters
- Camel case for variables/functions
- Pascal case for classes/components
- Constants in UPPER_SNAKE_CASE

```javascript
// Good ✅
const getUserById = async (userId) => {
  const user = await User.findById(userId);
  return user;
};

// Bad ❌
const get_user_by_id = async (user_id) => {
  let user = await User.findById(user_id);
  return user
};
```

## 📝 Documentation

### Adding Documentation

1. **Code Comments**: Explain why, not what
   ```javascript
   // ✅ Good
   // Cache user profile for 1 hour to reduce DB queries
   const cachedUser = await redis.get(`user:${id}`);

   // ❌ Bad
   // Get user from cache
   const cachedUser = await redis.get(`user:${id}`);
   ```

2. **Function Documentation**: Use JSDoc
   ```javascript
   /**
    * Sends a message to the AI and gets a response
    * @param {string} conversationId - The conversation ID
    * @param {string} message - The user message
    * @returns {Promise<Object>} The response object with aiResponse
    * @throws {ValidationError} If message is empty
    */
   const sendMessage = async (conversationId, message) => {
     // Implementation
   };
   ```

3. **Update README.md** if adding new features
4. **Update API.md** if modifying endpoints
5. **Update SETUP.md** if changing setup process

## 🔐 Security Checklist

Before submitting a PR:

- [ ] No hardcoded secrets in code
- [ ] No sensitive data in logs
- [ ] Input validation implemented
- [ ] SQL injection prevention (NoSQL prevention)
- [ ] XSS protection for user input
- [ ] CORS properly configured
- [ ] Rate limiting applied
- [ ] Authentication checks in place
- [ ] Authorization verified
- [ ] Error messages don't leak info

## 📋 Pull Request Process

### Before Submitting

1. **Sync with main branch**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run tests**
   ```bash
   npm run test
   npm run lint
   ```

3. **Build project**
   ```bash
   npm run build
   ```

### PR Title Format

Follow conventional commits:
```
[Feature] Add user profile page
[Fix] Resolve chat message not sending
[Docs] Update API documentation
[Refactor] Improve error handling
```

### PR Description Template

```markdown
## 📝 Description

Brief description of changes

## 🎯 Type of Change

- [ ] Bug fix (non-breaking)
- [ ] New feature (non-breaking)
- [ ] Breaking change
- [ ] Documentation update

## 🧪 Testing

Describe testing done:
- Manual testing steps
- Test cases added
- Coverage info

## 📸 Screenshots (if applicable)

Add screenshots for UI changes

## ✅ Checklist

- [ ] Code follows style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes
- [ ] All tests pass
- [ ] No linting errors

## 🔗 Related Issues

Fixes #123
Related to #456
```

## 🐛 Reporting Issues

### Bug Report Template

```markdown
## 🐛 Bug Description

Clear description of the bug

## 📋 Steps to Reproduce

1. Go to...
2. Click on...
3. See error

## 🎯 Expected Behavior

What should happen

## 😞 Actual Behavior

What actually happens

## 📸 Screenshots/Logs

Add relevant screenshots or error logs

## 🖥️ Environment

- OS: Windows 10
- Node.js: 18.0.0
- Browser: Chrome 120

## 📝 Additional Context

Any additional information
```

## 🎁 Feature Request Template

```markdown
## 💡 Feature Description

Describe the new feature

## 🎯 Use Case

Why is this feature needed?

## 📊 Expected Behavior

How should it work?

## 🔗 Related Issues

Issue #123 (if any)
```

## 📚 Resources

- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [React Best Practices](https://react.dev/learn)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)

## 🚫 What Not to Contribute

- Don't commit `.env` files
- Don't add large binary files
- Don't include node_modules
- Don't add unrelated large dependencies
- Don't make unrelated style changes

## 🎓 Development Workflow

```bash
# 1. Setup local environment
cd Mahin-Ai
cp .env.example .env
# Edit .env with your values

# 2. Install dependencies
cd backend && npm install
cd ../frontend && npm install

# 3. Run development servers
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev

# 4. Make changes and test

# 5. Commit and push
git add .
git commit -m "feat: add new feature"
git push origin feature/your-feature-name

# 6. Create Pull Request on GitHub
```

## 📞 Getting Help

- **Questions**: Open GitHub Discussion
- **Bugs**: Open GitHub Issue
- **Email**: support@mahin.app
- **Documentation**: Check `/docs` folder

## 🏆 Recognition

We recognize all contributors! Your name will be added to:
- CONTRIBUTORS.md
- GitHub contributors page
- Release notes

---

**Thank you for contributing to Mahin AI! 🚀**
