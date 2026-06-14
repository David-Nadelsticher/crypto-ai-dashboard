import { Link } from "react-router-dom";
import PiggyAvatar from "./ui/PiggyAvatar";

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="crypto-bg-pattern flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-card border border-piggy-border bg-piggy-card p-8 shadow-card">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center">
            <PiggyAvatar size="md" />
          </div>
          <p className="text-sm font-medium uppercase tracking-wider text-piggy-pink">
            Piggy Daily
          </p>
          <h1 className="mt-2 text-2xl font-bold text-piggy-charcoal">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-piggy-gray">{subtitle}</p>}
        </div>

        {children}

        {footer && <div className="mt-6 text-center text-sm text-piggy-gray">{footer}</div>}
      </div>
    </div>
  );
}

export function AuthLink({ to, children }) {
  return (
    <Link to={to} className="focus-ring font-medium text-piggy-pink hover:opacity-80">
      {children}
    </Link>
  );
}
