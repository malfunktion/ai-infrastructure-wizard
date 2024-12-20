import React from 'react';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <div className="step-indicator">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`step ${index === currentStep ? 'active' : ''} ${
            index < currentStep ? 'completed' : ''
          }`}
        >
          <div className="step-number">{index + 1}</div>
          <div className="step-title">{step}</div>
        </div>
      ))}
    </div>
  );
};
