import { BrowserRouter, Navigate, Route } from "react-router-dom";

import AnimatedRoutes from "./components/AnimatedRoutes";

import AuthExpiryHandler from "./components/AuthExpiryHandler";

import NotFoundRedirect from "./components/NotFoundRedirect";

import { PublicOnlyRoute, RequireAuth } from "./components/ProtectedRoute";

import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/Login";

import Onboarding from "./pages/Onboarding";

import Signup from "./pages/Signup";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AuthExpiryHandler />
        <AnimatedRoutes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

          <Route element={<RequireAuth requireOnboarding={false} />}>
            <Route path="/onboarding" element={<Onboarding />} />
          </Route>

          <Route path="*" element={<NotFoundRedirect />} />
        </AnimatedRoutes>
      </BrowserRouter>
    </AuthProvider>
  );
}
