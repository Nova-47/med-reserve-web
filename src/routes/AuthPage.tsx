import { Auth } from "../components/Auth";
import { useLanguage } from "../providers/useLanguage";
import { useSession } from "../providers/useSession";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Toaster } from "sonner";
import { useEffect } from "react";

export default function AuthPage() {
  const { lang } = useLanguage();
  const { user, login } = useSession();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  // next 파라미터가 있으면 그쪽으로, 없으면 /main
  const next = params.get("next") ?? "/main";
  const search = params.toString() ? `?${params.toString()}` : "";

  // 이미 로그인한 상태로 /auth에 오면 곧장 리다이렉트
  useEffect(() => {
    if (user) {
      navigate(`${next}${search}`, { replace: true });
    }
  }, [user, next, search, navigate]);

  const handleBack = () => {
    navigate(`/main${search}`);
  };

  const handleLogin = async (u: { email: string; name: string }) => {
    // login 이 Promise가 아니면 await 제거해도 됨
    await login(u);
    navigate(`${next}${search}`, { replace: true }); // 뒤로가기 눌러도 /auth 안 돌아오게 replace 권장
  };

  return (
    <>
      <Auth language={lang} onBack={handleBack} onLogin={handleLogin} />
      <Toaster />
    </>
  );
}
