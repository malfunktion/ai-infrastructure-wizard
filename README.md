# AI Infrastructure Wizard 🧙‍♂️

A user-friendly setup wizard for deploying AI infrastructure components using Docker.

## Features ✨

- 🚀 One-click deployment of AI infrastructure
- 🔄 Always uses latest stable versions from Docker Hub
- 🔐 Service-specific security configuration
- 🎯 Configurable installation directory
- 📊 Docker Compose configuration
- 🌐 Automatic dependency handling

## Supported Components 🛠️

| Component | Description | Default Port |
|-----------|-------------|--------------|
| PostgreSQL | Relational Database | 5432 |
| Flowise | LLM Flow Builder | 3000 |
| Qdrant | Vector Database | 6333, 6334 |

## Security Features 🔒

Each service has its own security configuration:

- **PostgreSQL**: Username, password, and database name
- **Flowise**: Username and password authentication
- **Qdrant**: Optional API key authentication

## Version Management 🔄

The wizard automatically fetches the latest stable versions from Docker Hub official repositories:
- postgres:latest
- flowise/flowise:latest
- qdrant/qdrant:latest

This ensures you're always deploying the most recent stable versions of each component.

## Data Persistence 💾

Each service has its own persistent volume:
- PostgreSQL: `./data/postgres`
- Flowise: `./data/flowise`
- Qdrant: `./data/qdrant`

## Getting Started 🚀

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-infrastructure-wizard.git
   cd ai-infrastructure-wizard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the wizard in development mode:
   ```bash
   npm run electron:dev
   ```

4. Build for production:
   ```bash
   npm run electron:build
   ```

## Requirements 📋

- Node.js 16+
- Docker and Docker Compose
- Windows, macOS, or Linux operating system

## Development 🛠️

- Built with React + TypeScript + Electron
- Uses Vite for development
- Tailwind CSS for styling

Development commands:
```bash
# Start development server
npm run electron:dev

# Build for production
npm run electron:build

# Run tests
npm test
```

## Project Structure 📁

```
ai-infrastructure-wizard/
├── src/                    # Source code
│   ├── api/               # API handlers
│   ├── components/        # React components
│   ├── types/            # TypeScript types
│   └── utils/            # Utility functions
├── electron/              # Electron main process
├── public/               # Static assets
└── dist/                 # Build output
```

## Contributing 🤝

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments 🙏

- [PostgreSQL](https://www.postgresql.org/)
- [Flowise](https://flowiseai.com/)
- [Qdrant](https://qdrant.tech/)
