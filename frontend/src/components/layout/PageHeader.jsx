import { Link } from "react-router-dom";

export default function PageHeader({ backTo, backLabel = "Back", title, description }) {
  return (
    <div className="mb-8">
      {backTo && (
        <Link
          to={backTo}
          className="focus-ring text-sm font-medium text-piggy-pink hover:opacity-80"
        >
          ← {backLabel}
        </Link>
      )}
      <h1 className={`font-heading text-3xl font-bold text-piggy-charcoal ${backTo ? "mt-4" : ""}`}>
        {title}
      </h1>
      {description && <p className="mt-2 text-piggy-gray">{description}</p>}
    </div>
  );
}
