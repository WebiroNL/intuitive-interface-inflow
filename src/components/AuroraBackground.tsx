import { useIsMobile } from '@/hooks/use-mobile';

export function AuroraBackground() {
  const isMobile = useIsMobile();

  // Skip heavy animation on mobile for performance
  if (isMobile) {
    return (
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 80% 20%, hsl(var(--primary) / 0.15) 0%, transparent 60%),
                       radial-gradient(ellipse at 20% 80%, hsl(var(--accent) / 0.1) 0%, transparent 60%)`,
        }}
      />
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Aurora layer */}
      <div
        className="absolute inset-0"
        style={{
          ['--stripe-color' as string]: 'hsl(var(--background))',
          ['--stripes' as string]: `repeating-linear-gradient(
            100deg,
            var(--stripe-color) 0%,
            var(--stripe-color) 7%,
            transparent 10%,
            transparent 12%,
            var(--stripe-color) 16%
          )`,
          ['--rainbow' as string]: `repeating-linear-gradient(
            100deg,
            hsl(234 82% 57%) 10%,
            hsl(259 79% 61%) 15%,
            hsl(234 82% 57%) 20%,
            hsl(200 80% 60%) 25%,
            hsl(234 82% 57%) 30%
          )`,
          backgroundImage: 'var(--stripes), var(--rainbow)',
          backgroundSize: '300%, 200%',
          backgroundPosition: '50% 50%, 50% 50%',
          filter: 'blur(10px) invert(100%)',
          maskImage: 'radial-gradient(ellipse at 100% 0%, black 40%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 100% 0%, black 40%, transparent 70%)',
        }}
      >
        {/* Animated overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'var(--stripes), var(--rainbow)',
            backgroundSize: '200%, 100%',
            animation: 'smoothBg 60s linear infinite',
            backgroundAttachment: 'fixed',
            mixBlendMode: 'difference',
            ['--stripe-color' as string]: 'hsl(var(--background))',
            ['--stripes' as string]: `repeating-linear-gradient(
              100deg,
              var(--stripe-color) 0%,
              var(--stripe-color) 7%,
              transparent 10%,
              transparent 12%,
              var(--stripe-color) 16%
            )`,
            ['--rainbow' as string]: `repeating-linear-gradient(
              100deg,
              hsl(234 82% 57%) 10%,
              hsl(259 79% 61%) 15%,
              hsl(234 82% 57%) 20%,
              hsl(200 80% 60%) 25%,
              hsl(234 82% 57%) 30%
            )`,
          }}
        />
      </div>
    </div>
  );
}
