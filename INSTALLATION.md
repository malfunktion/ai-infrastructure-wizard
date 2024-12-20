# Installation Guide

This guide provides detailed instructions for installing and configuring the AI Infrastructure Wizard.

## System Requirements

### Minimum Requirements
- **CPU**: 2 cores
- **RAM**: 4GB
- **Disk Space**: 10GB free
- **Operating System**: Windows 10/11, macOS, or Linux
- **Docker**: Docker Desktop 4.0+
- **Node.js**: v18.0.0 or higher
- **npm**: v8.0.0 or higher

### Recommended Requirements
- **CPU**: 4+ cores
- **RAM**: 8GB+
- **Disk Space**: 20GB+ free
- **GPU**: NVIDIA GPU with CUDA support (for accelerated LLM inference)

## Installation Steps

1. **Install Prerequisites**

   a. Install Docker Desktop:
   ```bash
   # Windows: Download and install from
   https://www.docker.com/products/docker-desktop

   # Verify installation
   docker --version
   ```

   b. Install Node.js:
   ```bash
   # Windows: Download and install from
   https://nodejs.org/

   # Verify installation
   node --version
   npm --version
   ```

2. **Download and Install**

   ```bash
   # Clone the repository
   git clone https://github.com/yourusername/ai-infrastructure-wizard.git
   cd ai-infrastructure-wizard

   # Install dependencies
   npm install

   # Start the application
   npm run dev
   ```

3. **Configuration**

   The wizard will guide you through:
   - Installation directory selection
   - Component selection
   - Resource allocation
   - Security settings

## Component Details

### n8n
- **Purpose**: Workflow automation
- **Default Port**: 5678
- **Resource Usage**: Medium
- **Dependencies**: None

### Ollama
- **Purpose**: Local LLM runner
- **Default Port**: 11434
- **Resource Usage**: High
- **Dependencies**: CUDA (optional)

### Qdrant
- **Purpose**: Vector database
- **Default Port**: 6333
- **Resource Usage**: Medium
- **Dependencies**: None

### PostgreSQL
- **Purpose**: Relational database
- **Default Port**: 5432
- **Resource Usage**: Medium
- **Dependencies**: None

### Flowise (Optional)
- **Purpose**: LLM flow builder
- **Default Port**: 3000
- **Resource Usage**: Medium
- **Dependencies**: None

### Perplexica (Optional)
- **Purpose**: AI chat interface
- **Default Port**: 3001
- **Resource Usage**: Low
- **Dependencies**: None

## Post-Installation

1. **Verify Installation**
   ```bash
   # Check running containers
   docker ps

   # Check container logs
   docker logs ai-n8n-1
   ```

2. **Access Services**
   - n8n: http://localhost:5678
   - Flowise: http://localhost:3000
   - Qdrant: http://localhost:6333
   - Perplexica: http://localhost:3001

3. **Security**
   - Change default passwords
   - Configure firewall rules
   - Set up SSL if needed

## Troubleshooting

### Common Issues

1. **Docker Issues**
   - Error: "Docker daemon not running"
   - Solution: Start Docker Desktop
   - Error: "Port already in use"
   - Solution: Change port in configuration

2. **Resource Issues**
   - Error: "Out of memory"
   - Solution: Increase Docker memory limit
   - Error: "No space left"
   - Solution: Free up disk space

3. **Network Issues**
   - Error: "Connection refused"
   - Solution: Check firewall settings
   - Error: "Network timeout"
   - Solution: Check Docker network settings

### Getting Help

1. Check the [FAQ](FAQ.md)
2. Search existing issues
3. Create a new issue with:
   - Error message
   - System information
   - Steps to reproduce

## Maintenance

1. **Backup**
   ```bash
   # Backup volumes
   docker volume ls
   docker volume backup [volume-name]
   ```

2. **Updates**
   ```bash
   # Pull latest images
   docker-compose pull

   # Restart services
   docker-compose down
   docker-compose up -d
   ```

3. **Monitoring**
   ```bash
   # Check resource usage
   docker stats

   # View logs
   docker-compose logs -f
   ```

## Uninstallation

1. **Stop Services**
   ```bash
   cd [installation-directory]
   docker-compose down -v
   ```

2. **Remove Files**
   ```bash
   # Remove installation directory
   rm -rf [installation-directory]
   ```

3. **Clean Docker**
   ```bash
   # Remove unused images
   docker image prune -a

   # Remove unused volumes
   docker volume prune
   ```
