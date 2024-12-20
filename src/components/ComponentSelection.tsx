import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface ComponentSelectionProps {
  selectedComponents: Record<string, boolean>;
  setSelectedComponents: (components: Record<string, boolean>) => void;
}

const components = [
  {
    id: 'n8n',
    name: 'n8n',
    description: 'Workflow Automation Platform',
    required: false
  },
  {
    id: 'Ollama',
    name: 'Ollama',
    description: 'Local Large Language Model Runner',
    required: false
  },
  {
    id: 'OpenWebUI',
    name: 'Ollama Web UI',
    description: 'Web Interface for Ollama',
    required: false,
    dependencies: ['Ollama']
  },
  {
    id: 'Qdrant',
    name: 'Qdrant',
    description: 'Vector Database',
    required: false
  },
  {
    id: 'PostgreSQL',
    name: 'PostgreSQL',
    description: 'Relational Database',
    required: false
  },
  {
    id: 'Flowise',
    name: 'Flowise',
    description: 'LLM Flow Builder',
    required: false
  },
  {
    id: 'SearXNG',
    name: 'SearXNG',
    description: 'Privacy-focused Search Engine',
    required: false
  },
  {
    id: 'Perplexity',
    name: 'Perplexity',
    description: 'AI Assistant Interface',
    required: false,
    dependencies: ['Ollama', 'SearXNG', 'Qdrant']
  }
];

export const ComponentSelection: React.FC<ComponentSelectionProps> = ({
  selectedComponents,
  setSelectedComponents
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

  const isDisabled = (componentId: string) => {
    const component = components.find(c => c.id === componentId);
    if (!component) return false;

    // If this component has dependencies, check if they're all selected
    return component.dependencies?.some(dep => !selectedComponents[dep]) ?? false;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {components.map((component) => (
          <div
            key={component.id}
            className={`p-4 border rounded-lg ${
              isDisabled(component.id)
                ? 'bg-gray-100 cursor-not-allowed'
                : 'bg-white hover:shadow-md cursor-pointer'
            }`}
            onClick={() => !isDisabled(component.id) && handleComponentToggle(component.id)}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{component.name}</h3>
                <p className="text-sm text-gray-500">{component.description}</p>
                {component.dependencies && (
                  <p className="text-xs text-gray-400 mt-1">
                    Requires: {component.dependencies.join(', ')}
                  </p>
                )}
              </div>
              <div className="ml-4">
                {selectedComponents[component.id] ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <XCircle className="w-6 h-6 text-gray-300" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
