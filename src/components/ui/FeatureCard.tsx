import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: React.ReactNode;
  variant?: "default" | "solution";
}

export default function FeatureCard({ icon: Icon, title, description, variant = "default" }: FeatureCardProps) {
  const isSolution = variant === "solution";

  return (
    <div className={cn(
      "rounded-2xl p-5 sm:p-8 h-full w-full border transition-all duration-300 ease-out [@media(hover:hover)]:hover:scale-105",
      isSolution
        ? "border-brand-accent/25 bg-brand-accent/[0.03] shadow-[0_0_30px_rgba(37,99,235,0.15)] hover:shadow-[0_0_40px_rgba(37,99,235,0.25)] hover:border-brand-accent/40"
        : "border-brand-accent/15 bg-white/[0.02] shadow-[0_0_20px_rgba(37,99,235,0.08)] hover:shadow-[0_0_30px_rgba(37,99,235,0.15)] hover:border-brand-accent/30"
    )}>
      <div className={cn(
        "relative w-10 h-10 rounded-lg backdrop-blur-sm border flex items-center justify-center",
        isSolution
          ? "bg-brand-accent/[0.12] border-brand-accent/30 shadow-[0_0_16px_rgba(37,99,235,0.25)]"
          : "bg-brand-accent/[0.08] border-brand-accent/20 shadow-[0_0_12px_rgba(37,99,235,0.15)]"
      )}>
        <Icon className="w-5 h-5 text-brand-accent drop-shadow-[0_0_4px_rgba(37,99,235,0.4)]" strokeWidth={1.5} />
      </div>
      <h3 className="mt-4 text-base font-bold">{title}</h3>
      <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
