import { useState } from 'react';
import { ComponentSelection } from './components/ComponentSelection';
import { StepIndicator } from './components/StepIndicator';
import { SecuritySettings } from './components/SecuritySettings';
import { InstallationDirectory } from './components/InstallationDirectory';
import { Review } from './components/Review';

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

interface Config {
  installDir: string;
  ports: {
    n8n: number;
    ollama: number;
    openwebui: number;
    qdrant: number;
    postgres: number;
    flowise: number;
    searxng: number;
    perplexity: number;
  };
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
}

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [config, setConfig] = useState<Config>({
    installDir: '',
    ports: {
      postgres: 5432,
      n8n: 5678,
      qdrant: 6333,
      flowise: 3000,
      searxng: 8080,
      openwebui: 3000,
      ollama: 11434,
      perplexity: 8081
    },
    security: {
      n8n: {
        username: '',
        password: '',
        encryptionKey: '',
        jwtSecret: ''
      },
      postgres: {
        username: 'postgres',
        password: '',
        database: 'postgres'
      },
      qdrant: {
        apiKey: ''
      },
      flowise: {
        username: '',
        password: ''
      },
      searxng: {
        adminPassword: ''
      }
    }
  });

  const [selectedComponents, setSelectedComponents] = useState<SelectedComponents>({
    'n8n': false,
    'ollama': false,
    'openwebui': false,
    'qdrant': false,
    'postgres': false,
    'flowise': false,
    'searxng': false,
    'perplexity': false
  });

  const serviceVersions = {
    n8n: '1.24.1',
    ollama: '0.1.27',
    openwebui: '0.1.109',
    qdrant: '1.7.3',
    postgres: '16.1',
    flowise: '1.4.6',
    searxng: '0.0.1',
    perplexity: '0.0.1'
  };

  const components = [
    {
      id: 'n8n',
      name: 'n8n',
      description: 'Workflow Automation Platform',
      icon: '🔄'
    },
    {
      id: 'ollama',
      name: 'Ollama',
      description: 'Run Large Language Models Locally',
      icon: '🤖'
    },
    {
      id: 'openwebui',
      name: 'OpenWebUI',
      description: 'Web Interface for Ollama',
      icon: '🌐'
    },
    {
      id: 'qdrant',
      name: 'Qdrant',
      description: 'Vector Database',
      icon: '🗄️'
    },
    {
      id: 'postgres',
      name: 'PostgreSQL',
      description: 'Relational Database',
      icon: '🐘'
    },
    {
      id: 'flowise',
      name: 'Flowise',
      description: 'Build LLM Flows with Drag & Drop',
      icon: '🌊'
    },
    {
      id: 'searxng',
      name: 'SearXNG',
      description: 'Privacy-focused Search Engine',
      icon: '🔍'
    },
    {
      id: 'perplexity',
      name: 'Perplexity',
      description: 'AI Search Engine',
      icon: '🔎'
    }
  ];

  const stepsList = [
    {
      title: 'Welcome',
      content: (
        <div className="welcome-step">
          <h2>Welcome to AI Infrastructure Wizard! 👋</h2>
          <p>
            This wizard will help you set up your AI infrastructure with just a few clicks.
            We'll guide you through:
          </p>
          <ul>
            <li>Selecting the installation directory</li>
            <li>Selecting which components to install</li>
            <li>Configuring security settings</li>
            <li>Reviewing and deploying your infrastructure</li>
          </ul>
          <p>
            Click "Next" to begin!
          </p>
        </div>
      )
    },
    {
      title: 'Location',
      content: (
        <InstallationDirectory
          config={config}
          setConfig={setConfig}
        />
      )
    },
    {
      title: 'Components',
      content: (
        <ComponentSelection
          selectedComponents={selectedComponents}
          setSelectedComponents={setSelectedComponents}
          config={config}
          setConfig={setConfig}
          serviceVersions={serviceVersions}
          components={components}
        />
      )
    },
    {
      title: 'Security',
      content: (
        <SecuritySettings
          config={config}
          setConfig={setConfig}
          selectedComponents={selectedComponents}
        />
      )
    },
    {
      title: 'Review',
      content: (
        <Review
          config={config}
          selectedComponents={selectedComponents}
        />
      )
    }
  ];

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="app">
      <div className="wizard-container">
        <h1>AI Infrastructure Wizard</h1>
        <StepIndicator
          steps={stepsList.map(step => step.title)}
          currentStep={currentStep}
        />
        <div className="wizard-content">
          <div className="step-content">
            {stepsList[currentStep].content}
          </div>
          <div className="navigation-buttons">
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="back-button"
              >
                Back
              </button>
            )}
            {currentStep < stepsList.length - 1 && (
              <button
                onClick={handleNext}
                className="next-button"
                disabled={
                  (currentStep === 1 && !config.installDir) || 
                  (currentStep === 2 && !Object.values(selectedComponents).some(Boolean))
                }
              >
                Next
              </button>
            )}
            {currentStep === stepsList.length - 1 && (
              <button
                className="deploy-button"
                onClick={() => console.log('Deploying...', { config, selectedComponents })}
              >
                Deploy
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
