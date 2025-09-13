import { MainLanding } from "../components/MainLanding";
import { useLanguage } from "../providers/useLanguage";
import { useSession } from "../providers/useSession";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Toaster } from "sonner";

export default function MainPage() {
  const { lang } = useLanguage();
  const { user, logout } = useSession();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const go = (p: string) =>
    navigate({ pathname: p, search: params.toString() });

  return (
    <>
      <MainLanding
        language={lang}
        user={user}
        onBack={() => go("/")}
        onStartChat={() => go(user ? "/chat" : "/auth")}
        onLogin={() => go("/auth")}
        onLogout={logout}
        onShowBookings={() => go("/bookings")}
      />
      <Toaster />
    </>
  );
}
