import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

export function Spinner({ className = "", size = "md" }) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div className={cn("flex items-center justify-center p-4", className)}>
      <Loader2 className={cn("animate-spin text-indigo-500", sizes[size] || sizes.md)} />
    </div>
  );
}
