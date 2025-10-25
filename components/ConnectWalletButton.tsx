
import React from 'react';

interface ConnectWalletButtonProps {
    onConnect: () => void;
    onDisconnect: () => void;
    walletAddress: string | null;
    isLoading: boolean;
}

export const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({ onConnect, onDisconnect, walletAddress, isLoading }) => {
    
    const truncateAddress = (address: string) => {
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    if (walletAddress) {
        return (
            <div className="flex items-center space-x-4 bg-black/30 border border-cyan-500/30 rounded-full p-2 mt-4 sm:mt-0">
                <span className="text-sm font-mono text-cyan-300 pl-2">{truncateAddress(walletAddress)}</span>
                <button 
                    onClick={onDisconnect} 
                    className="px-4 py-1.5 bg-fuchsia-600 hover:bg-fuchsia-500 rounded-full text-sm font-bold transition-all duration-300"
                >
                    Disconnect
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={onConnect}
            disabled={isLoading}
            className="mt-4 sm:mt-0 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-500 disabled:cursor-wait rounded-full text-base font-bold transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.7)]"
        >
            {isLoading ? 'Connecting...' : 'Connect Wallet'}
        </button>
    );
};
