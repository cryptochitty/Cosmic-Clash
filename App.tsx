// Fix: Add a global type definition for `window.ethereum` to resolve TypeScript errors.
// The `ethereum` object, injected by wallets like MetaMask, is not part of the standard `window` type.
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
    };
  }
}

import React, { useState, useEffect, useCallback } from 'react';
import { GameChoice } from './components/GameChoice';
import { Scoreboard } from './components/Scoreboard';
import { ResultDisplay } from './components/ResultDisplay';
import { ConnectWalletButton } from './components/ConnectWalletButton';
import { MintNFTModal } from './components/MintNFTModal';
import { AirdropSection } from './components/AirdropSection';
import { HowToPlayModal } from './components/HowToPlayModal';
import { Choice, GameResult } from './types';
import { CHOICES, WINNING_SCORE } from './constants';

export const App: React.FC = () => {
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [playerScore, setPlayerScore] = useState(0);
    const [computerScore, setComputerScore] = useState(0);
    const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
    const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
    const [result, setResult] = useState<GameResult | null>(null);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isMintModalOpen, setIsMintModalOpen] = useState(false);
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [statusMessage, setStatusMessage] = useState('Connect your wallet to begin!');

    const handleConnectWallet = async () => {
        if (!window.ethereum) {
            alert("Please install a Web3 wallet like MetaMask.");
            return;
        }
        setIsConnecting(true);
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            if (accounts.length > 0) {
                setWalletAddress(accounts[0]);
                setStatusMessage('Make your move!');
            }
        } catch (error) {
            console.error("Failed to connect wallet", error);
            setStatusMessage('Wallet connection failed.');
        } finally {
            setIsConnecting(false);
        }
    };

    const handleDisconnectWallet = () => {
        setWalletAddress(null);
        resetGame();
        setStatusMessage('Connect your wallet to begin!');
    };

    const resetGame = () => {
        setPlayerScore(0);
        setComputerScore(0);
        setPlayerChoice(null);
        setComputerChoice(null);
        setResult(null);
        setIsGameOver(false);
        if (walletAddress) {
          setStatusMessage('Make your move!');
        }
    };

    const getGameResult = (player: Choice, computer: Choice): GameResult => {
        if (player === computer) return 'tie';
        if (
            (player === 'rock' && computer === 'scissors') ||
            (player === 'scissors' && computer === 'paper') ||
            (player === 'paper' && computer === 'rock')
        ) {
            return 'win';
        }
        return 'lose';
    };

    const handlePlayerChoice = (choice: Choice) => {
        if (isGameOver || !walletAddress) return;

        const computerChoice = CHOICES[Math.floor(Math.random() * CHOICES.length)];
        const gameResult = getGameResult(choice, computerChoice);

        setPlayerChoice(choice);
        setComputerChoice(computerChoice);
        setResult(gameResult);

        if (gameResult === 'win') {
            setPlayerScore(score => score + 1);
        } else if (gameResult === 'lose') {
            setComputerScore(score => score + 1);
        }
    };

    useEffect(() => {
        if (result === 'win') {
            setStatusMessage('You win this round!');
        } else if (result === 'lose') {
            setStatusMessage('AI wins this round!');
        } else if (result === 'tie') {
            setStatusMessage("It's a tie!");
        }
    }, [result]);

    useEffect(() => {
        if (playerScore === WINNING_SCORE) {
            setIsGameOver(true);
            setStatusMessage('Congratulations! You won the game!');
            setTimeout(() => setIsMintModalOpen(true), 1500);
        } else if (computerScore === WINNING_SCORE) {
            setIsGameOver(true);
            setStatusMessage('Game Over! The AI is victorious.');
        }
    }, [playerScore, computerScore]);

    return (
        <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center p-4 sm:p-6" style={{ background: 'radial-gradient(circle, #1a202c, #000)' }}>
            
            {/* Header */}
            <header className="w-full max-w-4xl flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8">
                <div className="text-center sm:text-left">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-cyan-400 tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                        COSMIC CLASH
                    </h1>
                    <p className="text-fuchsia-400 text-sm sm:text-base">Rock Paper Scissors</p>
                </div>
                <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                     <button 
                        onClick={() => setIsHelpModalOpen(true)}
                        className="px-4 py-2 bg-black/30 border border-fuchsia-500/30 rounded-full text-sm sm:text-base font-bold text-fuchsia-300 hover:bg-fuchsia-500/20 transition-all"
                    >
                        Help
                    </button>
                    <ConnectWalletButton
                        onConnect={handleConnectWallet}
                        onDisconnect={handleDisconnectWallet}
                        walletAddress={walletAddress}
                        isLoading={isConnecting}
                    />
                </div>
            </header>
            
            {/* Game Area */}
            <main className="w-full max-w-2xl flex-grow flex flex-col items-center justify-center">
                <Scoreboard playerScore={playerScore} computerScore={computerScore} />
                
                <ResultDisplay playerChoice={playerChoice} computerChoice={computerChoice} />

                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold my-4 sm:my-6 text-center h-8">
                    {statusMessage}
                </h2>
                
                <div className="flex space-x-4 sm:space-x-8 md:space-x-12 my-4 sm:my-6">
                    {CHOICES.map(choice => (
                        <GameChoice
                            key={choice}
                            choice={choice}
                            onClick={() => handlePlayerChoice(choice)}
                            disabled={isGameOver || !walletAddress}
                        />
                    ))}
                </div>

                {isGameOver && (
                    <button
                        onClick={resetGame}
                        className="mt-4 px-8 py-3 bg-fuchsia-600 hover:bg-fuchsia-500 rounded-full text-lg font-bold transition-all duration-300 shadow-[0_0_15px_rgba(217,70,239,0.7)]"
                    >
                        Play Again
                    </button>
                )}

                <AirdropSection />
            </main>

            <MintNFTModal
                isOpen={isMintModalOpen}
                onClose={() => {
                    setIsMintModalOpen(false);
                    resetGame();
                }}
                walletAddress={walletAddress}
            />
            
            <HowToPlayModal 
                isOpen={isHelpModalOpen}
                onClose={() => setIsHelpModalOpen(false)}
            />
        </div>
    );
};
