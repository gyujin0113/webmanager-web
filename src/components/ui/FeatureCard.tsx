import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: React.ReactNode;
}

export default function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="rounded-2xl p-8 border border-brand-accent/15 h-full w-full bg-white/[0.02] shadow-[0_0_20px_rgba(37,99,235,0.08)] transition-all duration-300 ease-out hover:scale-105 hover:shadow-[0_0_30px_rgba(37,99,235,0.15)] hover:border-brand-accent/30">
      <div className="relative w-10 h-10 rounded-lg bg-brand-accent/[0.08] backdrop-blur-sm border border-brand-accent/20 flex items-center justify-center shadow-[0_0_12px_rgba(37,99,235,0.15)]">
        <Icon className="w-5 h-5 text-brand-accent drop-shadow-[0_0_4px_rgba(37,99,235,0.4)]" strokeWidth={1.5} />
      </div>
      <h3 className="mt-4 text-base font-bold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
