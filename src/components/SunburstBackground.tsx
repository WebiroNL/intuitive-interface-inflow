import { useEffect, useRef, useCallback } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface Spoke {
  angle: number;
  len: number;
  dotR: number;
  opacity: number;
  breathPhase: number;
  breathSpeed: number;
  breathAmp: number;
}

export function SunburstBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: -9999, y: -9999, sx: -9999, sy: -9999 });
  const spokesRef = useRef<Spoke[]>([]);
  const tRef = useRef(0);
  const { theme } = useTheme();
  const themeRef = useRef(theme);

  // Keep theme ref in sync
  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  const SPOKE_COUNT = 180;
  const REPULSE_RADIUS = 140;
  const REPULSE_STRENGTH = 90;

  const initSpokes = useCallback((W: number, H: number) => {
    const spokes: Spoke[] = [];
    for (let i = 0; i < SPOKE_COUNT; i++) {
      spokes.push({
        angle: Math.PI * 0.01 + Math.random() * Math.PI * 0.98,
        len: 100 + Math.pow(Math.random(), 0.6) * Math.min(W, H) * 0.85,
        dotR: 0.8 + Math.random() * 2.2,
        opacity: 0.35 + Math.random() * 0.65,
        breathPhase: Math.random() * Math.PI * 2,
        breathSpeed: 0.012 + Math.random() * 0.010,
        breathAmp: 0.03 + Math.random() * 0.05,
      });
    }
    spokesRef.current = spokes;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = canvas.width = canvas.offsetWidth * 2;
    let H = canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    initSpokes(W / 2, H / 2);

    const draw = () => {
      const m = mouseRef.current;
      m.sx += (m.x - m.sx) * 0.07;
      m.sy += (m.y - m.sy) * 0.07;

      const w = W / 2;
      const h = H / 2;

      ctx.clearRect(0, 0, w, h);

      // Background: theme base + radial gradient glow
      const isDark = themeRef.current === 'dark';
      ctx.fillStyle = isDark ? 'hsl(270, 6%, 7%)' : 'hsl(0, 0%, 97%)';
      ctx.fillRect(0, 0, w, h);

      // Sunrise-style radial gradient — warm glow rising from bottom center
      const rg = ctx.createRadialGradient(w / 2, h * 1.05, 0, w / 2, h * 0.6, Math.min(w, h) * 0.7);
      if (isDark) {
        rg.addColorStop(0.00, 'rgba(138, 79, 232, 0.6)');
        rg.addColorStop(0.15, 'rgba(120, 60, 220, 0.4)');
        rg.addColorStop(0.35, 'rgba(80, 50, 200, 0.2)');
        rg.addColorStop(0.55, 'rgba(58, 77, 234, 0.08)');
        rg.addColorStop(1.00, 'rgba(0, 0, 0, 0)');
      } else {
        rg.addColorStop(0.00, 'rgba(180, 130, 240, 0.55)');
        rg.addColorStop(0.12, 'rgba(160, 110, 230, 0.4)');
        rg.addColorStop(0.30, 'rgba(140, 90, 220, 0.25)');
        rg.addColorStop(0.50, 'rgba(120, 80, 210, 0.12)');
        rg.addColorStop(0.70, 'rgba(200, 190, 240, 0.05)');
        rg.addColorStop(1.00, 'rgba(0, 0, 0, 0)');
      }
      ctx.fillStyle = rg;
      ctx.fillRect(0, 0, w, h);

      // Secondary warm highlight — subtle golden kiss at the horizon
      const rg2 = ctx.createRadialGradient(w / 2, h * 1.02, 0, w / 2, h * 0.85, Math.min(w, h) * 0.35);
      if (isDark) {
        rg2.addColorStop(0.00, 'rgba(255, 215, 92, 0.12)');
        rg2.addColorStop(0.40, 'rgba(255, 180, 100, 0.05)');
        rg2.addColorStop(1.00, 'rgba(0, 0, 0, 0)');
      } else {
        rg2.addColorStop(0.00, 'rgba(255, 220, 140, 0.2)');
        rg2.addColorStop(0.35, 'rgba(255, 200, 120, 0.08)');
        rg2.addColorStop(1.00, 'rgba(0, 0, 0, 0)');
      }
      ctx.fillStyle = rg2;
      ctx.fillRect(0, 0, w, h);

      const originX = w / 2;
      const originY = h + 10;
      const t = tRef.current;

      spokesRef.current.forEach(s => {
        const breath = Math.sin(t * s.breathSpeed + s.breathPhase);
        const breathLen = s.len * (1 + breath * s.breathAmp);

        let ex = originX + Math.cos(s.angle) * breathLen;
        let ey = originY - Math.sin(s.angle) * breathLen;

        const dx = ex - m.sx;
        const dy = ey - m.sy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < REPULSE_RADIUS && dist > 0) {
          const force = (1 - dist / REPULSE_RADIUS) * REPULSE_STRENGTH;
          const ang = Math.atan2(dy, dx);
          ex += Math.cos(ang) * force;
          ey += Math.sin(ang) * force;
        }

        // Aurora/hero colors: blue → purple gradient (same as hero banner)
        const frac = Math.min(s.len / (Math.min(w, h) * 0.85), 1);
        // #3A4DEA (58,77,234) → #8A4FE8 (138,79,232) → #FFD75C (255,215,92)
        const r = Math.round(58 + frac * 80);
        const g = Math.round(77 + frac * 2);
        const b = Math.round(234 - frac * 2);

        const lw = 0.55 + (breath + 1) * 0.15;

        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = `rgba(${r},${g},${b},${(s.opacity * 0.35).toFixed(2)})`;
        ctx.lineWidth = lw;
        ctx.stroke();

        // Dots: Webiro blue (#3A4DEA) at tips
        const dotR = 58;
        const dotG = 77;
        const dotB = 234;
        ctx.beginPath();
        ctx.arc(ex, ey, s.dotR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${Math.min(dotR, 255)},${Math.min(dotG, 255)},${Math.max(dotB, 0)},${(s.opacity * 0.8).toFixed(2)})`;
        ctx.fill();
      });

      tRef.current++;
      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    // Mouse events on the SECTION parent, not just canvas
    const section = canvas.closest('section');
    const target = section || canvas;

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };
    const onTouch = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.touches[0].clientX - rect.left;
      mouseRef.current.y = e.touches[0].clientY - rect.top;
    };
    const onResize = () => {
      W = canvas.width = canvas.offsetWidth * 2;
      H = canvas.height = canvas.offsetHeight * 2;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(2, 2);
      initSpokes(W / 2, H / 2);
    };

    target.addEventListener('mousemove', onMove as EventListener);
    target.addEventListener('mouseleave', onLeave);
    target.addEventListener('touchmove', onTouch as EventListener, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      target.removeEventListener('mousemove', onMove as EventListener);
      target.removeEventListener('mouseleave', onLeave);
      target.removeEventListener('touchmove', onTouch as EventListener);
      window.removeEventListener('resize', onResize);
    };
  }, [initSpokes]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
    />
  );
}

export default SunburstBackground;
