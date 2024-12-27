import { useEffect, useState, useCallback } from 'react';
import liff from '@line/liff';
import axios from 'axios';
import { UserProfile } from './types';
import { useWallet } from './hooks/useWallet';
import { WalletButton } from './components/WalletButton';

const VERIFY_API_URL = import.meta.env.VITE_VERIFY_API_URL as string;
const LIFF_ID = import.meta.env.VITE_LIFF_ID as string;

interface VerifyResponse {
  success: boolean;
  message: string;
  userInfo?: UserProfile;
}

const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-4">
    <img 
      src="https://developers.line.biz/media/line-mini-app/LINE_spinner_light.svg"
      alt="Loading..."
      className="w-12 h-12"
    />
  </div>
);

const useLINEAuth = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const verifyToken = useCallback(async (accessToken: string): Promise<UserProfile> => {
    try {
      const response = await axios.post<VerifyResponse>(
        VERIFY_API_URL, 
        { access_token: accessToken }
      );
      
      if (!response.data.success || !response.data.userInfo) {
        throw new Error(response.data.message || 'Verification failed');
      }
      
      console.log('Verification successful:', response.data);
      return response.data.userInfo;
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : 'Verification error';
      throw new Error(errorMessage);
    }
  }, []);

  const fetchUserProfile = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      const accessToken = liff.getAccessToken();
      if (!accessToken) {
        throw new Error('Access token not found');
      }

      console.log('access token:', accessToken);

      const userProfile = await verifyToken(accessToken);
      setProfile(userProfile);
    } catch (err) {
      setError(`Error fetching profile: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  }, [verifyToken]);

  const initializeLiff = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      await liff.init({ liffId: LIFF_ID });
      setIsInitialized(true);
      
      if (liff.isLoggedIn()) {
        setIsLoggedIn(true);
        await fetchUserProfile();
      }
    } catch (err) {
      setError(`Error initializing LIFF: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  }, [fetchUserProfile]);

  useEffect(() => {
    void initializeLiff();
  }, [initializeLiff]);

  const login = useCallback((): void => {
    if (!liff.isLoggedIn()) {
      setIsLoading(true); // Set loading before login
      liff.login();
    }
  }, []);

  const logout = useCallback((): void => {
    if (liff.isLoggedIn()) {
      setIsLoading(true);
      liff.logout();
      setIsLoggedIn(false);
      setProfile(null);
      setIsLoading(false);
    }
  }, []);

  const shareMessage = useCallback(async (): Promise<void> => {
    if (!liff.isLoggedIn() || !liff.isApiAvailable('shareTargetPicker')) {
      throw new Error('Share target picker is not available.');
    }

    try {
      const currentUrl = window.location.href;
      await liff.shareTargetPicker([
        {
          type: 'text',
          text: `Check this out: ${currentUrl}`,
        },
      ]);
    } catch (err) {
      throw new Error(`Error sending message: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, []);

  return {
    profile,
    error,
    isLoggedIn,
    isInitialized,
    isLoading,
    login,
    logout,
    shareMessage,
    setError
  };
};

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
    {message}
  </div>
);

const ProfileCard = ({ profile }: { profile: UserProfile }) => (
  <div className="text-center">
    <img
      src={profile.pictureUrl ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.userId}&backgroundColor=b6e3f4,c0aede,d1d4f9`}
      alt="Profile"
      className="w-24 h-24 rounded-full mx-auto mb-2"
    />
    <p className="font-semibold">{profile.displayName}</p>
    <p className="text-gray-600">{profile.userId}</p>
  </div>
);

function App(): JSX.Element {
  const {
    profile,
    error,
    isLoggedIn,
    isLoading,
    login,
    logout,
    shareMessage,
    setError
  } = useLINEAuth();


  const {
    walletAddress,
    connectWallet,
    disconnectWallet
  } = useWallet();

  const handleShareMessage = async () => {
    try {
      await shareMessage();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="w-full max-w-md mx-4 bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold text-center mb-6">LINE Mini App</h1>

      {error && <ErrorMessage message={error} />}
      
      {isLoading ? (
        <LoadingSpinner />
      ) : !isLoggedIn ? (
        <button
          onClick={login}
          className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          type="button"
        >
          Login with LINE
        </button>
      ) : (
        <div className="space-y-4">
          {profile && <ProfileCard profile={profile} />}

          <button
            onClick={() => void handleShareMessage()}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            type="button"
          >
            Share with friends
          </button>

          <WalletButton 
          walletAddress={walletAddress}
          onConnect={connectWallet}
          onDisconnect={disconnectWallet}
          error={error}
        />

          <button
            onClick={logout}
            className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            type="button"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  </div>
  );
}

export default App;
