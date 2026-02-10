interface ButtonProps {
  variant?: "primary" | "outline";
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function Button({
  variant = "primary",
  href,
  children,
  className = "",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-medium cursor-pointer transition-all duration-200 border border-border hover:border-foreground";
  const variants = {
    primary: "text-cta",
    outline: "text-muted",
  };

  return (
    <a href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </a>
  );
}
