import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "muted";
}

export function Badge({ variant = "default", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variant === "default"
          ? "bg-primary/15 text-primary-foreground"
          : "bg-muted text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
