export interface UserProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

export interface AppState {
  profile: UserProfile | null;
  error: string;
  isLoggedIn: boolean;
}
