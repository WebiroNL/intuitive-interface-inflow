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
      {/* Aurora hero layer */}
      <div className="aurora-hero" />
    </div>
  );
}
