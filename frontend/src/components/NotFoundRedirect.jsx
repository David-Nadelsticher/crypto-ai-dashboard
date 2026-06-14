import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { resolvePostAuthPath } from "../utils/resolvePostAuthPath";
import { LoadingScreen } from "./ProtectedRoute";

export default function NotFoundRedirect() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Navigate
      to={resolvePostAuthPath({ isAuthenticated, user })}
      replace
    />
  );
}
