import { useState } from "react";

export default function LazyImage({
  src,
  alt = "",
  className = "",
  imgClassName = "",
  wrapperClassName = "",
  fallback = null,
  loading = "lazy",
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return fallback;
  }

  return (
    <div className={`relative ${wrapperClassName}`}>
      {!imageLoaded && (
        <div className="absolute inset-0 animate-pulse rounded-lg bg-piggy-border" aria-hidden="true" />
      )}
      <img
        src={src}
        alt={alt}
        loading={loading}
        className={`${imgClassName} transition-opacity duration-normal ease-product motion-reduce:transition-none ${imageLoaded ? "opacity-100" : "opacity-0"} ${className}`.trim()}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
      />
    </div>
  );
}
