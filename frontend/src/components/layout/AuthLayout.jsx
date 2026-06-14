import { Link } from "react-router-dom";
import BrandHeader from "./BrandHeader";
import PageLayout from "./PageLayout";

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <PageLayout maxWidth="md" centered>
      <div className="w-full rounded-card border border-piggy-border bg-piggy-card p-8 shadow-card">
        <BrandHeader
          title={title}
          subtitle={subtitle}
          overline="Piggy Daily"
          titleClassName="text-2xl font-bold text-piggy-charcoal"
        />

        {children}

        {footer && <div className="mt-6 text-center text-sm text-piggy-gray">{footer}</div>}
      </div>
    </PageLayout>
  );
}

export function AuthLink({ to, children }) {
  return (
    <Link to={to} className="focus-ring font-medium text-piggy-pink hover:opacity-80">
      {children}
    </Link>
  );
}
