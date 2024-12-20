import React from 'react';
import { Step } from '../types/wizard';

interface WizardStepProps {
  step: Step;
  isActive: boolean;
  children?: React.ReactNode;
}

export const WizardStep: React.FC<WizardStepProps> = ({ step, isActive, children }) => {
  if (!isActive) return null;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">{step.title}</h2>
        <p className="text-gray-600">{step.description}</p>
      </div>
      {children}
    </div>
  );
};
