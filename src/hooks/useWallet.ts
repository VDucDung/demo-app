import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';

export const useWallet = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  const connectWallet = useCallback(async () => {
    try {
      if (typeof window.klaytn === 'undefined') {
        toast.error('Please install Kaikas wallet to connect.', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: true,
        });
        return;
      }

      const accounts = await window.klaytn.enable();
      
      if (accounts && accounts.length > 0) {
        setWalletAddress(accounts[0]);
        console.log('Connected wallet:', accounts[0]);
      } else {
        throw new Error('No accounts found');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to connect wallet');
      console.error('Wallet connection error:', error);

      toast.error(error instanceof Error ? error.message : 'Failed to connect wallet', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
      });
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setWalletAddress(null);
    setError('');
  }, []);

  return {
    walletAddress,
    error,
    connectWallet,
    disconnectWallet
  };
};
