
import React, { useState, useEffect } from 'react';
import { AuthContext, User } from './AuthContextContext';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const member = localStorage.getItem('memberProfile');
    if (member) {
      try {
        const parsed = JSON.parse(member);
        if (parsed && parsed.email) setUser({ email: parsed.email, name: parsed.name });
      } catch {
        // Ignore JSON parse errors
      }
    }
  }, []);

  const signOut = () => {
    localStorage.removeItem('memberProfile');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

