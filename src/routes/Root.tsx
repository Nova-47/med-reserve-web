import { Outlet } from "react-router-dom";
import LanguageProvider from "../providers/LanguageProvider";
import SessionProvider from "../providers/SessionProvider";

export default function Root() {
  return (
    <LanguageProvider>
      <SessionProvider>
        <Outlet />
      </SessionProvider>
    </LanguageProvider>
  );
}
