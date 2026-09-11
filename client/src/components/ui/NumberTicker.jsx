import React, { useEffect, useState } from "react";

export function NumberTicker({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 800,
  className = "",
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const startValue = displayValue;
    const numericValue = typeof value === "number" ? value : parseFloat(value) || 0;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = startValue + (numericValue - startValue) * easeProgress;
      setDisplayValue(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [value, duration]);

  const formatted = decimals > 0
    ? displayValue.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : Math.round(displayValue).toLocaleString();

  return (
    <span className={`inline-flex items-baseline font-display font-bold tabular-nums tracking-tight ${className}`}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
