import React, { useState, useEffect } from 'react';

interface ReviewProps {
  config: {
    installDir: string;
    ports: Record<string, number>;
    security: {
      n8n: {
        username: string;
        password: string;
        encryptionKey: string;
        jwtSecret: string;
      };
      postgres: {
        username: string;
        password: string;
        database: string;
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
  };
  selectedComponents: Record<string, boolean>;
}

export const Review: React.FC<ReviewProps> = ({
  config,
  selectedComponents,
}) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [deploymentLogs, setDeploymentLogs] = useState<string[]>([]);
  const [shouldStartContainers, setShouldStartContainers] = useState(true);

  useEffect(() => {
    const cleanup = window.electronAPI.onDeploymentLog((event, message) => {
      setDeploymentLogs(logs => [...logs, message]);
    });
    return cleanup;
  }, []);

  const addLog = (message: string) => {
    setDeploymentLogs(prev => [...prev, message]);
  };

  const generateDockerCompose = () => {
    let compose = `version: '3.8'\n\nservices:\n`;
    
    if (selectedComponents['n8n']) {
      compose += `  n8n:\n`;
      compose += `    image: n8nio/n8n\n`;
      compose += `    ports:\n`;
      compose += `      - "${config.ports.n8n}:5678"\n`;
      compose += `    environment:\n`;
      compose += `      - N8N_BASIC_AUTH_ACTIVE=true\n`;
      compose += `      - N8N_BASIC_AUTH_USER=${config.security.n8n.username}\n`;
      compose += `      - N8N_BASIC_AUTH_PASSWORD=${config.security.n8n.password}\n`;
      compose += `      - N8N_ENCRYPTION_KEY=${config.security.n8n.encryptionKey}\n`;
      compose += `      - N8N_USER_MANAGEMENT_JWT_SECRET=${config.security.n8n.jwtSecret}\n`;
      compose += `    volumes:\n`;
      compose += `      - ./n8n_data:/home/node/.n8n\n\n`;
    }

    if (selectedComponents['postgres']) {
      compose += `  postgres:\n`;
      compose += `    image: postgres:latest\n`;
      compose += `    ports:\n`;
      compose += `      - "${config.ports.postgres}:5432"\n`;
      compose += `    environment:\n`;
      compose += `      - POSTGRES_USER=${config.security.postgres.username}\n`;
      compose += `      - POSTGRES_PASSWORD=${config.security.postgres.password}\n`;
      compose += `      - POSTGRES_DB=${config.security.postgres.database}\n`;
      compose += `    volumes:\n`;
      compose += `      - ./postgres_data:/var/lib/postgresql/data\n\n`;
    }

    if (selectedComponents['qdrant']) {
      compose += `  qdrant:\n`;
      compose += `    image: qdrant/qdrant\n`;
      compose += `    ports:\n`;
      compose += `      - "${config.ports.qdrant}:6333"\n`;
      if (config.security.qdrant.apiKey) {
        compose += `    environment:\n`;
        compose += `      - QDRANT_API_KEY=${config.security.qdrant.apiKey}\n`;
      }
      compose += `    volumes:\n`;
      compose += `      - ./qdrant_data:/qdrant/storage\n\n`;
    }

    if (selectedComponents['flowise']) {
      compose += `  flowise:\n`;
      compose += `    image: flowiseai/flowise\n`;
      compose += `    ports:\n`;
      compose += `      - "${config.ports.flowise}:3000"\n`;
      compose += `    environment:\n`;
      compose += `      - FLOWISE_USERNAME=${config.security.flowise.username}\n`;
      compose += `      - FLOWISE_PASSWORD=${config.security.flowise.password}\n`;
      compose += `    volumes:\n`;
      compose += `      - ./flowise_data:/root/.flowise\n\n`;
    }

    if (selectedComponents['searxng']) {
      compose += `  searxng:\n`;
      compose += `    image: searxng/searxng\n`;
      compose += `    ports:\n`;
      compose += `      - "${config.ports.searxng}:8080"\n`;
      compose += `    environment:\n`;
      compose += `      - SEARXNG_ADMIN_PASSWORD=${config.security.searxng.adminPassword}\n`;
      compose += `    volumes:\n`;
      compose += `      - ./searxng_data:/etc/searxng\n\n`;
    }

    return compose;
  };

  const handleDeploy = async () => {
    setIsDeploying(true);
    setDeploymentLogs([]);
    setDeploymentStatus('');

    try {
      // Create installation directory if it doesn't exist
      addLog('Creating installation directory...');
      const createDirResponse = await fetch('/api/create-dir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dir: config.installDir })
      });

      if (!createDirResponse.ok) throw new Error('Failed to create directory');

      // Generate and write docker-compose.yml
      addLog('Generating docker-compose.yml...');
      const dockerComposeContent = generateDockerCompose();
      const writeFileResponse = await fetch('/api/write-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: `${config.installDir}/docker-compose.yml`,
          content: dockerComposeContent
        })
      });

      if (!writeFileResponse.ok) throw new Error('Failed to write docker-compose.yml');

      // Start Docker containers if requested
      if (shouldStartContainers) {
        addLog('Starting Docker containers...');
        const dockerResponse = await fetch('/api/docker-compose-up', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dir: config.installDir })
        });

        if (!dockerResponse.ok) throw new Error('Failed to start Docker containers');
      }

      setDeploymentStatus('success');
    } catch (error) {
      console.error('Deployment error:', error);
      setDeploymentStatus('error');
      setDeploymentLogs(logs => [...logs, `Error: ${error.message}`]);
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="review-step">
      <h2>Review Configuration</h2>
      
      <div className="review-section">
        <h3>Installation Directory</h3>
        <p>{config.installDir}</p>
      </div>

      <div className="review-section">
        <h3>Selected Components</h3>
        <ul>
          {Object.entries(selectedComponents)
            .filter(([_, isSelected]) => isSelected)
            .map(([component]) => (
              <li key={component}>
                {component} (Port: {config.ports[component]})
              </li>
            ))}
        </ul>
      </div>

      <div className="review-section">
        <h3>Security Settings</h3>
        {selectedComponents['n8n'] && (
          <div className="security-review">
            <h4>n8n</h4>
            <p>Username: {config.security.n8n.username}</p>
            <p>Password: ****** (hidden)</p>
            <p>Encryption Key: ****** (hidden)</p>
            <p>JWT Secret: ****** (hidden)</p>
          </div>
        )}

        {selectedComponents['postgres'] && (
          <div className="security-review">
            <h4>PostgreSQL</h4>
            <p>Username: {config.security.postgres.username}</p>
            <p>Password: ****** (hidden)</p>
            <p>Database: {config.security.postgres.database}</p>
          </div>
        )}

        {selectedComponents['qdrant'] && (
          <div className="security-review">
            <h4>Qdrant</h4>
            <p>API Key: {config.security.qdrant.apiKey ? '****** (hidden)' : 'Not set (optional)'}</p>
          </div>
        )}

        {selectedComponents['flowise'] && (
          <div className="security-review">
            <h4>Flowise</h4>
            <p>Username: {config.security.flowise.username}</p>
            <p>Password: ****** (hidden)</p>
          </div>
        )}

        {selectedComponents['searxng'] && (
          <div className="security-review">
            <h4>SearXNG</h4>
            <p>Admin Password: ****** (hidden)</p>
          </div>
        )}
      </div>

      <div className="review-section">
        <h3>Deployment Options</h3>
        <label className="deploy-option">
          <input
            type="checkbox"
            checked={shouldStartContainers}
            onChange={(e) => setShouldStartContainers(e.target.checked)}
          />
          Start Docker containers after generating configuration
        </label>
        <p className="deploy-description">
          If unchecked, only the configuration files will be generated without starting the containers.
        </p>
      </div>

      {deploymentLogs.length > 0 && (
        <div className="deployment-logs">
          {deploymentLogs.map((log, index) => (
            <div key={index} className="log-line">{log}</div>
          ))}
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
      {deploymentStatus && <div className="success-message">{deploymentStatus}</div>}

      <div className="deploy-container">
        <button
          onClick={handleDeploy}
          className="deploy-button"
          disabled={isDeploying}
        >
          {isDeploying ? 'Deploying...' : 'Deploy'}
        </button>
      </div>
    </div>
  );
};
