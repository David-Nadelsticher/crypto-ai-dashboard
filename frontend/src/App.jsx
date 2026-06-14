import { BrowserRouter, Navigate, Route } from "react-router-dom";

import AnimatedRoutes from "./components/routes/AnimatedRoutes";

import AuthExpiryHandler from "./hooks/useAuthExpiryHandler";

import NotFoundRedirect from "./components/routes/NotFoundRedirect";

import { PublicOnlyRoute, RequireAuth } from "./components/routes/ProtectedRoute";

import { AuthProvider } from "./context/AuthContext";

import Dashboard from "./pages/Dashboard";

import Login from "./pages/Login";

import Onboarding from "./pages/Onboarding";

import Settings from "./pages/Settings";

import Signup from "./pages/Signup";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AuthExpiryHandler />
        <AnimatedRoutes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

          <Route element={<RequireAuth requireOnboarding={false} />}>
            <Route path="/onboarding" element={<Onboarding />} />
          </Route>

          <Route element={<RequireAuth requireOnboarding />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<NotFoundRedirect />} />
        </AnimatedRoutes>
      </BrowserRouter>
    </AuthProvider>
  );
}
