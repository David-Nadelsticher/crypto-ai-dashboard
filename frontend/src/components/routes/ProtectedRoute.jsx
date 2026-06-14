import { Navigate, Outlet } from "react-router-dom";
import PiggyAvatar from "../brand/PiggyAvatar";
import Spinner from "../ui/Spinner";
import { useAuth } from "../../context/AuthContext";
import { resolvePostAuthPath } from "../../utils/resolvePostAuthPath";

export function LoadingScreen() {
  return (
    <div className="crypto-bg-pattern flex min-h-screen flex-col items-center justify-center gap-4">
      <PiggyAvatar size="sm" className="motion-scale-in motion-reduce:animate-none" />
      <Spinner size="lg" variant="ring" />
      <p
        className="text-sm text-piggy-gray motion-slide-up motion-reduce:animate-none"
        style={{ "--motion-delay": "80ms" }}
      >
        Piggy is preparing today&apos;s brief…
      </p>
    </div>
  );
}

export function PublicOnlyRoute() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  if (isAuthenticated) {
    return (
      <Navigate
        to={resolvePostAuthPath({ isAuthenticated, user })}
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
