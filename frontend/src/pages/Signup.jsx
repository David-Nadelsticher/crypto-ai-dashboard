import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api/auth";
import AuthLayout, { AuthLink } from "../components/AuthLayout";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import FormField from "../components/ui/FormField";
import Input from "../components/ui/Input";
import { getApiErrorMessage } from "../utils/apiError";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError("Password should have at least 8 characters.");
      return;
    }

    setSubmitting(true);

    try {
      await signup(form);
      navigate("/login", { state: { email: form.email, signupSuccess: true } });
    } catch (err) {
      setError(getApiErrorMessage(err, "We couldn't create your account. Please try again."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start building your personalized crypto dashboard."
      footer={
        <>
          Already have an account? <AuthLink to="/login">Log in</AuthLink>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <Alert variant="error">{error}</Alert>}

        <FormField label="Name" htmlFor="name">
          <Input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Jane Doe"
          />
        </FormField>

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
            minLength={8}
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
          />
          <p className="mt-1.5 text-xs text-piggy-gray">Use at least 8 characters.</p>
        </FormField>

        <Button type="submit" variant="primary" size="md" fullWidth disabled={submitting}>
          {submitting ? "Creating account..." : "Sign up"}
        </Button>
      </form>
    </AuthLayout>
  );
}
