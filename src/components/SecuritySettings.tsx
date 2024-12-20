import React from 'react';

interface SecuritySettingsProps {
  config: {
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
    selectedComponents: Record<string, boolean>;
  };
  setConfig: (config: any) => void;
}

export const SecuritySettings: React.FC<SecuritySettingsProps> = ({
  config,
  setConfig,
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
          ...config.security[service],
          [field]: value,
        },
      },
    });
  };

  return (
    <div className="space-y-8 p-6">
      <div className="space-y-6">
        {config.selectedComponents['n8n'] && (
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">n8n Credentials</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  value={config.security.n8n.username}
                  onChange={(e) => handleSecurityChange('n8n', 'username', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="n8n admin username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  value={config.security.n8n.password}
                  onChange={(e) => handleSecurityChange('n8n', 'password', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="n8n admin password"
                />
              </div>
            </div>
          </div>
        )}

        {config.selectedComponents['PostgreSQL'] && (
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">PostgreSQL Credentials</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  value={config.security.postgres.username}
                  onChange={(e) => handleSecurityChange('postgres', 'username', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="PostgreSQL admin username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  value={config.security.postgres.password}
                  onChange={(e) => handleSecurityChange('postgres', 'password', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="PostgreSQL admin password"
                />
              </div>
            </div>
          </div>
        )}

        {config.selectedComponents['Qdrant'] && (
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">Qdrant API Key</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">API Key</label>
              <input
                type="password"
                value={config.security.qdrant.apiKey}
                onChange={(e) => handleSecurityChange('qdrant', 'apiKey', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Qdrant API key"
              />
            </div>
          </div>
        )}

        {config.selectedComponents['Flowise'] && (
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">Flowise Credentials</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  value={config.security.flowise.username}
                  onChange={(e) => handleSecurityChange('flowise', 'username', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Flowise admin username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  value={config.security.flowise.password}
                  onChange={(e) => handleSecurityChange('flowise', 'password', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Flowise admin password"
                />
              </div>
            </div>
          </div>
        )}

        {config.selectedComponents['SearXNG'] && (
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">SearXNG Admin Password</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">Admin Password</label>
              <input
                type="password"
                value={config.security.searxng.adminPassword}
                onChange={(e) => handleSecurityChange('searxng', 'adminPassword', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="SearXNG admin password"
              />
            </div>
          </div>
        )}
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Security Tips:</h4>
        <ul className="text-sm text-blue-600 list-disc list-inside space-y-1">
          <li>Use strong, unique passwords for each service</li>
          <li>Store credentials securely - they will be needed for service management</li>
          <li>Some services may require additional security configuration after setup</li>
          <li>Consider using a password manager to store these credentials</li>
        </ul>
      </div>
    </div>
  );
};
