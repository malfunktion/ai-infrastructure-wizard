import type { Plugin } from 'vite';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';

const execAsync = promisify(exec);

interface DeploymentConfig {
  installDir: string;
  n8nPort: number;
  ollamaPort: number;
  ollamaWebPort: number;
  qdrantPort: number;
  cpuCores: number;
  ramGB: number;
  adminUsername: string;
  adminPassword: string;
  selectedComponents: Record<string, boolean>;
}

function generateDockerCompose(config: DeploymentConfig): string {
  const services: string[] = [];
  const networks: string[] = ['ai-network'];

  if (config.selectedComponents['n8n']) {
    services.push(`
  n8n:
    image: n8nio/n8n
    container_name: ai-n8n-1
    ports:
      - "${config.n8nPort}:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=${config.adminUsername}
      - N8N_BASIC_AUTH_PASSWORD=${config.adminPassword}
    volumes:
      - n8n_data:/home/node/.n8n
    networks:
      - ai-network
    deploy:
      resources:
        limits:
          cpus: '${config.cpuCores}'
          memory: ${config.ramGB}G`);
  }

  if (config.selectedComponents['Ollama']) {
    services.push(`
  ollama:
    image: ollama/ollama
    container_name: ai-ollama-1
    ports:
      - "${config.ollamaPort}:11434"
    volumes:
      - ollama_data:/root/.ollama
    networks:
      - ai-network
    deploy:
      resources:
        limits:
          cpus: '${config.cpuCores}'
          memory: ${config.ramGB}G`);
  }

  if (config.selectedComponents['OpenWebUI']) {
    services.push(`
  openwebui:
    image: ghcr.io/open-webui/open-webui:main
    container_name: ai-openwebui-1
    ports:
      - "${config.ollamaWebPort}:8080"
    environment:
      - OLLAMA_API_BASE_URL=http://ollama:11434/api
    networks:
      - ai-network
    depends_on:
      - ollama
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G`);
  }

  if (config.selectedComponents['Qdrant']) {
    services.push(`
  qdrant:
    image: qdrant/qdrant
    container_name: ai-qdrant-1
    ports:
      - "${config.qdrantPort}:6333"
    volumes:
      - qdrant_data:/qdrant/storage
    networks:
      - ai-network
    deploy:
      resources:
        limits:
          cpus: '${config.cpuCores}'
          memory: ${config.ramGB}G`);
  }

  if (config.selectedComponents['PostgreSQL']) {
    services.push(`
  postgres:
    image: postgres:latest
    container_name: ai-postgres-1
    environment:
      - POSTGRES_USER=${config.adminUsername}
      - POSTGRES_PASSWORD=${config.adminPassword}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - ai-network
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G`);
  }

  if (config.selectedComponents['Flowise']) {
    services.push(`
  flowise:
    image: flowiseai/flowise
    container_name: ai-flowise-1
    ports:
      - "3000:3000"
    environment:
      - USERNAME=${config.adminUsername}
      - PASSWORD=${config.adminPassword}
    volumes:
      - flowise_data:/root/.flowise
    networks:
      - ai-network
    deploy:
      resources:
        limits:
          cpus: '${config.cpuCores}'
          memory: ${config.ramGB}G`);
  }

  const volumes = [
    'n8n_data',
    'ollama_data',
    'qdrant_data',
    'postgres_data',
    'flowise_data'
  ].filter(volume => {
    const serviceName = volume.split('_')[0];
    return config.selectedComponents[serviceName === 'n8n' ? 'n8n' : serviceName.charAt(0).toUpperCase() + serviceName.slice(1)];
  });

  return `version: '3.8'

services:
${services.join('\n')}

networks:
  ai-network:
    driver: bridge

volumes:
${volumes.map(v => `  ${v}:`).join('\n')}`;
}

function generateEnvFile(config: DeploymentConfig): string {
  return `# Environment Configuration
INSTALL_DIR=${config.installDir}
ADMIN_USERNAME=${config.adminUsername}
ADMIN_PASSWORD=${config.adminPassword}

# Port Configuration
N8N_PORT=${config.n8nPort}
OLLAMA_PORT=${config.ollamaPort}
OLLAMA_WEB_PORT=${config.ollamaWebPort}
QDRANT_PORT=${config.qdrantPort}

# Resource Limits
CPU_CORES=${config.cpuCores}
RAM_GB=${config.ramGB}`;
}

function generateReadme(config: DeploymentConfig): string {
  const services = [];
  
  if (config.selectedComponents['n8n']) {
    services.push(`- n8n: http://localhost:${config.n8nPort}`);
  }
  if (config.selectedComponents['Ollama']) {
    services.push(`- Ollama API: http://localhost:${config.ollamaPort}`);
  }
  if (config.selectedComponents['OpenWebUI']) {
    services.push(`- Ollama Web UI: http://localhost:${config.ollamaWebPort}`);
  }
  if (config.selectedComponents['Qdrant']) {
    services.push(`- Qdrant: http://localhost:${config.qdrantPort}`);
  }
  if (config.selectedComponents['Flowise']) {
    services.push(`- Flowise: http://localhost:3000`);
  }

  return `# AI Infrastructure Setup

## Services

${services.join('\n')}

## Management Commands

Start services:
\`\`\`bash
docker-compose up -d
\`\`\`

Stop services:
\`\`\`bash
docker-compose down
\`\`\`

View logs:
\`\`\`bash
docker-compose logs -f
\`\`\`

## Configuration

Installation Directory: ${config.installDir}
CPU Cores: ${config.cpuCores}
RAM: ${config.ramGB}GB

## Documentation Links

- n8n: https://docs.n8n.io/
- Ollama: https://ollama.ai/docs
- Qdrant: https://qdrant.tech/documentation/
- PostgreSQL: https://www.postgresql.org/docs/
- Flowise: https://docs.flowiseai.com/`;
}

