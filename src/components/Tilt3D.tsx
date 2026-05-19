import { useRef, type ReactNode, type MouseEvent } from "react";

/**
 * Mouse-tracking 3D tilt wrapper. Pure CSS transforms — no deps.
 * Adds depth, glare and parallax to any card.
 */
export function Tilt3D({
  children,
  className = "",
  max = 14,
  glare = true,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (0.5 - py) * max * 2;
    const ry = (px - 0.5) * max * 2;
    el.style.setProperty("--rx", `${rx}deg`);
    el.style.setProperty("--ry", `${ry}deg`);
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
  }

  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
  }

  return (
    <div className={`[perspective:1200px] ${className}`}>
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="relative h-full w-full transition-transform duration-200 ease-out [transform-style:preserve-3d] will-change-transform"
        style={{
          transform:
            "rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)) translateZ(0)",
        }}
      >
        {children}
        {glare && (
          <div
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 hover:opacity-100"
            style={{
              background:
                "radial-gradient(380px circle at var(--mx,50%) var(--my,50%), oklch(1 0 0 / 0.18), transparent 45%)",
              mixBlendMode: "screen",
            }}
          />
        )}
      </div>
    </div>
  );
}
