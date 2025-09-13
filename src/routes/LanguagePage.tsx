import { LanguageSelector } from "../components/LanguageSelector";
import { useLanguage } from "../providers/useLanguage";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function LanguagePage() {
  const { lang, setLang } = useLanguage();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const go = (path: string) =>
    navigate({ pathname: path, search: params.toString() });

  return (
    <LanguageSelector
      currentLanguage={lang}
      onLanguageChange={setLang}
      onStart={() => go("/main")}
    />
  );
}
