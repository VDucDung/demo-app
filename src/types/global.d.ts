interface KlaytnAPI {
  enable: () => Promise<string[]>;
  selectedAddress: string | null;
  networkVersion: string;
  isKaikas?: boolean;
  on: (eventName: string, handler: (accounts: string[]) => void) => void;
  removeListener: (eventName: string, handler: (accounts: string[]) => void) => void;
}

declare global {
  interface Window {
    klaytn?: KlaytnAPI;
  }
}

export {};
