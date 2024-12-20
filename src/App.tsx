import React, { useState, useEffect } from 'react';
import { Terminal, Box, Shield, Cog, Server, CheckCircle, XCircle } from 'lucide-react';
import { WizardStep } from './components/WizardStep';
import { NavigationButtons } from './components/NavigationButtons';
import { StepIndicator } from './components/StepIndicator';
import { Step } from './types/wizard';

const steps: Step[] = [
  {
    id: 1,
    title: 'Welcome to Self-hosted AI Starter Kit',
    description: 'Get started with your AI infrastructure setup'
  },
  {
    id: 2,
    title: 'System Requirements',
    description: 'Verify your system meets all requirements'
  },
  {
    id: 3,
    title: 'Component Selection',
    description: 'Choose the components to install'
  },
  {
    id: 4,
    title: 'Configuration',
    description: 'Configure installation settings'
  },
  {
    id: 5,
    title: 'Resource Allocation',
    description: 'Allocate system resources'
  },
  {
    id: 6,
    title: 'Security Settings',
    description: 'Set up security configurations'
  },
  {
    id: 7,
    title: 'Review & Deploy',
    description: 'Review your choices and start deployment'
  }
];

interface ServiceLink {
  name: string;
  url: string;
  description: string;
}

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [config, setConfig] = useState({
    installDir: 'C:\\AI',
    ports: {
      n8n: 5678,
      ollama: 11434,
      ollamaWeb: 3000,
      qdrant: 6333,
      postgres: 5432,
      flowise: 3001,
      searxng: 8080
    },
    cpuCores: 4,
    ramGB: 8,
    adminUsername: '',
    adminPassword: '',
  });
  const [selectedComponents, setSelectedComponents] = useState({
    'n8n': true,
    'Ollama': true,
    'OpenWebUI': true,
    'Qdrant': true,
    'PostgreSQL': true,
    'Flowise': false,
    'SearXNG': true,
  });
  const [serviceLinks, setServiceLinks] = useState<ServiceLink[]>([]);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<string | null>(null);
  const [launchAfterDeploy, setLaunchAfterDeploy] = useState(true);
  const [servicesStatus, setServicesStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (servicesStatus && Object.keys(servicesStatus).length > 0) {
      const links: ServiceLink[] = [];
      if (servicesStatus['n8n']) {
        links.push({
          name: 'n8n',
          url: `http://localhost:${config.ports.n8n}`,
          description: 'Workflow Automation Platform'
        });
      }
      if (servicesStatus['Ollama']) {
        links.push({
          name: 'Ollama API',
          url: `http://localhost:${config.ports.ollama}`,
          description: 'Local LLM API'
        });
      }
      if (servicesStatus['OpenWebUI']) {
        links.push({
          name: 'Ollama Web UI',
          url: `http://localhost:${config.ports.ollamaWeb}`,
          description: 'Ollama Web Interface'
        });
      }
      if (servicesStatus['Qdrant']) {
        links.push({
          name: 'Qdrant',
          url: `http://localhost:${config.ports.qdrant}`,
          description: 'Vector Database'
        });
      }
      if (servicesStatus['Flowise']) {
        links.push({
          name: 'Flowise',
          url: `http://localhost:${config.ports.flowise}`,
          description: 'LLM Flow Builder'
        });
      }
      if (servicesStatus['SearXNG']) {
        links.push({
          name: 'SearXNG',
          url: `http://localhost:${config.ports.searxng}`,
          description: 'Decentralized Search Engine'
        });
      }
      setServiceLinks(links);
    }
  }, [servicesStatus, config]);

  const PortConfiguration = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Port Configuration</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {selectedComponents['n8n'] && (
          <div>
            <label className="block text-sm font-medium text-gray-700">n8n Port</label>
            <input
              type="number"
              value={config.ports.n8n}
              onChange={(e) => setConfig({
                ...config,
                ports: { ...config.ports, n8n: parseInt(e.target.value) }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        )}
        
        {selectedComponents['Ollama'] && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Ollama API Port</label>
            <input
              type="number"
              value={config.ports.ollama}
              onChange={(e) => setConfig({
                ...config,
                ports: { ...config.ports, ollama: parseInt(e.target.value) }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        )}

        {selectedComponents['OpenWebUI'] && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Ollama Web UI Port</label>
            <input
              type="number"
              value={config.ports.ollamaWeb}
              onChange={(e) => setConfig({
                ...config,
                ports: { ...config.ports, ollamaWeb: parseInt(e.target.value) }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        )}

        {selectedComponents['Qdrant'] && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Qdrant Port</label>
            <input
              type="number"
              value={config.ports.qdrant}
              onChange={(e) => setConfig({
                ...config,
                ports: { ...config.ports, qdrant: parseInt(e.target.value) }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        )}

        {selectedComponents['PostgreSQL'] && (
          <div>
            <label className="block text-sm font-medium text-gray-700">PostgreSQL Port</label>
            <input
              type="number"
              value={config.ports.postgres}
              onChange={(e) => setConfig({
                ...config,
                ports: { ...config.ports, postgres: parseInt(e.target.value) }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        )}

        {selectedComponents['Flowise'] && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Flowise Port</label>
            <input
              type="number"
              value={config.ports.flowise}
              onChange={(e) => setConfig({
                ...config,
                ports: { ...config.ports, flowise: parseInt(e.target.value) }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        )}

        {selectedComponents['SearXNG'] && (
          <div>
            <label className="block text-sm font-medium text-gray-700">SearXNG Port</label>
            <input
              type="number"
              value={config.ports.searxng}
              onChange={(e) => setConfig({
                ...config,
                ports: { ...config.ports, searxng: parseInt(e.target.value) }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        )}
      </div>
      <p className="text-sm text-gray-500 mt-2">
        Make sure each port is unique and not in use by other applications.
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <StepIndicator steps={steps} currentStep={currentStep} />
          
          {currentStep === 0 && (
            <WizardStep step={steps[0]} isActive={true}>
              <div className="prose">
                <p>Welcome to the AI Infrastructure Wizard! This tool will help you set up your self-hosted AI infrastructure.</p>
                <p>We'll guide you through:</p>
                <ul>
                  <li>System requirements check</li>
                  <li>Component selection</li>
                  <li>Port configuration</li>
                  <li>Resource allocation</li>
                  <li>Security settings</li>
                </ul>
              </div>
            </WizardStep>
          )}

          {currentStep === 1 && (
            <WizardStep step={steps[1]} isActive={true}>
              <SystemRequirements />
            </WizardStep>
          )}

          {currentStep === 2 && (
            <WizardStep step={steps[2]} isActive={true}>
              <ComponentSelection
                selectedComponents={selectedComponents}
                setSelectedComponents={setSelectedComponents}
              />
            </WizardStep>
          )}

          {currentStep === 3 && (
            <WizardStep step={steps[3]} isActive={true}>
              <div className="space-y-8">
                <InstallationDirectory
                  config={config}
                  setConfig={setConfig}
                />
                <PortConfiguration />
              </div>
            </WizardStep>
          )}

          {currentStep === 4 && (
            <WizardStep step={steps[4]} isActive={true}>
              <ResourceAllocation
                config={config}
                setConfig={setConfig}
              />
            </WizardStep>
          )}

          {currentStep === 5 && (
            <WizardStep step={steps[5]} isActive={true}>
              <SecuritySettings
                config={config}
                setConfig={setConfig}
              />
            </WizardStep>
          )}

          {currentStep === 6 && (
            <WizardStep step={steps[6]} isActive={true}>
              <ReviewAndDeploy
                config={config}
                isDeploying={isDeploying}
                setIsDeploying={setIsDeploying}
                deploymentStatus={deploymentStatus}
                setDeploymentStatus={setDeploymentStatus}
                launchAfterDeploy={launchAfterDeploy}
                setLaunchAfterDeploy={setLaunchAfterDeploy}
              />
            </WizardStep>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
