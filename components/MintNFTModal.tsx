import React, { useState, useEffect } from 'react';

type MintingStep = 'initial' | 'minting' | 'success' | 'error';

interface MintNFTModalProps {
    isOpen: boolean;
    onClose: () => void;
    walletAddress: string | null;
}

export const MintNFTModal: React.FC<MintNFTModalProps> = ({ isOpen, onClose, walletAddress }) => {
    const [mintingStep, setMintingStep] = useState<MintingStep>('initial');
    const [fakeTxHash, setFakeTxHash] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (isOpen) {
            // Reset state when modal opens
            setMintingStep('initial');
            setFakeTxHash('');
            setErrorMessage('');
        }
    }, [isOpen]);

    const handleMint = async () => {
        if (!walletAddress || !window.ethereum) {
            setErrorMessage('Wallet not connected or not available.');
            setMintingStep('error');
            return;
        }

        setMintingStep('minting');

        try {
            const message = `Sign this message to prove ownership and claim your Cosmic Clash Champion NFT. This is a free mint and does not cost any gas. Nonce: ${Date.now()}`;
            const from = walletAddress;
            
            // This method prompts the user to sign a message, simulating a transaction approval
            const signature = await window.ethereum.request({
                method: 'personal_sign',
                params: [message, from],
            });

            // Simulate backend verification and blockchain confirmation delay
            setTimeout(() => {
                setFakeTxHash(signature);
                setMintingStep('success');
            }, 2000);

        } catch (error: any) {
            console.error("Signing failed", error);
            setErrorMessage(error.code === 4001 ? 'Signature request rejected by user.' : 'An unexpected error occurred.');
            setMintingStep('error');
        }
    };

    if (!isOpen) return null;

    const renderContent = () => {
        switch (mintingStep) {
            case 'initial':
                return (
                    <>
                        <h2 className="text-2xl sm:text-3xl font-bold text-fuchsia-400 mb-4">Claim Your NFT!</h2>
                        <p className="text-cyan-300 text-base sm:text-lg mb-6">You've defeated the AI! As a champion, you can mint a commemorative NFT for free.</p>
                        <button
                            onClick={handleMint}
                            className="w-full px-6 py-3 bg-fuchsia-600 hover:bg-fuchsia-500 rounded-full text-lg font-bold transition-all duration-300 shadow-[0_0_15px_rgba(217,70,239,0.7)]"
                        >
                            Mint Now
                        </button>
                    </>
                );
            case 'minting':
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl sm:text-3xl font-bold text-fuchsia-400 mb-6">Minting in Progress</h2>
                        <div className="flex justify-center items-center">
                            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-cyan-400"></div>
                        </div>
                        <p className="text-cyan-300 text-base sm:text-lg">Preparing your transaction...</p>
                        <p className="text-sm text-gray-400">Please confirm the signature request in your wallet.</p>
                    </div>
                );
            case 'success':
                return (
                    <div className="space-y-4">
                         <h2 className="text-2xl sm:text-3xl font-bold text-green-400 mb-6">Mint Successful!</h2>
                        <p className="text-white text-base sm:text-lg">Congratulations! You've claimed your Cosmic Clash Champion NFT.</p>
                        <div className="text-xs sm:text-sm text-gray-300 break-all">
                            <p className="font-bold">Signature Hash:</p>
                            <p className="text-cyan-400 mt-1">{fakeTxHash}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">(This is a simulation. The signature proves ownership but no real NFT was minted.)</p>
                    </div>
                );
            case 'error':
                 return (
                    <div className="space-y-4">
                         <h2 className="text-2xl sm:text-3xl font-bold text-red-500 mb-6">Minting Failed</h2>
                         <p className="text-white text-base sm:text-lg">{errorMessage}</p>
                         <p className="text-xs text-gray-500 mt-2">Please try again later.</p>
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-md p-4">
            <div className="bg-gray-900 border-2 border-fuchsia-500/50 rounded-lg shadow-[0_0_25px_rgba(217,70,239,0.5)] w-11/12 max-w-md p-6 sm:p-8 text-center">
                {renderContent()}
                <button
                    onClick={onClose}
                    className="mt-8 w-full px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-full text-lg font-bold transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.7)]"
                >
                    {mintingStep === 'success' || mintingStep === 'error' ? 'Play Again' : 'Close'}
                </button>
            </div>
        </div>
    );
};