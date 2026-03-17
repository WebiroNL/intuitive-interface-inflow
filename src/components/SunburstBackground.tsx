import { useEffect, useRef, useCallback } from 'react';

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

    let W = canvas.width = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;
    initSpokes(W, H);

    const draw = () => {
      const m = mouseRef.current;
      m.sx += (m.x - m.sx) * 0.07;
      m.sy += (m.y - m.sy) * 0.07;

      ctx.clearRect(0, 0, W, H);

      // Webiro-branded background: deep blue center → purple edges
      const cx = W / 2;
      const bg = ctx.createRadialGradient(cx, H * 0.9, 0, cx, H * 0.45, Math.max(W, H) * 0.92);
      bg.addColorStop(0.00, '#3A4DEA');  // webiro blue
      bg.addColorStop(0.18, '#5B4FE8');
      bg.addColorStop(0.45, '#8A4FE8');  // webiro purple
      bg.addColorStop(0.75, '#6B5CE0');
      bg.addColorStop(1.00, '#1a1a2e');  // dark
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      const originX = W / 2;
      const originY = H + 10;
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

        // Webiro color gradient: blue near origin → purple/yellow at tips
        const frac = Math.min(s.len / (Math.min(W, H) * 0.85), 1);
        const r = Math.round(58 + frac * 80);    // 58 → 138 (blue→purple)
        const g = Math.round(77 - frac * 20);     // 77 → 57
        const b = Math.round(234 - frac * 2);     // 234 → 232

        const lw = 0.55 + (breath + 1) * 0.15;

        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = `rgba(${r},${g},${b},${(s.opacity * 0.45).toFixed(2)})`;
        ctx.lineWidth = lw;
        ctx.stroke();

        // Dot with slight yellow tint at tips
        const dotR = Math.round(r + frac * 117);  // → 255 (yellow)
        const dotG = Math.round(g + frac * 138);   // → 215 (yellow)
        const dotB = Math.round(b - frac * 142);   // → 92  (yellow)
        ctx.beginPath();
        ctx.arc(ex, ey, s.dotR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${Math.min(dotR, 255)},${Math.min(dotG, 255)},${Math.max(dotB, 0)},${s.opacity.toFixed(2)})`;
        ctx.fill();
      });

      tRef.current++;
      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

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
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      initSpokes(W, H);
    };

    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);
    canvas.addEventListener('touchmove', onTouch, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
      canvas.removeEventListener('touchmove', onTouch);
      window.removeEventListener('resize', onResize);
    };
  }, [initSpokes]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: 'auto' }}
    />
  );
}

export default SunburstBackground;
