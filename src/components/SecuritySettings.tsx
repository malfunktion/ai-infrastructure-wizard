import React from 'react';

interface SecuritySettingsProps {
  config: {
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
  setConfig: (config: any) => void;
  selectedComponents: Record<string, boolean>;
}

export const SecuritySettings: React.FC<SecuritySettingsProps> = ({
  config,
  setConfig,
  selectedComponents,
}) => {
  const handleSecurityChange = (
    service: string,
    field: string,
    value: string
  ) => {
    setConfig({
      ...config,
      security: {
        ...config.security,
        [service]: {
          ...config.security[service as keyof typeof config.security],
          [field]: value,
        },
      },
    });
  };

  return (
    <div className="security-settings">
      <h2>Security Settings</h2>
      <div className="security-form">
        {selectedComponents['n8n'] && (
          <div className="security-section">
            <h3>n8n</h3>
            <div className="security-fields">
              <div className="field-group">
                <label>Username:</label>
                <input
                  type="text"
                  value={config.security.n8n.username}
                  onChange={(e) => handleSecurityChange('n8n', 'username', e.target.value)}
                  className="security-input"
                />
              </div>
              <div className="field-group">
                <label>Password:</label>
                <input
                  type="password"
                  value={config.security.n8n.password}
                  onChange={(e) => handleSecurityChange('n8n', 'password', e.target.value)}
                  className="security-input"
                />
              </div>
              <div className="field-group">
                <label>Encryption Key:</label>
                <input
                  type="password"
                  value={config.security.n8n.encryptionKey}
                  onChange={(e) => handleSecurityChange('n8n', 'encryptionKey', e.target.value)}
                  className="security-input"
                  placeholder="N8N_ENCRYPTION_KEY"
                />
                <div className="field-description">
                  Used to encrypt sensitive data in workflows
                </div>
              </div>
              <div className="field-group">
                <label>JWT Secret:</label>
                <input
                  type="password"
                  value={config.security.n8n.jwtSecret}
                  onChange={(e) => handleSecurityChange('n8n', 'jwtSecret', e.target.value)}
                  className="security-input"
                  placeholder="N8N_USER_MANAGEMENT_JWT_SECRET"
                />
                <div className="field-description">
                  Used for user session management
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedComponents['postgres'] && (
          <div className="security-section">
            <h3>PostgreSQL</h3>
            <div className="security-fields">
              <div className="field-group">
                <label>Username:</label>
                <input
                  type="text"
                  value={config.security.postgres.username}
                  onChange={(e) => handleSecurityChange('postgres', 'username', e.target.value)}
                  className="security-input"
                  placeholder="POSTGRES_USER"
                />
              </div>
              <div className="field-group">
                <label>Password:</label>
                <input
                  type="password"
                  value={config.security.postgres.password}
                  onChange={(e) => handleSecurityChange('postgres', 'password', e.target.value)}
                  className="security-input"
                  placeholder="POSTGRES_PASSWORD"
                />
              </div>
              <div className="field-group">
                <label>Database:</label>
                <input
                  type="text"
                  value={config.security.postgres.database}
                  onChange={(e) => handleSecurityChange('postgres', 'database', e.target.value)}
                  className="security-input"
                  placeholder="POSTGRES_DB"
                />
                <div className="field-description">
                  Default database that will be created during initialization
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedComponents['qdrant'] && (
          <div className="security-section">
            <h3>Qdrant</h3>
            <div className="security-fields">
              <div className="field-group">
                <label>API Key:</label>
                <input
                  type="password"
                  value={config.security.qdrant.apiKey}
                  onChange={(e) => handleSecurityChange('qdrant', 'apiKey', e.target.value)}
                  className="security-input"
                  placeholder="QDRANT_API_KEY"
                />
                <div className="field-description">
                  API key for Qdrant authentication (optional for local setups)
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedComponents['flowise'] && (
          <div className="security-section">
            <h3>Flowise</h3>
            <div className="security-fields">
              <div className="field-group">
                <label>Username:</label>
                <input
                  type="text"
                  value={config.security.flowise.username}
                  onChange={(e) => handleSecurityChange('flowise', 'username', e.target.value)}
                  className="security-input"
                  placeholder="FLOWISE_USERNAME"
                />
                <div className="field-description">
                  Username for accessing the Flowise dashboard
                </div>
              </div>
              <div className="field-group">
                <label>Password:</label>
                <input
                  type="password"
                  value={config.security.flowise.password}
                  onChange={(e) => handleSecurityChange('flowise', 'password', e.target.value)}
                  className="security-input"
                  placeholder="FLOWISE_PASSWORD"
                />
                <div className="field-description">
                  Password for accessing the Flowise dashboard
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
