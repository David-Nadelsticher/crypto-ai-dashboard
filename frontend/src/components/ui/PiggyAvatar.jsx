import { useState } from "react";

const sizeClasses = {
  sm: "h-10 w-10",
  md: "h-12 w-12",
  lg: "h-16 w-16",
};

function PiggyAvatarFallback({ className = "", size = "md" }) {
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label="Piggy Daily editor"
      className={`shrink-0 rounded-full ring-2 ring-piggy-border ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      <circle cx="32" cy="32" r="32" fill="#FF8BA7" />
      <ellipse cx="32" cy="36" rx="18" ry="14" fill="#FFC9A5" />
      <circle cx="22" cy="28" r="3" fill="#2E2A27" />
      <circle cx="42" cy="28" r="3" fill="#2E2A27" />
      <ellipse cx="32" cy="34" rx="5" ry="4" fill="#E8A0B0" />
      <circle cx="30" cy="33" r="1.5" fill="#2E2A27" />
      <circle cx="34" cy="33" r="1.5" fill="#2E2A27" />
      <rect x="16" y="24" width="32" height="8" rx="4" fill="#2E2A27" opacity="0.85" />
      <rect x="18" y="26" width="12" height="4" rx="2" fill="#555" />
      <rect x="34" y="26" width="12" height="4" rx="2" fill="#555" />
      <ellipse cx="16" cy="36" rx="5" ry="7" fill="#FF8BA7" />
      <ellipse cx="48" cy="36" rx="5" ry="7" fill="#FF8BA7" />
    </svg>
  );
}

export default function PiggyAvatar({ className = "", size = "md" }) {
  const [failed, setFailed] = useState(false);
  const classes = `shrink-0 rounded-full ring-2 ring-piggy-border object-cover object-center ${sizeClasses[size] || sizeClasses.md} ${className}`;

  if (failed) {
    return <PiggyAvatarFallback className={className} size={size} />;
  }

  return (
    <img
      src="/piggy-avatar-new.png"
      alt=""
      role="img"
      aria-label="Piggy Daily editor"
      className={classes}
      onError={() => setFailed(true)}
    />
  );
}
