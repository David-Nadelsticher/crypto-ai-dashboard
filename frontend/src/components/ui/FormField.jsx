export default function FormField({ label, htmlFor, error, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-piggy-charcoal">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-sm text-piggy-negative" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
