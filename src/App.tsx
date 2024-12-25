/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  initializeLiff,
  getProfile,
  isLoggedIn,
  login,
  logout,
} from "./liffHelper";

const App = () => {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const liffId = import.meta.env.VITE_LIFF_ID; 
    initializeLiff(liffId).then(() => {
      if (isLoggedIn()) {
        loadUserProfile();
      }
    });
  }, []);

  const loadUserProfile = async () => {
    const userProfile = await getProfile();
    setProfile(userProfile);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div className="p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">LINE Mini App</h1>
      
      {!profile ? (
        <button 
          onClick={login}
          className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors duration-200 shadow-md"
        >
          Login with LINE
        </button>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <img
              src={profile.pictureUrl}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-green-500 shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          
          <p className="text-lg font-medium text-gray-700">
            Name: <span className="text-gray-900">{profile.displayName}</span>
          </p>
          
          <button 
            onClick={logout}
            className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-md"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  </div>
  );
};

export default App;
