
import React from 'react';

interface ScoreboardProps {
    playerScore: number;
    computerScore: number;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ playerScore, computerScore }) => {
    return (
        <div className="flex justify-around items-center text-center p-4 border-2 border-fuchsia-500/30 rounded-lg bg-black/20 mb-8">
            <div className="w-1/2">
                <p className="text-lg md:text-2xl font-bold uppercase tracking-widest text-cyan-400">Player</p>
                <p className="text-4xl md:text-6xl font-bold mt-2">{playerScore}</p>
            </div>
            <div className="w-px h-24 bg-fuchsia-500/30"></div>
            <div className="w-1/2">
                <p className="text-lg md:text-2xl font-bold uppercase tracking-widest text-fuchsia-400">Computer</p>
                <p className="text-4xl md:text-6xl font-bold mt-2">{computerScore}</p>
            </div>
        </div>
    );
};
