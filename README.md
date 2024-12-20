# AI Infrastructure Wizard 🚀

A modern web-based wizard for deploying and managing AI infrastructure components using Docker. This tool helps you quickly set up and manage various AI-related services like n8n, Ollama, Qdrant, and more.

## Features ✨

- 🧙‍♂️ Interactive setup wizard
- 🐳 Docker-based deployment
- 🔄 Real-time service status monitoring
- 🎛️ Resource allocation management
- 🔐 Secure configuration
- 📊 System requirement checks

## Supported Services 🛠️

- **n8n**: Workflow automation platform
- **Ollama**: Local Large Language Model runner
- **Qdrant**: Vector database
- **PostgreSQL**: Relational database
- **Flowise**: Visual LLM flow builder (optional)
- **Perplexica**: AI chat interface (optional)

## Prerequisites 📋

- Node.js 18+
- Docker Desktop
- Git
- 10GB+ free disk space
- (Optional) NVIDIA GPU for accelerated LLM inference

## Quick Start 🚀

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-infrastructure-wizard.git
   cd ai-infrastructure-wizard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

## Usage Guide 📖

1. **System Check**
   - The wizard will first check your system requirements
   - Ensures Docker is running
   - Verifies available disk space
   - Checks for NVIDIA GPU (optional)

2. **Component Selection**
   - Choose which services you want to deploy
   - Required components are pre-selected
   - Optional components can be toggled

3. **Configuration**
   - Set installation directory
   - Configure ports
   - Set resource limits (CPU/RAM)
   - Configure admin credentials

4. **Review & Deploy**
   - Review your configuration
   - Option to launch services after deployment
   - Real-time deployment status
   - Service status monitoring

## Development 🛠️

### Project Structure
```
ai-infrastructure-wizard/
├── src/
│   ├── components/
│   ├── App.tsx
│   └── main.tsx
├── vite-plugin-system-check.ts
├── package.json
└── vite.config.ts
```

### Building for Production
```bash
npm run build
```

### Running Tests
```bash
npm test
```

## Configuration Options ⚙️

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_DEFAULT_INSTALL_DIR=C:\\AI
VITE_DEFAULT_N8N_PORT=5678
VITE_DEFAULT_CPU_CORES=4
VITE_DEFAULT_RAM_GB=8
```

### Docker Compose
The generated `docker-compose.yml` includes:
- Service definitions
- Port mappings
- Volume mounts
- Resource limits
- Network configuration

## Troubleshooting 🔧

### Common Issues

1. **Docker not running**
   - Ensure Docker Desktop is running
   - Check Docker service status
   - Verify Docker permissions

2. **Port conflicts**
   - Check if ports are already in use
   - Configure different ports in the wizard

3. **Resource limits**
   - Adjust CPU/RAM allocation
   - Check Docker resource settings

### Getting Help
- Open an issue on GitHub
- Check existing issues
- Read the documentation

## Contributing 🤝

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments 🙏

- Built with React + Vite
- Uses TailwindCSS for styling
- Docker for containerization
- All the amazing open-source projects we integrate with

## Security 🔒

- No sensitive data is stored
- Credentials are only used for service configuration
- All communication is local
- Docker provides container isolation
