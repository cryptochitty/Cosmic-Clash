import React from 'react';

export const AirdropSection: React.FC = () => {
    return (
        <div className="w-full bg-black/30 backdrop-blur-sm border border-fuchsia-500/30 rounded-lg p-4 sm:p-6 mt-6 sm:mt-8 text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-fuchsia-400 uppercase tracking-widest">Special Rewards</h3>
            <p className="text-cyan-300 mt-3 sm:mt-4 text-sm sm:text-base">
                Airdrops & real-time winnings are coming soon! Keep playing to increase your rank for future rewards.
            </p>
        </div>
    );
};