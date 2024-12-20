import { Plugin } from 'vite';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';

const execAsync = promisify(exec);

interface DeploymentConfig {
  installDir: string;
  ports: {
    n8n: number;
    ollama: number;
    ollamaWeb: number;
    qdrant: number;
    postgres: number;
    flowise: number;
    searxng: number;
    perplexity: number;
  };
  cpuCores: number;
  ramGB: number;
  adminUsername: string;
  adminPassword: string;
  selectedComponents: Record<string, boolean>;
  security: {
    n8n: {
      username: string;
      password: string;
    };
    postgres: {
      username: string;
      password: string;
    };
    qdrant: {
      apiKey: string;
    };
    flowise: {
      username: string;
      password: string;
    };
    searxng: {
      adminPassword: string;
    };
  };
  serviceVersions: {
    n8n: string;
    ollama: string;
    openwebui: string;
    qdrant: string;
    postgres: string;
    flowise: string;
    searxng: string;
    perplexity: string;
  };
}

function generateDockerCompose(config: DeploymentConfig): string {
  const services: string[] = [];
  const networks: string[] = ['ai-network'];

  if (config.selectedComponents['n8n']) {
    services.push(`
  n8n:
    image: n8nio/n8n:${config.serviceVersions.n8n}
    container_name: ai-n8n-1
    ports:
      - "${config.ports.n8n}:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=${config.security.n8n.username}
      - N8N_BASIC_AUTH_PASSWORD=${config.security.n8n.password}
    networks:
      - ai-network
    volumes:
      - n8n_data:/home/node/.n8n
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 4G`);
  }

  if (config.selectedComponents['Ollama']) {
    services.push(`
  ollama:
    image: ollama/ollama:${config.serviceVersions.ollama}
    container_name: ai-ollama-1
    ports:
      - "${config.ports.ollama}:11434"
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
    if (!config.selectedComponents['Ollama']) {
      throw new Error('OpenWebUI requires Ollama to be installed');
    }
    services.push(`
  openwebui:
    image: ghcr.io/open-webui/open-webui:${config.serviceVersions.openwebui}
    container_name: ai-openwebui-1
    ports:
      - "${config.ports.ollamaWeb}:8080"
    environment:
      - OLLAMA_API_BASE_URL=http://ollama:11434/api
    networks:
      - ai-network
    depends_on:
      - ollama
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G`);
  }

  if (config.selectedComponents['Qdrant']) {
    services.push(`
  qdrant:
    image: qdrant/qdrant:${config.serviceVersions.qdrant}
    container_name: ai-qdrant-1
    ports:
      - "${config.ports.qdrant}:6333"
    environment:
      - QDRANT_API_KEY=${config.security.qdrant.apiKey}
    networks:
      - ai-network
    volumes:
      - qdrant_data:/qdrant/storage
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 4G`);
  }

  if (config.selectedComponents['PostgreSQL']) {
    services.push(`
  postgres:
    image: postgres:${config.serviceVersions.postgres}
    container_name: ai-postgres-1
    ports:
      - "${config.ports.postgres}:5432"
    environment:
      - POSTGRES_USER=${config.security.postgres.username}
      - POSTGRES_PASSWORD=${config.security.postgres.password}
    networks:
      - ai-network
    volumes:
      - postgres_data:/var/lib/postgresql/data
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 2G`);
  }

  if (config.selectedComponents['Flowise']) {
    services.push(`
  flowise:
    image: flowiseai/flowise:${config.serviceVersions.flowise}
    container_name: ai-flowise-1
    ports:
      - "${config.ports.flowise}:3000"
    environment:
      - FLOWISE_USERNAME=${config.security.flowise.username}
      - FLOWISE_PASSWORD=${config.security.flowise.password}
    networks:
      - ai-network
    volumes:
      - flowise_data:/root/.flowise
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 4G`);
  }

  if (config.selectedComponents['SearXNG']) {
    services.push(`
  searxng:
    image: searxng/searxng:${config.serviceVersions.searxng}
    container_name: ai-searxng-1
    ports:
      - "${config.ports.searxng}:8080"
    environment:
      - SEARXNG_ADMIN_PASSWORD=${config.security.searxng.adminPassword}
    networks:
      - ai-network
    volumes:
      - searxng_data:/etc/searxng
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G`);
  }

  if (config.selectedComponents['Perplexity']) {
    if (!config.selectedComponents['SearXNG']) {
      throw new Error('Perplexity requires SearXNG to be installed');
    }
    if (!config.selectedComponents['Ollama']) {
      throw new Error('Perplexity requires Ollama to be installed');
    }
    if (!config.selectedComponents['Qdrant']) {
      throw new Error('Perplexity requires Qdrant to be installed');
    }
    services.push(`
  perplexity:
    image: ghcr.io/perplexity-ai/online-inference:${config.serviceVersions.perplexity}
    container_name: ai-perplexity-1
    ports:
      - "${config.ports.perplexity}:3000"
    environment:
      - SEARXNG_URL=http://searxng:8080
      - OLLAMA_API_URL=http://ollama:11434
      - QDRANT_URL=http://qdrant:6333
    networks:
      - ai-network
    depends_on:
      - searxng
      - ollama
      - qdrant
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 4G`);
  }

  const volumes = [
    'n8n_data',
    'ollama_data',
    'qdrant_data',
    'postgres_data',
    'flowise_data',
    'searxng_data'
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
N8N_PORT=${config.ports.n8n}
OLLAMA_PORT=${config.ports.ollama}
OLLAMA_WEB_PORT=${config.ports.ollamaWeb}
QDRANT_PORT=${config.ports.qdrant}
POSTGRES_PORT=${config.ports.postgres}
FLOWISE_PORT=${config.ports.flowise}
SEARXNG_PORT=${config.ports.searxng}
PERPLEXITY_PORT=${config.ports.perplexity}

# Resource Limits
CPU_CORES=${config.cpuCores}
RAM_GB=${config.ramGB}`;
}

function generateReadme(config: DeploymentConfig): string {
  const services = [];
  
  if (config.selectedComponents['n8n']) {
    services.push(`- n8n: http://localhost:${config.ports.n8n}`);
  }
  if (config.selectedComponents['Ollama']) {
    services.push(`- Ollama API: http://localhost:${config.ports.ollama}`);
  }
  if (config.selectedComponents['OpenWebUI']) {
    services.push(`- Ollama Web UI: http://localhost:${config.ports.ollamaWeb}`);
  }
  if (config.selectedComponents['Qdrant']) {
    services.push(`- Qdrant: http://localhost:${config.ports.qdrant}`);
  }
  if (config.selectedComponents['Flowise']) {
    services.push(`- Flowise: http://localhost:${config.ports.flowise}`);
  }
  if (config.selectedComponents['SearXNG']) {
    services.push(`- SearXNG: http://localhost:${config.ports.searxng}`);
  }
  if (config.selectedComponents['Perplexity']) {
    services.push(`- Perplexity: http://localhost:${config.ports.perplexity}`);
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
- Flowise: https://docs.flowiseai.com/
- SearXNG: https://docs.searxng.org/
- Perplexity: https://perplexity.ai/docs
`;

async function checkPortAvailable(port: number): Promise<boolean> {
  try {
    const { stdout } = await execAsync(`netstat -ano | findstr :${port}`);
    return !stdout.trim(); // Port is available if no output
  } catch (error) {
    // If command fails (no process using the port), port is available
    return true;
  }
}

async function validateConfiguration(config: DeploymentConfig): Promise<{ valid: boolean; errors: string[] }> {
  const errors: string[] = [];
  const usedPorts = new Set<number>();
  const requiredPorts: [number, string][] = [];

  // Collect required ports based on selected components
  if (config.selectedComponents['n8n']) {
    requiredPorts.push([config.ports.n8n, 'n8n']);
  }
  if (config.selectedComponents['Ollama']) {
    requiredPorts.push([config.ports.ollama, 'Ollama']);
  }
  if (config.selectedComponents['OpenWebUI']) {
    if (!config.selectedComponents['Ollama']) {
      errors.push('OpenWebUI requires Ollama to be installed');
    }
    requiredPorts.push([config.ports.ollamaWeb, 'OpenWebUI']);
  }
  if (config.selectedComponents['Qdrant']) {
    requiredPorts.push([config.ports.qdrant, 'Qdrant']);
  }
  if (config.selectedComponents['PostgreSQL']) {
    requiredPorts.push([config.ports.postgres, 'PostgreSQL']);
  }
  if (config.selectedComponents['Flowise']) {
    requiredPorts.push([config.ports.flowise, 'Flowise']);
  }
  if (config.selectedComponents['SearXNG']) {
    requiredPorts.push([config.ports.searxng, 'SearXNG']);
  }
  if (config.selectedComponents['Perplexity']) {
    if (!config.selectedComponents['SearXNG']) {
      errors.push('Perplexity requires SearXNG to be installed');
    }
    if (!config.selectedComponents['Ollama']) {
      errors.push('Perplexity requires Ollama to be installed');
    }
    if (!config.selectedComponents['Qdrant']) {
      errors.push('Perplexity requires Qdrant to be installed');
    }
    requiredPorts.push([config.ports.perplexity, 'Perplexity']);
  }

  // Check for port conflicts
  for (const [port, service] of requiredPorts) {
    if (usedPorts.has(port)) {
      errors.push(`Port conflict: ${port} is used by multiple services`);
    }
    usedPorts.add(port);

    const isAvailable = await checkPortAvailable(port);
    if (!isAvailable) {
      errors.push(`Port ${port} required by ${service} is already in use`);
    }
  }

  // Validate installation directory
  try {
    await fs.access(config.installDir);
    const stats = await fs.stat(config.installDir);
    if (!stats.isDirectory()) {
      errors.push('Installation path exists but is not a directory');
    }
  } catch {
    try {
      await fs.mkdir(config.installDir, { recursive: true });
    } catch (error) {
      errors.push(`Cannot create installation directory: ${error.message}`);
    }
  }

  // Validate Docker network
  try {
    const { stdout } = await execAsync('docker network ls');
    if (stdout.includes('ai-network')) {
      // Check if network is in use
      const { stdout: networkInfo } = await execAsync('docker network inspect ai-network');
      const networkData = JSON.parse(networkInfo);
      if (networkData[0].Containers && Object.keys(networkData[0].Containers).length > 0) {
        errors.push('Docker network "ai-network" is already in use by other containers');
      }
    }
  } catch (error) {
    errors.push('Failed to check Docker network status');
  }

  // Validate resource limits
  try {
    const { stdout } = await execAsync('docker info');
    const cpuMatch = stdout.match(/CPUs: (\d+)/);
    const memMatch = stdout.match(/Total Memory: (\d+(\.\d+)?)/);
    
    if (cpuMatch) {
      const totalCPUs = parseInt(cpuMatch[1]);
      if (config.cpuCores > totalCPUs) {
        errors.push(`Requested CPU cores (${config.cpuCores}) exceed available CPUs (${totalCPUs})`);
      }
    }
    
    if (memMatch) {
      const totalMemGB = parseFloat(memMatch[1]) / 1024; // Convert to GB
      if (config.ramGB > totalMemGB) {
        errors.push(`Requested RAM (${config.ramGB}GB) exceeds available memory (${totalMemGB.toFixed(1)}GB)`);
      }
    }
  } catch (error) {
    errors.push('Failed to validate system resources');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export default function systemCheckPlugin(): Plugin {
  return {
    name: 'system-check',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/system-check') {
          try {
            const dockerVersion = await execAsync('docker --version');
            const dockerComposeVersion = await execAsync('docker compose version');
            
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              docker: dockerVersion.stdout.trim(),
              dockerCompose: dockerComposeVersion.stdout.trim(),
              status: 'ok'
            }));
          } catch (error) {
            res.statusCode = 500;
            res.end(JSON.stringify({
              status: 'error',
              message: error.message
            }));
          }
        } else {
          next();
        }
      });

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

              // Validate configuration before proceeding
              const validation = await validateConfiguration(config);
              if (!validation.valid) {
                throw new Error(`Configuration validation failed:\n${validation.errors.join('\n')}`);
              }

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
