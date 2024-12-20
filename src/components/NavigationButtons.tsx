import React from 'react';

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  isNextDisabled?: boolean;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  isNextDisabled = false,
}) => {
  return (
    <div className="flex justify-between mt-8">
      <button
        onClick={onPrevious}
        disabled={currentStep === 0}
        className={`px-4 py-2 rounded-md ${
          currentStep === 0
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-gray-600 hover:bg-gray-700 text-white'
        }`}
      >
        Previous
      </button>
      <button
        onClick={onNext}
        disabled={isNextDisabled || currentStep === totalSteps - 1}
        className={`px-4 py-2 rounded-md ${
          isNextDisabled || currentStep === totalSteps - 1
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        Next
      </button>
    </div>
  );
};
