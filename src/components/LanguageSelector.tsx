import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { translations } from "../utils/translations";
import type { Language } from "../utils/translations";
import { Globe } from "lucide-react";

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
  onStart: () => void;
}

const languageFlags = {
  ko: "🇰🇷",
  en: "🇺🇸",
  vi: "🇻🇳",
};

const languageNames = {
  ko: "한국어",
  en: "English",
  vi: "Tiếng Việt",
};

export function LanguageSelector({
  currentLanguage,
  onLanguageChange,
  onStart,
}: LanguageSelectorProps) {
  const t = translations[currentLanguage];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="mb-6">
          <Globe className="w-12 h-12 mx-auto mb-4 text-blue-600" />
          <h1 className="mb-2">{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>

        <div className="mb-8">
          <h3 className="mb-4">{t.selectLanguage}</h3>
          <div className="grid gap-3">
            {(Object.keys(translations) as Language[]).map((lang) => (
              <Button
                key={lang}
                variant={currentLanguage === lang ? "default" : "outline"}
                onClick={() => onLanguageChange(lang)}
                className="w-full justify-start gap-3 h-12"
              >
                <span className="text-xl">{languageFlags[lang]}</span>
                <span>{languageNames[lang]}</span>
              </Button>
            ))}
          </div>
        </div>

        <Button onClick={onStart} className="w-full" size="lg">
          계속하기 / Continue / Tiếp tục
        </Button>
      </Card>
    </div>
  );
}
