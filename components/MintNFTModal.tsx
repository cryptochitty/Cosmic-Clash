
import React, { useState, useEffect } from 'react';

interface MintNFTModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const MintNFTModal: React.FC<MintNFTModalProps> = ({ isOpen, onClose }) => {
    const [isMinting, setIsMinting] = useState(false);
    const [mintSuccess, setMintSuccess] = useState(false);
    const [fakeTxHash, setFakeTxHash] = useState('');

    useEffect(() => {
        if (isOpen) {
            setIsMinting(true);
            setMintSuccess(false);
            // Simulate minting process
            const timer = setTimeout(() => {
                const hash = `0x${[...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
                setFakeTxHash(hash);
                setIsMinting(false);
                setMintSuccess(true);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [isOpen]);


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-md">
            <div className="bg-gray-900 border-2 border-fuchsia-500/50 rounded-lg shadow-[0_0_25px_rgba(217,70,239,0.5)] w-11/12 max-w-md p-8 text-center">
                <h2 className="text-3xl font-bold text-fuchsia-400 mb-6">
                    {mintSuccess ? 'Mint Successful!' : 'Claim Your NFT'}
                </h2>
                
                {isMinting && (
                    <div className="space-y-4">
                        <p className="text-cyan-300 text-lg">Your victory NFT is being minted on the blockchain...</p>
                        <div className="flex justify-center items-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-400"></div>
                        </div>
                        <p className="text-sm text-gray-400">Please confirm the transaction in your wallet.</p>
                    </div>
                )}

                {mintSuccess && (
                    <div className="space-y-4">
                        <p className="text-green-400 text-lg">Congratulations! You've minted your Cosmic Clash Champion NFT.</p>
                        <div className="text-sm text-gray-300 break-all">
                            <p className="font-bold">Transaction Hash:</p>
                            <a 
                                href="#"
                                onClick={(e) => e.preventDefault()}
                                className="text-cyan-400 hover:underline"
                            >
                                {fakeTxHash}
                            </a>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">(This is a simulation. No real NFT was minted.)</p>
                    </div>
                )}
                
                <button
                    onClick={onClose}
                    className="mt-8 w-full px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-full text-lg font-bold transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.7)]"
                >
                    {mintSuccess ? 'Play Again' : 'Close'}
                </button>
            </div>
        </div>
    );
};
