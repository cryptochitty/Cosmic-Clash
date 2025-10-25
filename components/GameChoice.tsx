import React from 'react';
import { Choice } from '../types';
import { RockIcon, PaperIcon, ScissorsIcon } from './icons/GameIcons';

interface GameChoiceProps {
    choice: Choice;
    onClick: () => void;
    disabled?: boolean;
}

export const GameChoice: React.FC<GameChoiceProps> = ({ choice, onClick, disabled }) => {
    // Fix: Replaced JSX.Element with React.ReactElement to resolve namespace issue.
    const icons: { [key in Choice]: React.ReactElement } = {
        rock: <RockIcon />,
        paper: <PaperIcon />,
        scissors: <ScissorsIcon />,
    };

    const colors: { [key in Choice]: string } = {
        rock: 'border-red-500/50 hover:border-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.7)]',
        paper: 'border-blue-500/50 hover:border-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.7)]',
        scissors: 'border-yellow-500/50 hover:border-yellow-500 hover:shadow-[0_0_20px_rgba(234,179,8,0.7)]',
    }

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 p-3 sm:p-4 bg-black/20 rounded-full border-4 flex items-center justify-center
                        transition-all duration-300 transform 
                        ${disabled ? 'opacity-50 cursor-not-allowed' : `cursor-pointer hover:scale-110 ${colors[choice]}`}
                        `}
            aria-label={`Choose ${choice}`}
        >
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-white">
                {icons[choice]}
            </div>
        </button>
    );
};