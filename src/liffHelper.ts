/* eslint-disable @typescript-eslint/no-explicit-any */
import liff from '@line/liff';

export const initializeLiff = async (liffId: string): Promise<void> => {
  try {
    await liff.init({ liffId });
    console.log("LIFF initialized");
  } catch (error) {
    console.error("LIFF initialization failed:", error);
    throw error;
  }
};

export const getProfile = async () : Promise<any> => {
  try {
    const profile = await liff.getProfile();
    return profile;
  } catch (error) {
    console.error("Failed to get profile:", error);
    return null;
  }
};

export const isLoggedIn = (): boolean => liff.isLoggedIn();

export const login = (): void => {
  if (!isLoggedIn()) {
    liff.login();
  }
};

export const logout = (): void => {
  if (isLoggedIn()) {
    liff.logout();
    window.location.reload();
  }
};
