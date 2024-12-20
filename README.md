# AI Infrastructure Wizard 🧙‍♂️

A user-friendly setup wizard for deploying AI infrastructure components using Docker.

## Features ✨

- 🚀 One-click deployment of AI infrastructure
- 🔄 Always uses latest stable versions from official sources
- 🔐 Service-specific security configuration
- 🎯 Configurable ports for all services
- 📊 Resource allocation management
- 🌐 Automatic dependency handling

## Supported Components 🛠️

| Component | Description | Default Port |
|-----------|-------------|--------------|
| n8n | Workflow Automation Platform | 5678 |
| Ollama | Local LLM Runner | 11434 |
| OpenWebUI | Ollama Web Interface | 3000 |
| Qdrant | Vector Database | 6333 |
| PostgreSQL | Relational Database | 5432 |
| Flowise | LLM Flow Builder | 3001 |
| SearXNG | Privacy-focused Search Engine | 8080 |
| Perplexity | AI Assistant Interface | 3002 |

## Security Features 🔒

Each service has its own security configuration:

- **n8n**: Username/password authentication
- **PostgreSQL**: Admin credentials
- **Qdrant**: API key authentication
- **Flowise**: Admin access control
- **SearXNG**: Admin password protection

## Version Management 🔄

The wizard automatically fetches the latest stable versions from:
- Docker Hub official repositories
- GitHub releases
- Package registries

This ensures you're always deploying the most recent stable versions of each component.

## Resource Management 💻

- CPU core allocation
- Memory limits per service
- Volume management for persistent data
- Network configuration

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

3. Start the wizard:
   ```bash
   npm run dev
   ```

4. Open http://localhost:5173 in your browser

5. Follow the setup wizard steps:
   - Select components to install
   - Configure ports and security
   - Set resource limits
   - Review and deploy

## Requirements 📋

- Node.js 16+
- Docker and Docker Compose
- 8GB RAM minimum (16GB recommended)
- 4 CPU cores minimum

## Development 🛠️

- Built with React + TypeScript
- Uses Vite for development
- Tailwind CSS for styling

To start development server:
```bash
npm run dev
```

To build for production:
```bash
npm run build
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

- [n8n](https://n8n.io/)
- [Ollama](https://ollama.ai/)
- [OpenWebUI](https://github.com/open-webui/open-webui)
- [Qdrant](https://qdrant.tech/)
- [PostgreSQL](https://www.postgresql.org/)
- [Flowise](https://flowiseai.com/)
- [SearXNG](https://docs.searxng.org/)
- [Perplexity](https://www.perplexity.ai/)
