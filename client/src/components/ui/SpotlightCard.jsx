import React, { useRef, useState } from "react";

export function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(255, 255, 255, 0.04)",
  borderSpotlightColor = "rgba(255, 255, 255, 0.15)",
  ...props
}) {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/70 p-5 transition-colors duration-150 hover:border-zinc-700/80 ${className}`}
      {...props}
    >
      {/* Subtle Micro-illumination */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-200"
        style={{
          opacity,
          background: `radial-gradient(500px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 60%)`,
        }}
      />
      {/* Crisp 1px Highlight */}
      <div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-200"
        style={{
          opacity,
          background: `radial-gradient(350px circle at ${position.x}px ${position.y}px, ${borderSpotlightColor}, transparent 40%)`,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: "1px",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
