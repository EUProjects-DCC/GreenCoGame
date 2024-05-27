import { IonCard, IonCardContent } from '@ionic/react';
import React, { useEffect, useState } from 'react';

import './ProgressBar.css';
import '../../GreenCo.css'

interface ProgressBarProps {
}

//In the end it is not used
const ProgressBar: React.FC<ProgressBarProps> = ({ }) => {

    const [currentStep, setCurrentStep] = React.useState(1);
    const initialLanguage = sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 2; // Current language (English by default)
    const [language, setLanguage] = useState<any>(initialLanguage) // Language selected by the user
    useEffect(() => {
        console.log("---PROGRESS BAR--")
    }, [])

    const steps = [
        { step: 1, label: 'Choose Difficulty', completed: currentStep > 1 },
        { step: 2, label: 'Choose Story', completed: currentStep > 2 },
        { step: 3, label: 'Choose Character', completed: currentStep > 3 },
        { step: 4, label: 'Start Game', completed: currentStep > 4 },
    ];
    const progressBarWidth = ((currentStep) / (steps.length)) * 100;

    const updateStep = (step: number) => {
        setCurrentStep(step);
    };

    return (
        <IonCard>
            <IonCardContent>
                <div className='progress-container'>
                    <div className='progress-steps'>
                        {steps.map((item, index) => {
                            return (
                                <div
                                    className={`progress-step ${item.completed ? 'completed' : ''}`}
                                    key={index}
                                    onClick={() => updateStep(item.step)}
                                >
                                    {
                                        steps.length <= 4 ? <div className='step-label'>{item.label}</div> : <div className='step-number'>{item.step}</div>
                                    }
                                </div>
                            );
                        })}
                    </div>
                    <div className="progress-bar-container">
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${progressBarWidth}%` }}
                        ></div>
                    </div>
                </div>
            </IonCardContent>
        </IonCard>
    );
};

export default ProgressBar;