import React from 'react';
import { Choice } from '../types';
import { RockIcon, PaperIcon, ScissorsIcon } from './icons/GameIcons';

interface ResultDisplayProps {
    playerChoice: Choice | null;
    computerChoice: Choice | null;
}

const ChoiceDisplay: React.FC<{ choice: Choice | null; label: string; labelColor: string }> = ({ choice, label, labelColor }) => {
    // Fix: Replaced JSX.Element with React.ReactElement to resolve namespace issue.
    const icons: { [key in Choice]: React.ReactElement } = {
        rock: <RockIcon />,
        paper: <PaperIcon />,
        scissors: <ScissorsIcon />,
    };
    
    return (
        <div className="flex flex-col items-center">
            <p className={`mb-2 sm:mb-4 text-base sm:text-xl font-bold uppercase ${labelColor}`}>{label}</p>
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 p-4 bg-black/30 rounded-full border-4 border-gray-600 flex items-center justify-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-20 md:h-20 text-white transition-opacity duration-500">
                    {choice ? icons[choice] : <span className="text-3xl sm:text-4xl text-gray-500">?</span>}
                </div>
            </div>
        </div>
    );
};


export const ResultDisplay: React.FC<ResultDisplayProps> = ({ playerChoice, computerChoice }) => {
    return (
        <div className="flex justify-around items-center my-6 sm:my-8">
            <ChoiceDisplay choice={playerChoice} label="You Chose" labelColor="text-cyan-400" />
            <p className="text-2xl sm:text-4xl font-bold text-fuchsia-500 mx-2 sm:mx-4">VS</p>
            <ChoiceDisplay choice={computerChoice} label="AI Chose" labelColor="text-fuchsia-400" />
        </div>
    );
};