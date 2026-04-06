// Simple robot mascot SVG — no dependencies.

type Props = {
  size?: number;
  /** celebrate: green checkmark badge; think: question mark badge */
  variant?: 'default' | 'celebrate' | 'think';
  className?: string;
};

export function Mascot({ size = 56, variant = 'default', className = '' }: Props) {
  return (
    <div className={`relative inline-flex shrink-0 ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        {/* Antenna stem */}
        <rect x="29" y="5" width="6" height="11" rx="3" fill="var(--primary, #7C6AF6)" />
        {/* Antenna tip */}
        <circle cx="32" cy="4" r="4" fill="#a590ff" />

        {/* Head */}
        <rect x="8" y="14" width="48" height="36" rx="12" fill="var(--primary, #7C6AF6)" />

        {/* Left eye bg */}
        <rect x="15" y="22" width="13" height="10" rx="4" fill="rgba(0,0,0,0.45)" />
        {/* Right eye bg */}
        <rect x="36" y="22" width="13" height="10" rx="4" fill="rgba(0,0,0,0.45)" />

        {/* Pupils */}
        <circle cx="21" cy="27" r="3" fill="white" />
        <circle cx="43" cy="27" r="3" fill="white" />

        {/* Eye shine */}
        <circle cx="22.5" cy="25.5" r="1" fill="white" opacity="0.7" />
        <circle cx="44.5" cy="25.5" r="1" fill="white" opacity="0.7" />

        {/* Smile */}
        <path d="M22 38 Q32 45 42 38" stroke="rgba(0,0,0,0.4)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M22 37 Q32 44 42 37" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.9" />

        {/* Ear nubs */}
        <rect x="4" y="26" width="5" height="8" rx="2.5" fill="var(--primary, #7C6AF6)" />
        <rect x="55" y="26" width="5" height="8" rx="2.5" fill="var(--primary, #7C6AF6)" />
      </svg>

      {/* Badge overlay */}
      {variant === 'celebrate' && (
        <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 border-2 border-[--background]">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5.5L4 7.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
      {variant === 'think' && (
        <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 border-2 border-[--background]">
          <span className="text-white font-bold text-[9px]">?</span>
        </span>
      )}
    </div>
  );
}
