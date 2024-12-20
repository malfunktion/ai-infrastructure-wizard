# Contributing to AI Infrastructure Wizard

Thank you for your interest in contributing to AI Infrastructure Wizard! This document provides guidelines and instructions for contributing to the project.

## Development Setup

1. **Prerequisites**
   ```bash
   # Check Node.js version (18+ required)
   node --version

   # Check npm version
   npm --version

   # Check Docker
   docker --version
   ```

2. **Clone and Install**
   ```bash
   # Clone the repository
   git clone https://github.com/yourusername/ai-infrastructure-wizard.git
   cd ai-infrastructure-wizard

   # Install dependencies
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Project Structure

```
ai-infrastructure-wizard/
├── src/                      # Source code
│   ├── components/           # React components
│   ├── types/               # TypeScript type definitions
│   ├── App.tsx              # Main application component
│   └── main.tsx             # Application entry point
├── public/                   # Static assets
├── vite-plugin-system-check.ts  # Custom Vite plugin
└── package.json             # Project configuration
```

## Development Guidelines

1. **Code Style**
   - Use TypeScript for type safety
   - Follow ESLint configuration
   - Use functional components with hooks
   - Keep components small and focused

2. **Git Workflow**
   - Create feature branches from `main`
   - Use descriptive commit messages
   - Submit PRs with clear descriptions
   - Keep PRs focused and small

3. **Testing**
   - Write unit tests for new features
   - Ensure all tests pass before submitting PR
   - Test on both Windows and Unix systems

4. **Documentation**
   - Update README.md for new features
   - Document complex functions and components
   - Keep API documentation up to date

## Pull Request Process

1. Create a new branch for your feature
2. Make your changes and commit them
3. Update documentation if needed
4. Run tests and ensure they pass
5. Submit a pull request
6. Wait for review and address feedback

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## Building Documentation

```bash
# Generate documentation
npm run docs

# Serve documentation locally
npm run docs:serve
```

## Common Issues

1. **Docker Connection Issues**
   - Ensure Docker Desktop is running
   - Check Docker daemon status
   - Verify Docker permissions

2. **Build Errors**
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall
   - Check Node.js version compatibility

3. **Development Server Issues**
   - Check port conflicts
   - Verify all dependencies are installed
   - Check for environment variables

## Need Help?

- Create an issue for bugs
- Use discussions for questions
- Join our community chat

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
