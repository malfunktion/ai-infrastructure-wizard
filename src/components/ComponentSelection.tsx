import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface ComponentSelectionProps {
  selectedComponents: Record<string, boolean>;
  setSelectedComponents: (components: Record<string, boolean>) => void;
  config: {
    ports: Record<string, number>;
  };
  setConfig: (config: any) => void;
}

const components = [
  {
    id: 'n8n',
    name: 'n8n',
    description: 'Workflow Automation Platform',
    required: false,
    defaultPort: 5678,
    portKey: 'n8n'
  },
  {
    id: 'Ollama',
    name: 'Ollama',
    description: 'Local Large Language Model Runner',
    required: false,
    defaultPort: 11434,
    portKey: 'ollama'
  },
  {
    id: 'OpenWebUI',
    name: 'Ollama Web UI',
    description: 'Web Interface for Ollama',
    required: false,
    dependencies: ['Ollama'],
    defaultPort: 3000,
    portKey: 'ollamaWeb'
  },
  {
    id: 'Qdrant',
    name: 'Qdrant',
    description: 'Vector Database',
    required: false,
    defaultPort: 6333,
    portKey: 'qdrant'
  },
  {
    id: 'PostgreSQL',
    name: 'PostgreSQL',
    description: 'Relational Database',
    required: false,
    defaultPort: 5432,
    portKey: 'postgres'
  },
  {
    id: 'Flowise',
    name: 'Flowise',
    description: 'LLM Flow Builder',
    required: false,
    defaultPort: 3001,
    portKey: 'flowise'
  },
  {
    id: 'SearXNG',
    name: 'SearXNG',
    description: 'Privacy-focused Search Engine',
    required: false,
    defaultPort: 8080,
    portKey: 'searxng'
  },
  {
    id: 'Perplexity',
    name: 'Perplexity',
    description: 'AI Assistant Interface',
    required: false,
    dependencies: ['Ollama', 'SearXNG', 'Qdrant'],
    defaultPort: 3002,
    portKey: 'perplexity'
  }
];

export const ComponentSelection: React.FC<ComponentSelectionProps> = ({
  selectedComponents,
  setSelectedComponents,
  config,
  setConfig
}) => {
  const handleComponentToggle = (componentId: string) => {
    const component = components.find(c => c.id === componentId);
    if (!component) return;

    const newSelectedComponents = { ...selectedComponents };

    // If we're enabling a component
    if (!selectedComponents[componentId]) {
      // Enable the component and its dependencies
      newSelectedComponents[componentId] = true;
      component.dependencies?.forEach(dep => {
        newSelectedComponents[dep] = true;
      });
    } else {
      // If we're disabling a component
      newSelectedComponents[componentId] = false;
      // Find and disable components that depend on this one
      components.forEach(c => {
        if (c.dependencies?.includes(componentId)) {
          newSelectedComponents[c.id] = false;
        }
      });
    }

    setSelectedComponents(newSelectedComponents);
  };

  const handlePortChange = (portKey: string, value: string) => {
    const port = parseInt(value);
    if (!isNaN(port) && port > 0) {
      setConfig({
        ...config,
        ports: {
          ...config.ports,
          [portKey]: port
        }
      });
    }
  };

  const isDisabled = (componentId: string) => {
    const component = components.find(c => c.id === componentId);
    if (!component) return false;

    // If this component has dependencies, check if they're all selected
    return component.dependencies?.some(dep => !selectedComponents[dep]) ?? false;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {components.map((component) => (
          <div
            key={component.id}
            className={`p-4 border rounded-lg ${
              isDisabled(component.id)
                ? 'bg-gray-100'
                : 'bg-white hover:shadow-md'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-grow cursor-pointer" onClick={() => !isDisabled(component.id) && handleComponentToggle(component.id)}>
                <div className="flex items-center">
                  <h3 className="font-medium">{component.name}</h3>
                  <div className="ml-4">
                    {selectedComponents[component.id] ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-300" />
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-500">{component.description}</p>
                {component.dependencies && (
                  <p className="text-xs text-gray-400 mt-1">
                    Requires: {component.dependencies.join(', ')}
                  </p>
                )}
              </div>
              
              {selectedComponents[component.id] && (
                <div className="ml-4 flex items-center">
                  <label className="text-sm text-gray-600 mr-2">Port:</label>
                  <input
                    type="number"
                    value={config.ports[component.portKey]}
                    onChange={(e) => handlePortChange(component.portKey, e.target.value)}
                    className="w-24 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    min="1"
                    max="65535"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800">Port Configuration Tips:</h4>
        <ul className="mt-2 text-sm text-blue-600 list-disc list-inside">
          <li>Each service must use a unique port</li>
          <li>Ports must be between 1 and 65535</li>
          <li>Some ports may require administrator privileges (below 1024)</li>
          <li>Make sure selected ports are not in use by other applications</li>
        </ul>
      </div>
    </div>
  );
};
