# Frequently Asked Questions (FAQ)

## General Questions

### What is the AI Setup Wizard?
The AI Setup Wizard is a desktop application that helps you deploy and configure AI-related services using Docker containers. It provides a user-friendly interface to set up PostgreSQL, Flowise, and Qdrant.

### Do I need technical knowledge to use this?
Basic familiarity with Docker is helpful, but the wizard is designed to be user-friendly and guides you through the setup process step by step.

### Which operating systems are supported?
The wizard supports Windows, macOS, and Linux operating systems. You need to have Docker and Docker Compose installed.

## Installation

### What are the system requirements?
- Node.js 16 or higher
- Docker and Docker Compose
- Sufficient disk space for data storage
- Available ports: 5432 (PostgreSQL), 3000 (Flowise), 6333/6334 (Qdrant)

### How do I install Docker?
Visit [Docker's official website](https://www.docker.com/products/docker-desktop) to download and install Docker Desktop for your operating system.

### Can I change the installation directory?
Yes, the wizard allows you to choose any directory for installation. Make sure you have write permissions for the chosen directory.

## Components

### What components are available?
Currently, the wizard supports:
- PostgreSQL (Relational Database)
- Flowise (LLM Flow Builder)
- Qdrant (Vector Database)

### Can I install only specific components?
Yes, you can choose which components to install. The wizard will generate a docker-compose.yml file only for the selected components.

### How are the components secured?
- PostgreSQL: Username/password authentication
- Flowise: Username/password authentication
- Qdrant: Optional API key authentication

## Data Management

### Where is the data stored?
Data is stored in the following directories under your installation path:
- `data/postgres`: PostgreSQL data
- `data/flowise`: Flowise configurations
- `data/qdrant`: Qdrant vector database

### How do I backup my data?
1. Stop the containers: `docker-compose down`
2. Copy the `data` directory to a safe location
3. Restart the containers: `docker-compose up -d`

### Can I migrate my data to a different machine?
Yes, you can:
1. Stop the containers on the old machine
2. Copy the `data` directory to the new machine
3. Run the wizard on the new machine using the same configuration
4. Start the containers

## Troubleshooting

### What if a port is already in use?
You'll need to either:
1. Stop the service using that port
2. Change the port mapping in the docker-compose.yml file

### How do I check if the containers are running?
Run `docker ps` to see all running containers and their status.

### What if I forget my passwords?
You can find the passwords in the docker-compose.yml file. For security reasons, consider changing them if they've been exposed.

### How do I view container logs?
Use `docker-compose logs [service-name]` to view logs for a specific service.

## Updates and Maintenance

### How do I update the components?
1. Pull the latest images: `docker-compose pull`
2. Restart the containers: `docker-compose down && docker-compose up -d`

### How often should I update?
It's recommended to update regularly to get the latest security patches and features. Check the release notes for each component.

### Can I rollback an update?
Yes, if you've backed up your data and docker-compose.yml file, you can:
1. Stop the containers
2. Restore the old configuration and data
3. Start the containers with the previous version

## Security

### Is it safe to expose these services to the internet?
The services are configured for local use by default. If you need to expose them:
1. Set up proper authentication
2. Use HTTPS/TLS
3. Configure firewalls appropriately
4. Regularly update all components

### Should I change the default passwords?
Yes, it's highly recommended to change all default passwords immediately after installation.

### How do I rotate API keys?
1. Generate a new API key
2. Update the configuration in docker-compose.yml
3. Restart the affected service

## Getting Help

### Where can I report bugs?
Open an issue on our GitHub repository with:
- Detailed description of the problem
- Steps to reproduce
- Error messages
- System information

### How can I request new features?
Submit a feature request on our GitHub repository describing:
- The feature you'd like to see
- Why it would be useful
- Any implementation ideas you have

### Where can I find the documentation?
Check our GitHub repository for:
- README.md: Overview and quick start
- INSTALLATION.md: Detailed installation guide
- CONTRIBUTING.md: How to contribute
- LICENSE: License information
