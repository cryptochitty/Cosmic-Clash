import React from 'react';

interface HowToPlayModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-md p-4">
            <div className="bg-gray-900 border-2 border-cyan-500/50 rounded-lg shadow-[0_0_25px_rgba(6,182,212,0.5)] w-full max-w-2xl p-6 sm:p-8 text-left relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                    aria-label="Close help modal"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-2xl sm:text-3xl font-bold text-cyan-400 mb-6 text-center">How to Play Cosmic Clash</h2>
                
                <div className="space-y-6 text-cyan-200 text-sm sm:text-base">
                    <section>
                        <h3 className="text-lg sm:text-xl font-bold text-fuchsia-400 mb-2 border-b-2 border-fuchsia-500/30 pb-1">1. The Rules</h3>
                        <p>Cosmic Clash is a classic game of Rock, Paper, Scissors with a futuristic twist. The first player to score <span className="font-bold text-white">3 points</span> wins the match.</p>
                        <ul className="list-disc list-inside mt-2 space-y-1 pl-2">
                            <li><span className="font-bold text-white">Rock</span> crushes <span className="font-bold text-white">Scissors</span></li>
                            <li><span className="font-bold text-white">Scissors</span> cuts <span className="font-bold text-white">Paper</span></li>
                            <li><span className="font-bold text-white">Paper</span> covers <span className="font-bold text-white">Rock</span></li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-lg sm:text-xl font-bold text-fuchsia-400 mb-2 border-b-2 border-fuchsia-500/30 pb-1">2. Connect Your Wallet</h3>
                        <p>To play the game and claim your rewards, you need to connect a Web3 wallet like MetaMask. This is your identity in the game.</p>
                        <p className="mt-2">Simply click the "Connect Wallet" button to get started. If you don't have a wallet, you'll be prompted to install one.</p>
                    </section>

                    <section>
                        <h3 className="text-lg sm:text-xl font-bold text-fuchsia-400 mb-2 border-b-2 border-fuchsia-500/30 pb-1">3. Mint Your NFT Prize</h3>
                        <p>When you win a match, you earn the right to mint a <span className="font-bold text-white">free</span> commemorative "Cosmic Clash Champion" NFT!</p>
                        <p className="mt-2">A modal will appear, allowing you to "Mint" your prize. You'll be asked to sign a message in your wallet to prove you're the winner. This is a simulation and <span className="font-bold text-white">does not cost any real gas fees</span>.</p>
                    </section>
                </div>

                 <div className="text-center mt-8">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-full text-lg font-bold transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.7)]"
                    >
                        Got It!
                    </button>
                </div>
            </div>
        </div>
    );
};