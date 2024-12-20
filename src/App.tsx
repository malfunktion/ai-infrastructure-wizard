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
    n8nPort: 5678,
    ollamaPort: 11434,
    ollamaWebPort: 3000,
    qdrantPort: 6333,
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
          url: `http://localhost:${config.n8nPort}`,
          description: 'Workflow Automation Platform'
        });
      }
      if (servicesStatus['Ollama']) {
        links.push({
          name: 'Ollama API',
          url: `http://localhost:${config.ollamaPort}`,
          description: 'Local LLM API'
        });
      }
      if (servicesStatus['OpenWebUI']) {
        links.push({
          name: 'Ollama Web UI',
          url: `http://localhost:${config.ollamaWebPort}`,
          description: 'Ollama Web Interface'
        });
      }
      if (servicesStatus['Qdrant']) {
        links.push({
          name: 'Qdrant',
          url: `http://localhost:${config.qdrantPort}`,
          description: 'Vector Database'
        });
      }
      if (servicesStatus['Flowise']) {
        links.push({
          name: 'Flowise',
          url: 'http://localhost:3000',
          description: 'LLM Flow Builder'
        });
      }
      setServiceLinks(links);
    }
  }, [servicesStatus, config]);

  // ... rest of your existing code ...

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          {/* ... existing wizard steps ... */}

          {serviceLinks.length > 0 && (
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-medium text-blue-800 mb-4">Available Services</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {serviceLinks.map((service) => (
                  <a
                    key={service.name}
                    href={service.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">{service.name}</h4>
                      <p className="text-sm text-gray-500">{service.description}</p>
                      <span className="text-xs text-blue-600">{service.url}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
