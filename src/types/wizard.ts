export interface Step {
  id: number;
  title: string;
  description: string;
}

export interface Wizard {
  id: number;
  name: string;
  steps: Step[];
}

export interface SecurityConfig {
  postgres: {
    username: string;
    password: string;
    database: string;
  };
  flowise: {
    username: string;
    password: string;
  };
  qdrant: {
    apiKey?: string;
  };
}

export interface ComponentConfig {
  postgres: boolean;
  flowise: boolean;
  qdrant: boolean;
}

export interface WizardConfig {
  installDir: string;
  components: ComponentConfig;
  security: SecurityConfig;
}

export interface DeploymentStatus {
  status: 'idle' | 'deploying' | 'success' | 'error';
  message?: string;
}
