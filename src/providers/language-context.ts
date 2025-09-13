import { createContext } from "react";
import type { Language } from "../utils/translations";

export type LanguageCtxType = {
  lang: Language;
  setLang: (l: Language) => void;
};

export const LanguageCtx = createContext<LanguageCtxType | null>(null);
