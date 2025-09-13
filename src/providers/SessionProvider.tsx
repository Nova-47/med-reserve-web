// src/providers/SessionProvider.tsx
import { useEffect, useState } from "react";
import { AuthAPI } from "../api";
import { SessionCtx, type User } from "./session-context";

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    (async () => {
      try {
        setUser(await AuthAPI.me());
      } catch {
        setUser(null);
      }
    })();
  }, []);

  const login = (u: NonNullable<User>) => setUser(u);
  const logout = async () => {
    try {
      await AuthAPI.logout();
    } finally {
      setUser(null);
    }
  };
  const refresh = async () => {
    try {
      setUser(await AuthAPI.me());
    } catch {
      setUser(null);
    }
  };

  return (
    <SessionCtx.Provider value={{ user, login, logout, refresh }}>
      {children}
    </SessionCtx.Provider>
  );
}
