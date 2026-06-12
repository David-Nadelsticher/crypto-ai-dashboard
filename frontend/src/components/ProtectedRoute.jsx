import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
    </div>
  );
}

export function PublicOnlyRoute() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  if (isAuthenticated) {
    return (
      <Navigate
        to={user.onboarding_completed ? "/dashboard" : "/onboarding"}
        replace
      />
    );
  }

  return <Outlet />;
}

export function RequireAuth({ requireOnboarding = false }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireOnboarding && !user.onboarding_completed) {
    return <Navigate to="/onboarding" replace />;
  }

  if (!requireOnboarding && user.onboarding_completed) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
