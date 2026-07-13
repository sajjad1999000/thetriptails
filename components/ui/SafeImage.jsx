"use client";

export default function SafeImage({ src, alt, className }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={className}
      onError={(e) => e.currentTarget.remove()}
    />
  );
}