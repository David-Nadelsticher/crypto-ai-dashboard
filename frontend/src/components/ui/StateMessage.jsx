function ErrorIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function EmptyIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4"
      />
    </svg>
  );
}

const VARIANTS = {
  error: {
    icon: ErrorIcon,
    container: "border-piggy-negative/30 bg-piggy-negative/5 text-piggy-negative",
    iconColor: "text-piggy-negative",
  },
  empty: {
    icon: EmptyIcon,
    container: "border-piggy-border bg-piggy-cream/50 text-piggy-gray",
    iconColor: "text-piggy-gray",
  },
};

export default function StateMessage({ variant = "empty", message, onRetry, retryLabel = "Try again" }) {
  const config = VARIANTS[variant];
  const Icon = config.icon;

  return (
    <div className={`motion-fade-in flex items-start gap-3 rounded-lg border p-4 ${config.container}`}>
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${config.iconColor}`} />
      <div className="flex-1">
        <p className="text-sm">{message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="focus-ring mt-2 text-sm font-medium text-piggy-pink hover:opacity-80"
          >
            {retryLabel}
          </button>
        )}
      </div>
    </div>
  );
}
