import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { translations } from "../utils/translations";
import type { Language } from "../utils/translations";
import { ArrowLeft, Heart, Copy, Mail, Key, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { AuthAPI, isApiError } from "../api";

interface AuthProps {
  language: Language;
  onBack: () => void;
  onLogin: (user: { email: string; name: string }) => void;
}

type AuthStep = "email" | "token-generated" | "token-input";

export function Auth({ language, onBack, onLogin }: AuthProps) {
  const [step, setStep] = useState<AuthStep>("email");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [generatedToken, setGeneratedToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const t = translations[language];

  const generateToken = async () => {
    if (!email.trim()) {
      toast.error(t.auth.emailRequired);
      return;
    }
    setIsLoading(true);
    try {
      const res = await AuthAPI.requestMagic(email);
      // DEBUG 환경에서만 demo_token이 옵니다(운영은 이메일 확인 유도)
      setGeneratedToken(res.demo_token ?? "");
      setStep("token-generated");
      toast.success(t.auth.tokenGenerated);
    } catch (e: unknown) {
      const msg = isApiError(e) ? e.message : t.auth.loginError;
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!generatedToken) {
      toast.error("표시할 토큰이 없습니다. 이메일을 확인하세요.");
      return;
    }
    try {
      await navigator.clipboard.writeText(generatedToken);
      toast.success(t.auth.tokenCopied);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = generatedToken;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      toast.success(t.auth.tokenCopied);
    }
  };
  const handleTokenLogin = async () => {
    if (!token.trim()) {
      toast.error(t.auth.tokenRequired);
      return;
    }
    setIsLoading(true);
    try {
      const res = await AuthAPI.verifyMagic(token);
      toast.success(t.auth.loginSuccess);
      onLogin({ email: res.user.email, name: res.user.name });
      // (선택) const me = await AuthAPI.me();
    } catch (e: unknown) {
      const msg = isApiError(e) ? e.message : t.auth.loginError;
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const resetToEmail = () => {
    setStep("email");
    setEmail("");
    setToken("");
    setGeneratedToken("");
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Heart className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-lg font-semibold text-slate-900">
                    {t.title}
                  </h1>
                </div>
              </div>
            </div>

            <Badge
              variant="secondary"
              className="bg-blue-50 text-blue-700 border-blue-200"
            >
              {language === "ko" && "한국어"}
              {language === "en" && "English"}
              {language === "vi" && "Tiếng Việt"}
            </Badge>
          </div>
        </div>
      </header>

      {/* Auth Form */}
      <div className="flex items-center justify-center py-20 px-4">
        <Card className="w-full max-w-md p-8">
          {step === "email" && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  {t.auth.magicLinkTitle}
                </h2>
                <p className="text-slate-600">{t.auth.magicLinkDescription}</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t.fields.email}
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    required
                  />
                </div>

                <Button
                  onClick={generateToken}
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      처리중...
                    </div>
                  ) : (
                    t.auth.generateToken
                  )}
                </Button>
              </div>
            </>
          )}

          {step === "token-generated" && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  {t.auth.tokenGenerated}
                </h2>
                <p className="text-slate-600 mb-4">{t.auth.tokenNote}</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t.auth.yourToken}
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={generatedToken}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={copyToClipboard}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={resetToEmail}
                    className="flex-1"
                  >
                    {t.auth.backToEmail}
                  </Button>
                  <Button
                    onClick={() => setStep("token-input")}
                    className="flex-1"
                  >
                    {t.auth.enterToken}
                  </Button>
                </div>
              </div>

              <div className="mt-6 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-xs text-amber-700 text-center">
                  {language === "ko" && "데모용: 실제로는 이메일로 전송됩니다"}
                  {language === "en" &&
                    "Demo: In reality, this would be sent via email"}
                  {language === "vi" && "Demo: Thực tế sẽ được gửi qua email"}
                </p>
              </div>
            </>
          )}

          {step === "token-input" && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Key className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  {t.auth.tokenInputTitle}
                </h2>
                <p className="text-slate-600">{t.auth.tokenInputDescription}</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">관리 토큰</label>
                  <Input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="MT-1234567890-ABCDEFGH"
                    className="font-mono"
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={resetToEmail}
                    className="flex-1"
                  >
                    {t.auth.backToEmail}
                  </Button>
                  <Button
                    onClick={handleTokenLogin}
                    className="flex-1"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        처리중...
                      </div>
                    ) : (
                      t.buttons.login
                    )}
                  </Button>
                </div>
              </div>

              {/* Auto-fill for demo */}
              {generatedToken && (
                <div className="mt-6 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-600 text-center mb-2">
                    {language === "ko" && "데모용: 자동 입력"}
                    {language === "en" && "Demo: Auto-fill"}
                    {language === "vi" && "Demo: Tự động điền"}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setToken(generatedToken)}
                    className="w-full text-xs"
                  >
                    {generatedToken}
                  </Button>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
