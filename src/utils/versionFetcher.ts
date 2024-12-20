interface DockerTag {
  name: string;
  full_size: number;
  last_updated: string;
}

interface GitHubRelease {
  tag_name: string;
  published_at: string;
}

async function fetchDockerHubTags(repo: string): Promise<string> {
  try {
    const response = await fetch(`https://hub.docker.com/v2/repositories/${repo}/tags?page_size=100`);
    const data = await response.json();
    const tags: DockerTag[] = data.results;
    
    // Filter out test/rc versions and sort by date
    const stableTags = tags
      .filter(tag => !tag.name.includes('rc') && !tag.name.includes('test') && !tag.name.includes('dev'))
      .sort((a, b) => new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime());
    
    return stableTags[0]?.name || 'latest';
  } catch (error) {
    console.error(`Error fetching tags for ${repo}:`, error);
    return 'latest';
  }
}

async function fetchGitHubRelease(repo: string): Promise<string> {
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}/releases/latest`);
    const data: GitHubRelease = await response.json();
    return data.tag_name.replace('v', '');
  } catch (error) {
    console.error(`Error fetching release for ${repo}:`, error);
    return 'latest';
  }
}

export async function fetchServiceVersions() {
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
    // Fetch versions in parallel
    const [
      n8nVersion,
      ollamaVersion,
      openwebuiVersion,
      qdrantVersion,
      postgresVersion,
      flowiseVersion,
      searxngVersion,
      perplexityVersion
    ] = await Promise.all([
      fetchDockerHubTags('n8nio/n8n'),
      fetchGitHubRelease('ollama/ollama'),
      fetchGitHubRelease('open-webui/open-webui'),
      fetchDockerHubTags('qdrant/qdrant'),
      fetchDockerHubTags('library/postgres'),
      fetchDockerHubTags('flowiseai/flowise'),
      fetchDockerHubTags('searxng/searxng'),
      fetchGitHubRelease('perplexity-ai/online-inference')
    ]);

    versions.n8n = n8nVersion;
    versions.ollama = ollamaVersion;
    versions.openwebui = openwebuiVersion;
    versions.qdrant = qdrantVersion;
    versions.postgres = postgresVersion;
    versions.flowise = flowiseVersion;
    versions.searxng = searxngVersion;
    versions.perplexity = perplexityVersion;
  } catch (error) {
    console.error('Error fetching service versions:', error);
  }

  return versions;
}
