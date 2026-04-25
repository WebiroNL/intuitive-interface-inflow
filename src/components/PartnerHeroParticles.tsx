import { useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Animated particle network background
 * Inspired by https://codepen.io/seanseansean/pen/vEjOvy
 * Particles drift around and draw connecting lines when within range.
 * Mouse interaction creates a focal point that strengthens nearby connections.
 */
export function PartnerHeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId = 0;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    };

    let particles: Particle[] = [];
    const target = { x: 0, y: 0, active: false };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Density scaled to area
      const count = Math.min(120, Math.floor((width * height) / 9000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.6 + 0.6,
      }));
      target.x = width / 2;
      target.y = height / 2;
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x >= 0 && y >= 0 && x <= rect.width && y <= rect.height) {
        target.x = x;
        target.y = y;
        target.active = true;
      } else {
        target.active = false;
      }
    };
    const onLeave = () => {
      target.active = false;
    };

    // Read primary color from CSS vars (HSL components like "220 90% 56%")
    const styles = getComputedStyle(document.documentElement);
    const primary = styles.getPropertyValue("--primary").trim() || "220 90% 56%";

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const maxDist = 130;
      const mouseDist = 180;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Particle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${primary} / 0.7)`;
        ctx.fill();

        // Connections between particles
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < maxDist) {
            const alpha = (1 - d / maxDist) * 0.35;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `hsl(${primary} / ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }

        // Connection to mouse target
        if (target.active) {
          const dx = p.x - target.x;
          const dy = p.y - target.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < mouseDist) {
            const alpha = (1 - d / mouseDist) * 0.55;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(target.x, target.y);
            ctx.strokeStyle = `hsl(${primary} / ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseout", onLeave);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
    };
  }, [isMobile]);

  if (isMobile) {
    return (
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 70% 30%, hsl(var(--primary) / 0.18) 0%, transparent 60%)",
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
