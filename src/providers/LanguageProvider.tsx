import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import type { Language } from "../utils/translations";
import { LanguageCtx } from "./language-context";

export default function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const initial = (params.get("lang") ||
    localStorage.getItem("lang") ||
    "ko") as Language;
  const [lang, _setLang] = useState<Language>(initial);

  // URL에 lang이 없으면 한 번 채워넣기
  useEffect(() => {
    if (!params.get("lang")) {
      const next = new URLSearchParams(params);
      next.set("lang", lang);
      setParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLang = useCallback(
    (l: Language) => {
      localStorage.setItem("lang", l);
      _setLang(l);

      const next = new URLSearchParams(params);
      next.set("lang", l);
      setParams(next, { replace: true });
      navigate(`${location.pathname}?${next.toString()}`, { replace: true });
    },
    [params, setParams, navigate, location]
  );

  const value = useMemo(() => ({ lang, setLang }), [lang, setLang]);

  return <LanguageCtx.Provider value={value}>{children}</LanguageCtx.Provider>;
}
