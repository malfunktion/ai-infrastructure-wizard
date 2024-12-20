# Frequently Asked Questions (FAQ)

## General Questions

### Q: What is AI Infrastructure Wizard?
A: AI Infrastructure Wizard is a tool that helps you set up and manage various AI-related services using Docker containers. It provides a user-friendly interface to configure and deploy services like n8n, Ollama, Qdrant, and more.

### Q: Is it free to use?
A: Yes, AI Infrastructure Wizard is open-source and free to use under the MIT license.

### Q: What operating systems are supported?
A: The wizard supports Windows, macOS, and Linux operating systems. However, some features may require specific OS configurations.

## Installation & Setup

### Q: What are the minimum system requirements?
A: The minimum requirements are:
- 2 CPU cores
- 4GB RAM
- 10GB free disk space
- Docker Desktop
- Node.js 18+

### Q: Do I need a GPU?
A: No, a GPU is not required but is recommended for better performance with LLM services like Ollama.

### Q: Can I change the installation directory later?
A: Yes, you can run the wizard again to create a new installation. However, you'll need to manually migrate any data from the old installation.

## Components & Services

### Q: What services are included?
A: The core services are:
- n8n (workflow automation)
- Ollama (local LLM runner)
- Qdrant (vector database)
- PostgreSQL (relational database)
Optional services:
- Flowise (LLM flow builder)
- Perplexica (AI chat interface)

### Q: Can I add my own services?
A: Currently, the wizard supports a predefined set of services. Custom service integration is planned for future releases.

### Q: How do I access the services?
A: Each service is accessible via its web interface:
- n8n: http://localhost:5678
- Flowise: http://localhost:3000
- Qdrant: http://localhost:6333
- Perplexica: http://localhost:3001

## Resource Usage

### Q: How much RAM do the services use?
A: RAM usage varies by service:
- n8n: ~500MB
- Ollama: 2-4GB (depends on model)
- Qdrant: 500MB-1GB
- PostgreSQL: 500MB
- Flowise: 500MB
- Perplexica: 200MB

### Q: Can I adjust resource limits?
A: Yes, you can configure CPU and RAM limits for each service during setup.

## Troubleshooting

### Q: Docker containers won't start
A: Common solutions:
1. Check if Docker Desktop is running
2. Verify port availability
3. Check system resources
4. Review Docker logs

### Q: Services are slow
A: Try:
1. Increasing resource limits
2. Reducing the number of running services
3. Using a GPU for LLM operations
4. Optimizing database configurations

### Q: Data persistence issues
A: Ensure:
1. Docker volumes are properly configured
2. Sufficient disk space is available
3. Proper permissions are set
4. Regular backups are maintained

## Security

### Q: Is it safe to use in production?
A: The wizard is designed for local development and testing. For production use:
1. Configure proper authentication
2. Set up SSL/TLS
3. Implement network security
4. Regular security updates

### Q: How are passwords stored?
A: Passwords are stored in the `.env` file and Docker secrets. Always:
1. Change default passwords
2. Use strong passwords
3. Restrict file permissions
4. Never share credential files

## Updates & Maintenance

### Q: How do I update services?
A: To update:
1. Pull latest Docker images
2. Restart services
3. Check for compatibility
4. Backup data first

### Q: How often should I backup?
A: Recommended backup schedule:
1. Database: Daily
2. Configuration: After changes
3. Volumes: Weekly
4. Full system: Monthly

## Development

### Q: Can I contribute to the project?
A: Yes! See our [CONTRIBUTING.md](CONTRIBUTING.md) guide for:
1. Development setup
2. Coding standards
3. Pull request process
4. Testing requirements

### Q: Where can I report bugs?
A: Report bugs on our GitHub Issues page with:
1. Clear description
2. Steps to reproduce
3. System information
4. Relevant logs

## Support

### Q: Where can I get help?
A: Support options:
1. GitHub Issues
2. Documentation
3. Community discussions
4. Stack Overflow tags

### Q: Is commercial support available?
A: Currently, support is community-driven. Enterprise support options are under consideration.
