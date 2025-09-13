import { createBrowserRouter } from "react-router-dom";
import Root from "./routes/Root";
import LanguagePage from "./routes/LanguagePage";
import MainPage from "./routes/MainPage";
import AuthPage from "./routes/AuthPage";
import ChatPage from "./routes/ChatPage";
import BookingsPage from "./routes/BookingsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />, //  Provider는 여기에서 감쌈
    children: [
      { index: true, element: <LanguagePage /> },
      { path: "main", element: <MainPage /> },
      { path: "auth", element: <AuthPage /> },
      { path: "chat", element: <ChatPage /> },
      { path: "bookings", element: <BookingsPage /> },
    ],
  },
]);
