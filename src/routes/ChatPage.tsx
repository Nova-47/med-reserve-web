// src/routes/ChatPage.tsx
import { ChatBot } from "../components/ChatBot";
import { useLanguage } from "../providers/useLanguage";
import { useSession } from "../providers/useSession";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { Toaster } from "sonner";

export default function ChatPage() {
  const { lang } = useLanguage();
  const { user } = useSession();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const go = (p: string) =>
    navigate({ pathname: p, search: params.toString() });

  if (!user) return <Navigate to={`/auth?${params.toString()}`} replace />;

  return (
    <>
      <ChatBot language={lang} user={user} onBack={() => go("/main")} />
      <Toaster />
    </>
  );
}
