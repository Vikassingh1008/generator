import * as React from 'react';
import styles from '../Generator.module.scss';
import { CheckIcon } from './Icons';

interface StepperProps {
  currentStep: number; // 1, 2, or 3
  onStepClick?: (step: number) => void;
}

export const Stepper: React.FC<StepperProps> = ({ currentStep, onStepClick }) => {
  const steps = [
    { number: 1, title: 'Page details' },
    { number: 2, title: 'Add content' },
    { number: 3, title: 'Preview & publish' }
  ];

  return (
    <div className={styles.stepperContainer}>
      {steps.map((step, idx) => {
        const isCompleted = step.number < currentStep;
        const isActive = step.number === currentStep;

        return (
          <React.Fragment key={step.number}>
            <div
              className={`${styles.stepItem} ${isActive ? styles.stepActive : ''} ${isCompleted ? styles.stepCompleted : ''}`}
              onClick={() => onStepClick && onStepClick(step.number)}
              role="button"
              tabIndex={0}
            >
              <div className={styles.stepCircle}>
                {isCompleted ? <CheckIcon size={12} color="#ffffff" /> : step.number}
              </div>
              <span className={styles.stepTitle}>{step.title}</span>
            </div>
            {idx < steps.length - 1 && <div className={styles.stepDivider} />}
          </React.Fragment>
        );
      })}
    </div>
  );
};
