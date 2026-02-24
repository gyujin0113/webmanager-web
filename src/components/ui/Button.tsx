import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-medium cursor-pointer transition-all duration-200 border min-h-[44px]",
  {
    variants: {
      variant: {
        primary: "border-border hover:border-foreground text-cta",
        outline: "border-border hover:border-foreground text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function Button({
  variant,
  href,
  children,
  className,
}: ButtonProps) {
  return (
    <a href={href} className={cn(buttonVariants({ variant }), className)}>
      {children}
    </a>
  );
}

export { buttonVariants };
