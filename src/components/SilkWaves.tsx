import { useEffect, useRef } from "react";
import { createNoise2D } from "simplex-noise";

interface Props {
  className?: string;
}

const isMobile = () => window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent);

export function SilkWaves({ className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>();
  const noise2D = useRef(createNoise2D());
  const stateRef = useRef({
    mouse: { x: -10, y: 0, lx: 0, ly: 0, sx: 0, sy: 0, v: 0, vs: 0, a: 0, set: false },
    frame: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let xGap = 3;
    let yGap = 3;
    let totalLines = 0;
    let totalPoints = 0;
    let xStart = 0;
    let yStart = 0;

    // Pre-allocated point arrays for performance
    type Point = { x: number; y: number; wx: number; wy: number; cx: number; cy: number; cvx: number; cvy: number };
    let points: Point[][] = [];

    const setupGrid = () => {
      const mobile = isMobile();
      xGap = mobile ? 8 : 4;
      yGap = mobile ? 8 : 4;
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);

      const oWidth = width + 200;
      const oHeight = height + 40;
      totalLines = Math.ceil(oWidth / xGap);
      totalPoints = Math.ceil(oHeight / yGap);
      xStart = (width - xGap * totalLines) / 2;
      yStart = (height - yGap * totalPoints) / 2;

      points = [];
      for (let i = 0; i <= totalLines; i++) {
        const line: Point[] = [];
        for (let j = 0; j <= totalPoints; j++) {
          line.push({
            x: xStart + xGap * i,
            y: yStart + yGap * j,
            wx: 0, wy: 0,
            cx: 0, cy: 0,
            cvx: 0, cvy: 0,
          });
        }
        points.push(line);
      }
    };

    const tick = (time: number) => {
      const state = stateRef.current;
      state.frame++;

      // Throttle to ~30fps on mobile
      if (isMobile() && state.frame % 2 !== 0) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const mouse = state.mouse;
      mouse.sx += (mouse.x - mouse.sx) * 0.1;
      mouse.sy += (mouse.y - mouse.sy) * 0.1;
      const dx = mouse.x - mouse.lx;
      const dy = mouse.y - mouse.ly;
      const d = Math.hypot(dx, dy);
      mouse.vs += (d - mouse.vs) * 0.1;
      mouse.vs = Math.min(100, mouse.vs);
      mouse.lx = mouse.x;
      mouse.ly = mouse.y;
      mouse.a = Math.atan2(dy, dx);

      // Breathing gradient opacity
      const t = time * 0.0006;
      const alpha1 = 0.30 + Math.sin(t * 1.1) * 0.15;
      const alpha2 = 0.26 + Math.sin(t * 0.9 + 1) * 0.12;
      const alpha3 = 0.24 + Math.sin(t * 1.3 + 2) * 0.12;

      // Build gradient
      const grad = ctx.createLinearGradient(0, 0, width, 0);
      grad.addColorStop(0,    `hsla(234,82%,57%,0.04)`);
      grad.addColorStop(0.25, `hsla(234,82%,57%,${alpha1.toFixed(2)})`);
      grad.addColorStop(0.5,  `hsla(248,80%,59%,${alpha2.toFixed(2)})`);
      grad.addColorStop(0.75, `hsla(259,79%,61%,${alpha3.toFixed(2)})`);
      grad.addColorStop(1,    `hsla(259,79%,61%,0.04)`);

      ctx.clearRect(0, 0, width, height);

      const noise = noise2D.current;
      const l = Math.max(175, mouse.vs);

      for (let i = 0; i < points.length; i++) {
        const line = points[i];
        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4;

        for (let j = 0; j < line.length; j++) {
          const p = line[j];

          // Wave
          const move = noise(
            (p.x + time * 0.008) * 0.002,
            (p.y + time * 0.003) * 0.0015
          ) * 10;
          p.wx = Math.cos(move) * 30;
          p.wy = Math.sin(move) * 14;

          // Cursor interaction
          const ddx = p.x - mouse.sx;
          const ddy = p.y - mouse.sy;
          const dd = Math.hypot(ddx, ddy);
          if (dd < l) {
            const s = 1 - dd / l;
            const f = Math.cos(dd * 0.001) * s;
            p.cvx += Math.cos(mouse.a) * f * l * mouse.vs * 0.00065;
            p.cvy += Math.sin(mouse.a) * f * l * mouse.vs * 0.00065;
          }
          p.cvx += (0 - p.cx) * 0.005;
          p.cvy += (0 - p.cy) * 0.005;
          p.cvx *= 0.925;
          p.cvy *= 0.925;
          p.cx += p.cvx * 2;
          p.cy += p.cvy * 2;
          p.cx = Math.min(100, Math.max(-100, p.cx));
          p.cy = Math.min(100, Math.max(-100, p.cy));

          const fx = p.x + p.wx + (j === 0 || j === line.length - 1 ? 0 : p.cx);
          const fy = p.y + p.wy + (j === 0 || j === line.length - 1 ? 0 : p.cy);

          if (j === 0) ctx.moveTo(fx, fy);
          else ctx.lineTo(fx, fy);
        }

        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    const handleResize = () => setupGrid();

    const handleMouseMove = (e: MouseEvent) => {
      const bounds = canvas.getBoundingClientRect();
      const mouse = stateRef.current.mouse;
      mouse.x = e.pageX - bounds.left;
      mouse.y = e.pageY - bounds.top + window.scrollY;
      if (!mouse.set) {
        mouse.sx = mouse.x; mouse.sy = mouse.y;
        mouse.lx = mouse.x; mouse.ly = mouse.y;
        mouse.set = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const bounds = canvas.getBoundingClientRect();
      const mouse = stateRef.current.mouse;
      mouse.x = e.touches[0].clientX - bounds.left;
      mouse.y = e.touches[0].clientY - bounds.top + window.scrollY;
      if (!mouse.set) {
        mouse.sx = mouse.x; mouse.sy = mouse.y;
        mouse.lx = mouse.x; mouse.ly = mouse.y;
        mouse.set = true;
      }
    };

    setupGrid();
    rafRef.current = requestAnimationFrame(tick);
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("touchmove", handleTouchMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} style={{ pointerEvents: "none" }}>
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    </div>
  );
}
