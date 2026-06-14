import { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthLayout, { AuthLink } from "../components/AuthLayout";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import FormField from "../components/ui/FormField";
import Input from "../components/ui/Input";
import { getApiErrorMessage } from "../utils/apiError";
import { resolvePostAuthPath } from "../utils/resolvePostAuthPath";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { login } = useAuth();

  const sessionExpired = searchParams.get("reason") === "session_expired";
  const signupSuccess = location.state?.signupSuccess === true;

  const [form, setForm] = useState({
    email: location.state?.email || "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function clearSessionNotice() {
    if (sessionExpired) {
      setSearchParams({}, { replace: true });
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    clearSessionNotice();
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    clearSessionNotice();
    setSubmitting(true);

    try {
      const user = await login(form.email, form.password);
      navigate(resolvePostAuthPath({ isAuthenticated: true, user }), { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, "We couldn't sign you in. Please check your email and password."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to access your personalized dashboard."
      footer={
        <>
          New here? <AuthLink to="/signup">Create an account</AuthLink>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {signupSuccess && (
          <Alert variant="success">Account created! Sign in to continue.</Alert>
        )}
        {sessionExpired && (
          <Alert variant="info">Your session expired. Please sign in again.</Alert>
        )}
        {error && <Alert variant="error">{error}</Alert>}

        <FormField label="Email" htmlFor="email">
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
          />
        </FormField>

        <FormField label="Password" htmlFor="password">
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
          />
        </FormField>

        <Button type="submit" variant="primary" size="md" fullWidth disabled={submitting}>
          {submitting ? "Signing in..." : "Log in"}
        </Button>
      </form>
    </AuthLayout>
  );
}