export default function systemCheckPlugin(): Plugin {
  return {
    name: 'system-check',
    configureServer(server) {
      // Add API endpoint for services management
      server.middlewares.use('/api/services/:action', async (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });

          req.on('end', async () => {
            try {
              const { config } = JSON.parse(body);
              const action = req.url?.split('/').pop();
              
              if (action !== 'start' && action !== 'stop') {
                throw new Error('Invalid action');
              }

              console.log(`${action}ing services with config:`, config);
              
              // Execute docker-compose command
              const { stdout, stderr } = await execAsync(
                `docker-compose ${action === 'start' ? 'up -d' : 'down'}`,
                { cwd: config.installDir }
              );

              console.log('Command output:', stdout);
              if (stderr) console.error('Command error:', stderr);

              // Get service status
              const { stdout: psOutput } = await execAsync('docker ps --format "{{.Names}}"');
              const runningContainers = new Set(psOutput.split('\n').map(name => name.trim()));

              const services = Object.keys(config.selectedComponents)
                .filter(name => config.selectedComponents[name])
                .reduce((acc, name) => ({
                  ...acc,
                  [name]: runningContainers.has(`ai-${name.toLowerCase()}-1`)
                }), {});

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ services }));
            } catch (error) {
              console.error(`Service ${req.url?.split('/').pop()} error:`, error);
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: error.message }));
            }
          });
        } else {
          res.writeHead(405, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Method not allowed' }));
        }
      });

      // Update deployment endpoint to handle service launch
      server.middlewares.use('/api/deploy', async (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });

          req.on('end', async () => {
            try {
              const { config, launchServices } = JSON.parse(body);
              console.log('Received deployment request:', { config, launchServices });

              if (!config || !config.installDir) {
                throw new Error('Invalid configuration: missing installation directory');
              }

              // Create installation directory
              console.log('Creating directory:', config.installDir);
              await fs.mkdir(config.installDir, { recursive: true });

              // Generate and write docker-compose.yml
              console.log('Generating docker-compose.yml');
              const dockerCompose = generateDockerCompose(config);
              const dockerComposePath = path.join(config.installDir, 'docker-compose.yml');
              await fs.writeFile(dockerComposePath, dockerCompose);
              console.log('docker-compose.yml written to:', dockerComposePath);

              // Generate and write .env file
              console.log('Generating .env file');
              const envContent = generateEnvFile(config);
              const envPath = path.join(config.installDir, '.env');
              await fs.writeFile(envPath, envContent);
              console.log('.env written to:', envPath);

              // Generate and write README
              console.log('Generating README.md');
              const readme = generateReadme(config);
              const readmePath = path.join(config.installDir, 'README.md');
              await fs.writeFile(readmePath, readme);
              console.log('README.md written to:', readmePath);

              let services = {};
              
              if (launchServices) {
                console.log('Launching services...');
                
                // Start the services using docker-compose
                const { stdout, stderr } = await execAsync('docker-compose up -d', {
                  cwd: config.installDir
                });
                
                console.log('docker-compose output:', stdout);
                if (stderr) console.error('docker-compose error:', stderr);

                // Get service status
                const { stdout: psOutput } = await execAsync('docker ps --format "{{.Names}}"');
                const runningContainers = new Set(psOutput.split('\n').map(name => name.trim()));

                services = Object.keys(config.selectedComponents)
                  .filter(name => config.selectedComponents[name])
                  .reduce((acc, name) => ({
                    ...acc,
                    [name]: runningContainers.has(`ai-${name.toLowerCase()}-1`)
                  }), {});
              }

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({
                success: true,
                files: {
                  dockerCompose: dockerComposePath,
                  env: envPath,
                  readme: readmePath
                },
                services
              }));
            } catch (error) {
              console.error('Deployment error:', error);
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({
                error: error.message,
                stack: error.stack
              }));
            }
          });
        } else {
          res.writeHead(405, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Method not allowed' }));
        }
      });

      // WebSocket handlers for system checks
      server.ws.on('connection', (socket) => {
        socket.on('message', async (data) => {
          const message = JSON.parse(data.toString());
          
          if (message.command === 'check-docker') {
            try {
              const { stdout } = await execAsync('docker info');
              socket.send(JSON.stringify({
                type: 'docker-check',
                isAvailable: !stdout.includes('error')
              }));
            } catch (error) {
              socket.send(JSON.stringify({
                type: 'docker-check',
                isAvailable: false
              }));
            }
          }
        });
      });
    }
  };
}
