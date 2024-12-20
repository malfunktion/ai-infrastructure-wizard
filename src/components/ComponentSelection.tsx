interface SelectedComponents {
  'n8n': boolean;
  'ollama': boolean;
  'openwebui': boolean;
  'qdrant': boolean;
  'postgres': boolean;
  'flowise': boolean;
  'searxng': boolean;
  'perplexity': boolean;
  [key: string]: boolean;
}

interface ServiceVersions {
  n8n: string;
  ollama: string;
  openwebui: string;
  qdrant: string;
  postgres: string;
  flowise: string;
  searxng: string;
  perplexity: string;
  [key: string]: string;
}

interface Component {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface Props {
  selectedComponents: SelectedComponents;
  setSelectedComponents: (components: SelectedComponents) => void;
  config: {
    installDir: string;
    ports: Record<string, number>;
  };
  setConfig: (config: any) => void;
  serviceVersions: ServiceVersions;
  components: Component[];
}

export function ComponentSelection({
  selectedComponents,
  setSelectedComponents,
  config,
  setConfig,
  serviceVersions,
  components
}: Props) {
  const handleComponentChange = (componentId: string) => {
    setSelectedComponents({
      ...selectedComponents,
      [componentId]: !selectedComponents[componentId]
    });
  };

  const handleSelectAll = () => {
    const allSelected = Object.values(selectedComponents).every(selected => selected);
    const newSelectedComponents = { ...selectedComponents };
    components.forEach(component => {
      newSelectedComponents[component.id] = !allSelected;
    });
    setSelectedComponents(newSelectedComponents);
  };

  const handlePortChange = (serviceName: string, value: string) => {
    const port = parseInt(value);
    if (!isNaN(port)) {
      setConfig({
        ...config,
        ports: {
          ...config.ports,
          [serviceName]: port
        }
      });
    }
  };

  const allSelected = Object.values(selectedComponents).every(selected => selected);

  return (
    <div className="component-selection">
      <div className="component-header-row">
        <h2>Select Components to Install</h2>
        <label className="select-all-label">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={handleSelectAll}
          />
          <span>Select All</span>
        </label>
      </div>
      <div className="component-grid">
        {components.map((component) => (
          <div key={component.id} className="component-card">
            <div className="component-header">
              <input
                type="checkbox"
                checked={selectedComponents[component.id]}
                onChange={() => handleComponentChange(component.id)}
              />
              <div>
                <div className="component-name">
                  {component.icon} {component.name}
                </div>
                <div className="component-description">{component.description}</div>
                <div className="version-tag">
                  Version: {serviceVersions[component.id]}
                </div>
                {selectedComponents[component.id] && (
                  <div className="port-field">
                    <label>
                      Port:
                      <input
                        type="number"
                        value={config.ports[component.id]}
                        onChange={(e) => handlePortChange(component.id, e.target.value)}
                        className="port-input"
                        min="1"
                        max="65535"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
