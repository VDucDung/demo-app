import { useState, useCallback } from 'react';

export const useWallet = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  const connectWallet = useCallback(async () => {
    try {
      // Kiểm tra xem Kaikas đã được cài đặt chưa
      if (typeof window.klaytn === 'undefined') {
        throw new Error('Kaikas wallet is not installed');
      }

      // Yêu cầu kết nối ví
      const accounts = await window.klaytn.enable();
      
      if (accounts && accounts.length > 0) {
        // Lưu địa chỉ ví
        setWalletAddress(accounts[0]);
        console.log('Connected wallet:', accounts[0]);
      } else {
        throw new Error('No accounts found');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to connect wallet');
      console.error('Wallet connection error:', error);
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
