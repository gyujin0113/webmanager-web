export default function Logo({ className }: { className?: string }) {
  return (
    <span
      className={`flex items-center gap-2.5 ${className ?? ""}`}
      role="img"
      aria-label="Web Manager"
    >
      {/* Icon mark — favicon */}
      <svg
        width="30"
        height="30"
        viewBox="0 0 32 32"
        fill="none"
      >
        <rect x="0.5" y="0.5" width="31" height="31" rx="6" fill="#0a0a0a" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <path
          d="M4 12 L7 20 L10 12 L13 20 L16 12"
          stroke="#2563eb"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 20 L19 12 L22 20 L25 12 L28 20"
          stroke="#2563eb"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Wordmark */}
      <span className="text-[15px] font-semibold tracking-tight text-foreground">
        Web Manager
      </span>
    </span>
  );
}
