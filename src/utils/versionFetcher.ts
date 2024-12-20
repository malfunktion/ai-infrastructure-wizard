interface GitHubRelease {
  tag_name: string;
  published_at: string;
}

interface DockerImage {
  name: string;
  tag: string;
}

const DOCKER_IMAGES: DockerImage[] = [
  { name: 'postgres', tag: 'latest' },
  { name: 'flowise/flowise', tag: 'latest' },
  { name: 'qdrant/qdrant', tag: 'latest' }
];

// Fetch GitHub releases with fallback to default branch
async function fetchGitHubRelease(repo: string): Promise<string> {
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}/releases/latest`);
    if (!response.ok) {
      // If no releases found, try to get the default branch's latest commit
      const repoResponse = await fetch(`https://api.github.com/repos/${repo}`);
      if (!repoResponse.ok) {
        return 'latest';
      }
      const repoData = await repoResponse.json();
      return repoData.default_branch || 'latest';
    }
    const data: GitHubRelease = await response.json();
    return data.tag_name.replace('v', '');
  } catch (error) {
    console.error(`Error fetching release for ${repo}:`, error);
    return 'latest';
  }
}

export async function fetchServiceVersions() {
  // Initialize all versions to 'latest' by default
  const versions = {
    n8n: 'latest',
    ollama: 'latest',
    openwebui: 'latest',
    qdrant: 'latest',
    postgres: 'latest',
    flowise: 'latest',
    searxng: 'latest',
    perplexity: 'latest'
  };

  try {
    // Only fetch versions from GitHub repositories
    // Docker images will use 'latest' tag for simplicity and reliability
    const [ollamaVersion, openwebuiVersion, perplexityVersion] = await Promise.all([
      fetchGitHubRelease('ollama/ollama'),
      fetchGitHubRelease('open-webui/open-webui'),
      fetchGitHubRelease('ItzCrazyKns/Perplexica')
    ]);

    versions.ollama = ollamaVersion;
    versions.openwebui = openwebuiVersion;
    versions.perplexity = perplexityVersion;
  } catch (error) {
    console.error('Error fetching service versions:', error);
  }

  return versions;
}

export async function fetchLatestVersions(): Promise<DockerImage[]> {
  try {
    const updatedImages = await Promise.all(
      DOCKER_IMAGES.map(async (image) => {
        try {
          const response = await fetch(`https://hub.docker.com/v2/repositories/${image.name}/tags`);
          if (!response.ok) {
            console.error(`Failed to fetch version for ${image.name}:`, response.statusText);
            return image;
          }

          const data = await response.json();
          const latestTag = data.results?.[0]?.name;
          
          return {
            name: image.name,
            tag: latestTag || image.tag
          };
        } catch (error) {
          console.error(`Error fetching version for ${image.name}:`, error);
          return image;
        }
      })
    );

    return updatedImages;
  } catch (error) {
    console.error('Error fetching Docker image versions:', error);
    return DOCKER_IMAGES;
  }
}

export function generateDockerCompose(config: {
  installDir: string;
  components: {
    postgres: boolean;
    flowise: boolean;
    qdrant: boolean;
  };
  security: {
    postgres: {
      username: string;
      password: string;
      database: string;
    };
    flowise: {
      username: string;
      password: string;
    };
    qdrant: {
      apiKey?: string;
    };
  };
}): string {
  const services: string[] = [];
  
  if (config.components.postgres) {
    services.push(`
  postgres:
    image: postgres:latest
    environment:
      POSTGRES_USER: ${config.security.postgres.username}
      POSTGRES_PASSWORD: ${config.security.postgres.password}
      POSTGRES_DB: ${config.security.postgres.database}
    volumes:
      - ./data/postgres:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped`);
  }

  if (config.components.flowise) {
    services.push(`
  flowise:
    image: flowise/flowise:latest
    environment:
      - FLOWISE_USERNAME=${config.security.flowise.username}
      - FLOWISE_PASSWORD=${config.security.flowise.password}
    volumes:
      - ./data/flowise:/root/.flowise
    ports:
      - "3000:3000"
    restart: unless-stopped`);
  }

  if (config.components.qdrant) {
    const qdrantEnv = config.security.qdrant.apiKey 
      ? `\n    environment:\n      - QDRANT_API_KEY=${config.security.qdrant.apiKey}`
      : '';

    services.push(`
  qdrant:
    image: qdrant/qdrant:latest${qdrantEnv}
    volumes:
      - ./data/qdrant:/qdrant/storage
    ports:
      - "6333:6333"
      - "6334:6334"
    restart: unless-stopped`);
  }

  return `version: '3.8'

services:${services.join('\n')}

networks:
  default:
    name: ai-infrastructure
`;
}
