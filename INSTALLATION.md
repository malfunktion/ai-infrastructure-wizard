# Installation Guide

This guide will help you install and run the AI Infrastructure Wizard.

## Prerequisites

Before installing, make sure you have:

1. **Node.js and npm**
   - Node.js version 16 or higher
   - npm version 7 or higher
   
2. **Docker and Docker Compose**
   - Docker version 20.10.0 or higher
   - Docker Compose version 2.0.0 or higher

3. **Operating System**
   - Windows 10/11
   - macOS 10.15 or higher
   - Linux (Ubuntu 20.04 or higher recommended)

## Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/ai-infrastructure-wizard.git
   cd ai-infrastructure-wizard
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Development Mode**
   ```bash
   npm run electron:dev
   ```
   This will:
   - Start the Vite development server
   - Launch the Electron application
   - Enable hot reloading for development

4. **Production Build**
   ```bash
   npm run electron:build
   ```
   This will:
   - Build the React application
   - Compile the Electron code
   - Create an installer in the `release` directory

## Verifying Installation

After installation, verify that:

1. **Docker is running**
   ```bash
   docker --version
   docker-compose --version
   ```

2. **Ports are available**
   - 5432 (PostgreSQL)
   - 3000 (Flowise)
   - 6333, 6334 (Qdrant)

## Troubleshooting

### Common Issues

1. **Port Conflicts**
   - Error: "port is already allocated"
   - Solution: Stop any services using the required ports or change the port in docker-compose.yml

2. **Docker Issues**
   - Error: "Cannot connect to the Docker daemon"
   - Solution: Start the Docker service and ensure it's running

3. **Permission Issues**
   - Error: "permission denied"
   - Solution: Run Docker commands with sudo (Linux/macOS) or run as administrator (Windows)

4. **Disk Space**
   - Error: "no space left on device"
   - Solution: Free up disk space or change the installation directory

### Getting Help

If you encounter any issues:

1. Check the [FAQ](FAQ.md) for common problems
2. Open an issue on GitHub with:
   - Error message
   - Operating system details
   - Steps to reproduce

## Security Notes

1. **Default Credentials**
   - Change all default passwords immediately after installation
   - Use strong passwords for all services

2. **API Keys**
   - Keep the Qdrant API key secure if enabled
   - Rotate keys periodically

3. **Network Security**
   - Services are exposed only to localhost by default
   - Configure firewalls appropriately if exposing to network

## Data Persistence

All data is stored in the `data` directory:
- `data/postgres`: PostgreSQL data
- `data/flowise`: Flowise configurations
- `data/qdrant`: Qdrant vector database

Backup these directories regularly to prevent data loss.

## Updating

To update the wizard:

1. Pull the latest changes
   ```bash
   git pull origin main
   ```

2. Install any new dependencies
   ```bash
   npm install
   ```

3. Rebuild the application
   ```bash
   npm run electron:build
   ```

## Uninstallation

1. Stop all containers
   ```bash
   docker-compose down
   ```

2. Remove data directories (optional)
   ```bash
   rm -rf data
   ```

3. Uninstall the application
   - Windows: Use "Add or Remove Programs"
   - macOS: Move to Trash
   - Linux: Remove the installation directory
