import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext, type User } from "./AuthContextContext";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);

  useEffect(() => {
    try {
      const member = localStorage.getItem("memberProfile");
      if (member) {
        const parsed = JSON.parse(member) as User;
        if (parsed?.email) {
          setUserState({ email: parsed.email, name: parsed.name });
        }
      }
    } catch {
      /* ignore corrupt session */
    }
  }, []);

  const setUser = useCallback((next: User | null) => {
    setUserState(next);
  }, []);

  const signOut = useCallback(() => {
    try {
      localStorage.removeItem("memberProfile");
    } catch {
      /* ignore */
    }
    setUserState(null);
  }, []);

  const value = useMemo(() => ({ user, setUser, signOut }), [user, setUser, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
