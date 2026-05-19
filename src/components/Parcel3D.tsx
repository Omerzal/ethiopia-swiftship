/**
 * 3D-style parcel illustration built with pure CSS transforms.
 * No external 3D engine — just layered divs in preserve-3d space.
 */
export function Parcel3D({ size = 220, className = "" }: { size?: number; className?: string }) {
  const s = size;
  const half = s / 2;
  const faceBase =
    "absolute inset-0 rounded-[18px] border border-white/15 shadow-[inset_0_0_40px_rgba(255,255,255,0.05)]";
  return (
    <div
      className={`relative preserve-3d ${className}`}
      style={{ width: s, height: s, transformStyle: "preserve-3d" }}
    >
      {/* Top */}
      <div
        className={`${faceBase}`}
        style={{
          background:
            "linear-gradient(135deg, oklch(0.32 0.05 255), oklch(0.22 0.04 252))",
          transform: `rotateX(90deg) translateZ(${half}px)`,
        }}
      >
        <div className="absolute inset-x-[44%] inset-y-0 bg-gradient-to-b from-accent/70 via-primary/60 to-accent/70" />
        <div className="absolute inset-y-[44%] inset-x-0 bg-gradient-to-r from-accent/70 via-primary/60 to-accent/70" />
      </div>
      {/* Bottom */}
      <div
        className={`${faceBase}`}
        style={{
          background: "linear-gradient(135deg, oklch(0.18 0.03 252), oklch(0.12 0.02 250))",
          transform: `rotateX(-90deg) translateZ(${half}px)`,
        }}
      />
      {/* Front */}
      <div
        className={`${faceBase} grid place-items-center text-foreground/90`}
        style={{
          background:
            "linear-gradient(160deg, oklch(0.30 0.05 254), oklch(0.20 0.04 252))",
          transform: `translateZ(${half}px)`,
        }}
      >
        <div className="text-center">
          <div className="text-[10px] tracking-[0.3em] text-primary/90 uppercase">Parcel</div>
          {/* QR mock */}
          <div className="mt-2 grid grid-cols-7 gap-[3px] p-2 bg-foreground rounded-md">
            {Array.from({ length: 49 }).map((_, i) => (
              <div
                key={i}
                className={`size-2 rounded-[1px] ${
                  [0, 6, 8, 12, 14, 16, 22, 24, 26, 30, 34, 38, 42, 44, 48].includes(i)
                    ? "bg-background"
                    : "bg-transparent"
                }`}
              />
            ))}
          </div>
          <div className="mt-2 text-[10px] font-mono text-muted-foreground">PG-7F4K-9X2</div>
        </div>
        <div className="absolute top-2 left-2 right-2 flex justify-between text-[9px] font-mono text-muted-foreground">
          <span>ADD → DIR</span>
          <span className="text-accent">FRAGILE</span>
        </div>
      </div>
      {/* Back */}
      <div
        className={`${faceBase}`}
        style={{
          background: "linear-gradient(135deg, oklch(0.22 0.04 252), oklch(0.16 0.03 250))",
          transform: `translateZ(-${half}px) rotateY(180deg)`,
        }}
      />
      {/* Left */}
      <div
        className={`${faceBase}`}
        style={{
          background: "linear-gradient(135deg, oklch(0.20 0.04 252), oklch(0.14 0.03 250))",
          transform: `rotateY(-90deg) translateZ(${half}px)`,
        }}
      />
      {/* Right */}
      <div
        className={`${faceBase}`}
        style={{
          background: "linear-gradient(135deg, oklch(0.26 0.04 254), oklch(0.18 0.03 252))",
          transform: `rotateY(90deg) translateZ(${half}px)`,
        }}
      />
    </div>
  );
}
