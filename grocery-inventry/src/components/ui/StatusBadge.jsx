import { cn } from "../../lib/utils";

const variantStyles = {
  success: "badge-success",
  error: "badge-error",
  warning: "badge-warning",
  info: "badge-info",
  default: "bg-muted text-muted-foreground border border-border",
};

function StatusBadge({ variant = "default", children, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export { StatusBadge };
