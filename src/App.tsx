import { useState, useEffect } from "react";
import { LanguageSelector } from "./components/LanguageSelector";
import { MainLanding } from "./components/MainLanding";
import { ChatBot } from "./components/ChatBot";
import { Auth } from "./components/Auth";
import { MyBookings } from "./components/MyBookings";
import type { Language } from "./utils/translations";
import { Toaster } from "sonner";
import { AuthAPI } from "./api";

type AppState = "language" | "main" | "chat" | "auth" | "bookings";

interface User {
  email: string;
  name: string;
}

export default function App() {
  const [currentState, setCurrentState] = useState<AppState>("language");
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("ko");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // 앱 시작 시 서버 세션으로 로그인 상태 확인
    (async () => {
      try {
        const me = await AuthAPI.me();
        setUser(me);
      } catch {
        setUser(null);
      }
    })();
  }, []);

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language);
  };

  const handleStart = () => {
    setCurrentState("main");
  };

  const handleBackToLanguage = () => {
    setCurrentState("language");
  };

  const handleStartChat = () => {
    if (!user) {
      setCurrentState("auth");
    } else {
      setCurrentState("chat");
    }
  };

  const handleBackToMain = () => {
    setCurrentState("main");
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentState("main");
  };

  const handleLogout = async () => {
    try {
      await AuthAPI.logout(); // 서버 세션 로그아웃
    } finally {
      setUser(null);
      setCurrentState("main");
    }
  };

  const handleShowAuth = () => {
    setCurrentState("auth");
  };

  const handleShowBookings = () => {
    setCurrentState("bookings");
  };

  if (currentState === "language") {
    return (
      <LanguageSelector
        currentLanguage={selectedLanguage}
        onLanguageChange={handleLanguageChange}
        onStart={handleStart}
      />
    );
  }

  if (currentState === "main") {
    return (
      <>
        <MainLanding
          language={selectedLanguage}
          user={user}
          onBack={handleBackToLanguage}
          onStartChat={handleStartChat}
          onLogin={handleShowAuth}
          onLogout={handleLogout}
          onShowBookings={handleShowBookings}
        />
        <Toaster />
      </>
    );
  }

  if (currentState === "auth") {
    return (
      <>
        <Auth
          language={selectedLanguage}
          onBack={handleBackToMain}
          onLogin={handleLogin}
        />
        <Toaster />
      </>
    );
  }

  if (currentState === "bookings") {
    if (!user) {
      setCurrentState("auth");
      return null;
    }
    return (
      <>
        <MyBookings
          language={selectedLanguage}
          user={user}
          onBack={handleBackToMain}
        />
        <Toaster />
      </>
    );
  }

  return (
    <>
      <ChatBot
        language={selectedLanguage}
        user={user}
        onBack={handleBackToMain}
      />
      <Toaster />
    </>
  );
}
