import React from 'react';

interface WalletButtonProps {
  walletAddress: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
  error?: string;
}

export const WalletButton: React.FC<WalletButtonProps> = ({
  walletAddress,
  onConnect,
  onDisconnect,
  error
}) => {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="space-y-2">
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      
      <button
        onClick={walletAddress ? onDisconnect : onConnect}
        className="w-full bg-purple-500 text-white py-3 px-4 rounded-lg font-medium 
                 hover:bg-purple-600 transition-colors"
        type="button"
      >
        {walletAddress 
          ? `${formatAddress(walletAddress)}`
          : 'Connect Wallet'
        }
      </button>
    </div>
  );
};
