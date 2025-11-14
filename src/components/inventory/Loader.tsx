// Loader.tsx
import React, { useEffect, useMemo, useState, PropsWithChildren } from "react";

type LoaderProps = {
  /** Image/video src for the loader (e.g., animated webp/webm/gif/png). */
  src?: string;
  /** Overall size (container and img). */
  size?: number;
  /** Accessible label for screen readers. */
  label?: string;
  /** Tailwind class for rounding the inner media/fallback. */
  roundedClass?: string;
  /** Background classes for the container (ignored if `transparent`). */
  backgroundClass?: string;
  /** If true, container background is transparent. */
  transparent?: boolean;
  /** Extra classes for the container. */
  className?: string;
  /** Force using the fallback spinner, ignoring `src`. */
  forceFallback?: boolean;
  /** If true, covers the whole screen as an overlay. */
  fullscreen?: boolean;
  /** z-index for fullscreen overlay. */
  zIndex?: number;
};

const Loader: React.FC<LoaderProps> = ({
  src,
  size = 80,
  label = "Loading…",
  roundedClass = "rounded-2xl",
  backgroundClass = "bg-neutral-100 dark:bg-neutral-900/70 backdrop-blur",
  transparent = false,
  className = "",
  forceFallback = false,
  fullscreen = false,
  zIndex = 9999,
}) => {
  const [useFallback, setUseFallback] = useState(false);

  const prefersReducedMotion = () => {
    if (typeof window === "undefined" || !("matchMedia" in window)) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  };

  const shouldReduce = useMemo(() => prefersReducedMotion(), []);

  useEffect(() => {
    if (!src || forceFallback || shouldReduce) {
      setUseFallback(true);
      return;
    }

    let cancelled = false;
    const img = new Image();

    const onLoad = () => !cancelled && setUseFallback(false);
    const onError = () => !cancelled && setUseFallback(true);

    img.addEventListener("load", onLoad);
    img.addEventListener("error", onError);
    img.src = typeof src === "string" ? src : "";

    const safety = setTimeout(() => {
      if (!cancelled) setUseFallback(true);
    }, 1000);

    return () => {
      cancelled = true;
      clearTimeout(safety);
      img.removeEventListener("load", onLoad);
      img.removeEventListener("error", onError);
    };
  }, [src, forceFallback, shouldReduce]);

  const Container: React.FC<PropsWithChildren> = ({ children }) => (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className={[
        "inline-flex items-center justify-center",
        transparent ? "" : backgroundClass,
        roundedClass,
        "shadow-sm border border-black/5 dark:border-white/5",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        ...(fullscreen
          ? {
              position: "fixed" as const,
              inset: 0,
              width: "100vw",
              height: "100vh",
              minWidth: 0,
              minHeight: 0,
              zIndex,
              background: transparent ? "transparent" : "rgba(0,0,0,0.35)",
            }
          : null),
      }}
    >
      {children}
    </div>
  );

  return (
    <Container>
      {useFallback ? (
        <div
          className="relative"
          style={{ width: size * 0.55, height: size * 0.55 }}
          aria-hidden
        >
          <div className="box-border w-full h-full rounded-full border-[3px] border-neutral-300 dark:border-neutral-700" />
          {!shouldReduce && !forceFallback && (
            <div className="box-border w-full h-full rounded-full border-[3px] border-transparent border-t-neutral-500 dark:border-t-neutral-200 animate-spin" />
          )}
        </div>
      ) : (
        <img
          src={src}
          width={size}
          height={size}
          alt=""
          draggable={false}
          aria-hidden
          className={`${roundedClass} object-contain select-none pointer-events-none`}
          style={{ width: size * 0.82, height: size * 0.82 }}
          onError={() => setUseFallback(true)}
        />
      )}
    </Container>
  );
};

export default Loader;
