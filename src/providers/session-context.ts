import { createContext } from "react";

export type User = { email: string; name: string } | null;
export type SessionCtxType = {
  user: User;
  login: (u: NonNullable<User>) => void;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

export const SessionCtx = createContext<SessionCtxType | null>(null);
