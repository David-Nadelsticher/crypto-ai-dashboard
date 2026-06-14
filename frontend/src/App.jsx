import { BrowserRouter, Navigate, Route } from "react-router-dom";

import AnimatedRoutes from "./components/AnimatedRoutes";

import AuthExpiryHandler from "./components/AuthExpiryHandler";

import NotFoundRedirect from "./components/NotFoundRedirect";

import { PublicOnlyRoute } from "./components/ProtectedRoute";

import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/Login";

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

          <Route path="*" element={<NotFoundRedirect />} />
        </AnimatedRoutes>
      </BrowserRouter>
    </AuthProvider>
  );
}
