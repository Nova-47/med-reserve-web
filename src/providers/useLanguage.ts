// src/providers/useLanguage.ts
import { useContext } from "react";
import { LanguageCtx } from "./language-context";

export function useLanguage() {
  const ctx = useContext(LanguageCtx);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
