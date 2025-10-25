// Fix: Add a global type definition for `window.ethereum` to resolve TypeScript errors.
// The `ethereum` object, injected by wallets like MetaMask, is not part of the standard `window` type.
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
    };
  }
}

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameChoice } from './components/GameChoice';
import { Scoreboard } from './components/Scoreboard';
import { ResultDisplay } from './components/ResultDisplay';
import { ConnectWalletButton } from './components/ConnectWalletButton';
import { MintNFTModal } from './components/MintNFTModal';
import { AirdropSection } from './components/AirdropSection';
import { HowToPlayModal } from './components/HowToPlayModal';
import { Choice, GameResult } from './types';
import { CHOICES, WINNING_SCORE } from './constants';
import { useSound } from './hooks/useSound';
import { SoundOnIcon, SoundOffIcon } from './components/icons/SoundIcons';

const App: React.FC = () => {
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [playerScore, setPlayerScore] = useState(0);
    const [computerScore, setComputerScore] = useState(0);
    const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
    const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
    const [roundResult, setRoundResult] = useState<GameResult | null>(null);
    const [gameMessage, setGameMessage] = useState<string>('Connect your wallet to begin');
    const [isGameOver, setIsGameOver] = useState(false);
    const [showMintModal, setShowMintModal] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
    const [isSoundOn, setIsSoundOn] = useState(true);
    const [hasInteracted, setHasInteracted] = useState(false); // State to track user interaction

    const backgroundAudioRef = useRef<HTMLAudioElement>(null);

    // Sound Effects
    const playClick = useSound('/sounds/click.mp3');
    const playWin = useSound('/sounds/win.mp3');
    const playLose = useSound('/sounds/lose.mp3');
    const playTie = useSound('/sounds/tie.mp3');
    const playMintSuccess = useSound('/sounds/mint.mp3');

    useEffect(() => {
        if (backgroundAudioRef.current) {
            backgroundAudioRef.current.volume = 0.2; // Lower volume for background music
            if (isSoundOn && hasInteracted) {
                 const playPromise = backgroundAudioRef.current.play();
                 if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.error("Audio play was prevented.", error);
                    });
                }
            } else {
                backgroundAudioRef.current.pause();
            }
        }
    }, [isSoundOn, hasInteracted]);


    const handleConnectWallet = useCallback(async () => {
        if (window.ethereum) {
            try {
                setIsLoading(true);
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                if (accounts.length > 0) {
                    setWalletAddress(accounts[0]);
                    setGameMessage('Choose your weapon!');
                    if(isSoundOn) playClick();
                }
            } catch (error) {
                console.error("Error connecting to MetaMask", error);
                setGameMessage('Wallet connection failed. Please try again.');
            } finally {
                setIsLoading(false);
            }
        } else {
            setGameMessage('Please install MetaMask to play!');
        }
    }, [isSoundOn, playClick]);

    const resetGame = useCallback((isFullReset: boolean) => {
        setPlayerScore(0);
        setComputerScore(0);
        setIsGameOver(false);
        setPlayerChoice(null);
        setComputerChoice(null);
        setRoundResult(null);
        setGameMessage('Choose your weapon!');
        if (isFullReset) {
            setWalletAddress(null);
            setGameMessage('Connect your wallet to begin');
        }
    }, []);

    const handleDisconnectWallet = useCallback(() => {
        resetGame(true);
        if(isSoundOn) playClick();
    }, [resetGame, isSoundOn, playClick]);

    useEffect(() => {
        if (playerScore === WINNING_SCORE || computerScore === WINNING_SCORE) {
            setIsGameOver(true);
            if (playerScore === WINNING_SCORE) {
                setGameMessage('VICTORY! You can mint an NFT!');
                setTimeout(() => setShowMintModal(true), 1000);
            } else {
                setGameMessage('DEFEAT! Better luck next time.');
            }
        }
    }, [playerScore, computerScore]);

    const handlePlayerChoice = (choice: Choice) => {
        if (isGameOver || !walletAddress) return;
        if(isSoundOn) playClick();

        const computerChoice = CHOICES[Math.floor(Math.random() * CHOICES.length)];
        setPlayerChoice(choice);
        setComputerChoice(computerChoice);

        if (choice === computerChoice) {
            setRoundResult('tie');
            setGameMessage("It's a TIE!");
            if(isSoundOn) playTie();
        } else if (
            (choice === 'rock' && computerChoice === 'scissors') ||
            (choice === 'paper' && computerChoice === 'rock') ||
            (choice === 'scissors' && computerChoice === 'paper')
        ) {
            setRoundResult('win');
            setPlayerScore(score => score + 1);
            setGameMessage('You WIN this round!');
            if(isSoundOn) playWin();
        } else {
            setRoundResult('lose');
            setComputerScore(score => score + 1);
            setGameMessage('You LOSE this round!');
            if(isSoundOn) playLose();
        }
    };

    const handleUserInteraction = () => {
        if (!hasInteracted) {
            setHasInteracted(true);
        }
    }

    return (
        <div 
            className="bg-gray-900 min-h-screen text-white flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden"
            onClick={handleUserInteraction}
        >
            <audio ref={backgroundAudioRef} src="/sounds/background.mp3" loop />
            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 z-0" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(29, 78, 216, 0.1), transparent 70%)'}}></div>
            <div className="w-full max-w-4xl mx-auto z-10">
                <header className="flex flex-col sm:flex-row justify-between items-center w-full mb-6 sm:mb-8 gap-4 sm:gap-0">
                    <div className="flex items-center gap-3">
                         <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-cyan-400 tracking-widest uppercase">
                            Cosmic Clash
                        </h1>
                        <button 
                            onClick={() => {
                                setShowHelpModal(true);
                                if(isSoundOn) playClick();
                            }}
                            className="text-sm font-bold text-cyan-400 border border-cyan-400/50 rounded-full px-3 py-1 hover:bg-cyan-400/20 transition-colors"
                            aria-label="How to play"
                        >
                            Help
                        </button>
                        <button
                            onClick={() => setIsSoundOn(!isSoundOn)}
                            className="text-cyan-400 border border-cyan-400/50 rounded-full p-2 hover:bg-cyan-400/20 transition-colors"
                            aria-label={isSoundOn ? "Mute sound" : "Unmute sound"}
                        >
                            {isSoundOn ? <SoundOnIcon /> : <SoundOffIcon />}
                        </button>
                    </div>
                    <ConnectWalletButton
                        onConnect={handleConnectWallet}
                        onDisconnect={handleDisconnectWallet}
                        walletAddress={walletAddress}
                        isLoading={isLoading}
                    />
                </header>

                <main className="w-full bg-black/30 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4 sm:p-6 shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                    {!walletAddress ? (
                        <div className="flex flex-col items-center justify-center h-80 sm:h-96">
                            <p className="text-xl sm:text-2xl text-fuchsia-400 text-center">{gameMessage}</p>
                            <button onClick={handleConnectWallet} className="mt-8 px-8 py-3 bg-fuchsia-600 hover:bg-fuchsia-500 rounded-full text-lg font-bold transition-all duration-300 shadow-[0_0_15px_rgba(217,70,239,0.7)]">
                                Connect Wallet
                            </button>
                        </div>
                    ) : (
                        <>
                            <Scoreboard playerScore={playerScore} computerScore={computerScore} />
                            
                            <div className="my-6 sm:my-8 text-center">
                                <p className={`text-xl sm:text-2xl font-bold transition-all duration-300 ${
                                    roundResult === 'win' ? 'text-green-400' :
                                    roundResult === 'lose' ? 'text-red-400' :
                                    roundResult === 'tie' ? 'text-yellow-400' : 'text-cyan-400'
                                }`}>
                                    {gameMessage}
                                </p>
                            </div>
                            
                            <ResultDisplay playerChoice={playerChoice} computerChoice={computerChoice} />
                            
                            <div className="mt-8 sm:mt-12 mb-6">
                                <div className="flex justify-center items-center space-x-2 sm:space-x-4 md:space-x-8">
                                    {CHOICES.map((choice) => (
                                        <GameChoice
                                            key={choice}
                                            choice={choice}
                                            onClick={() => handlePlayerChoice(choice)}
                                            disabled={isGameOver}
                                        />
                                    ))}
                                </div>
                            </div>
                             {isGameOver && (
                                <div className="text-center mt-8">
                                    <button
                                        onClick={() => {
                                            resetGame(false);
                                            if(isSoundOn) playClick();
                                        }}
                                        className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-full text-lg font-bold transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.7)]"
                                    >
                                        Play Again
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </main>
                
                <AirdropSection />

            </div>

            <MintNFTModal 
                isOpen={showMintModal} 
                onClose={() => {
                    setShowMintModal(false);
                    resetGame(false);
                }}
                walletAddress={walletAddress}
                onMintSuccess={playMintSuccess}
            />
            <HowToPlayModal 
                isOpen={showHelpModal}
                onClose={() => setShowHelpModal(false)}
            />
        </div>
    );
};

export default App;