import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AUTH_EXPIRED_EVENT } from "../utils/authEvents";

export default function AuthExpiryHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    function handleAuthExpired() {
      navigate("/login?reason=session_expired", { replace: true });
    }

    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
  }, [navigate]);

  return null;
}
