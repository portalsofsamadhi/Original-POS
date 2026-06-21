import { createContext } from 'react';

export interface User {
  email: string;
  name?: string;
}

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
