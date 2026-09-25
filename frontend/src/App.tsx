import type { ReactElement } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import ChatPage from "./pages/Chat";
import StoriesPage from "./pages/Stories";
import HighlightsPage from "./pages/Highlights";
import ProfilePage from "./pages/Profile";
import SettingsPage from "./pages/Settings";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";

function Protected({ children }: { children: ReactElement }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/"
        element={
          <Protected>
            <ChatPage />
          </Protected>
        }
      />
      <Route
        path="/chat"
        element={
          <Protected>
            <ChatPage />
          </Protected>
        }
      />
      <Route
        path="/stories"
        element={
          <Protected>
            <StoriesPage />
          </Protected>
        }
      />
      <Route
        path="/highlights"
        element={
          <Protected>
            <HighlightsPage />
          </Protected>
        }
      />
      <Route
        path="/profile"
        element={
          <Protected>
            <ProfilePage />
          </Protected>
        }
      />
      <Route
        path="/settings"
        element={
          <Protected>
            <SettingsPage />
          </Protected>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
