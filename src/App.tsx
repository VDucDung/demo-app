import { useEffect, useState } from 'react';
import liff from '@line/liff';
import { UserProfile } from './types';

function App(): JSX.Element {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    void initializeLiff();
  }, []);

  const initializeLiff = async (): Promise<void> => {
    try {
      await liff.init({ liffId: import.meta.env.VITE_LIFF_ID as string });
      if (liff.isLoggedIn()) {
        setIsLoggedIn(true);
        void fetchUserProfile();
      }
    } catch (err) {
      setError(`Error initializing LIFF: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const fetchUserProfile = async (): Promise<void> => {
    try {
      const userProfile: UserProfile = await liff.getProfile();
      setProfile(userProfile);
    } catch (err) {
      setError(`Error getting profile: ${err instanceof Error ? err.message : String(err)}`);
    }
  };
  

  const handleLogin = (): void => {
    if (!liff.isLoggedIn()) {
      liff.login();
    }
  };

  const handleLogout = (): void => {
    if (liff.isLoggedIn()) {
      liff.logout();
      setIsLoggedIn(false);
      setProfile(null);
    }
  };

  const handleSendMessage = async (): Promise<void> => {
    if (liff.isLoggedIn() && liff.isApiAvailable('shareTargetPicker')) {
      try {
        await liff.shareTargetPicker([{
          type: 'text',
          text: 'Hello from my LINE Mini App!'
        }]);
      } catch (err) {
        setError(`Error sending message: ${err instanceof Error ? err.message : String(err)}`);
      }
    } else {
      setError('Share target picker is not available.');
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">LINE Mini App</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!isLoggedIn ? (
          <button
            onClick={handleLogin}
            className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            type="button"
          >
            Login with LINE
          </button>
        ) : (
          <div className="space-y-4">
            {profile && (
              <div className="text-center">
                <img
                  src={profile.pictureUrl}
                  alt="Profile"
                  className="w-24 h-24 rounded-full mx-auto mb-2"
                />
                <p className="font-semibold">{profile.displayName}</p>
                <p className="text-gray-600">{profile.userId}</p>
              </div>
            )}
            
            <button
              onClick={() => void handleSendMessage()}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              type="button"
            >
              Send Message
            </button>
            
            <button
              onClick={handleLogout}
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
