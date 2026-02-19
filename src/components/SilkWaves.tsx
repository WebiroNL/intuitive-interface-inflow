import { useEffect, useRef } from "react";
import { createNoise2D } from "simplex-noise";

interface Props {
  className?: string;
}

export function SilkWaves({ className = "" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const linesRef = useRef<Array<Array<{ x: number; y: number; wave: { x: number; y: number }; cursor: { x: number; y: number; vx: number; vy: number } }>>>([]);
  const pathsRef = useRef<SVGPathElement[]>([]);
  const mouseRef = useRef({ x: -10, y: 0, lx: 0, ly: 0, sx: 0, sy: 0, v: 0, vs: 0, a: 0, set: false });
  const rafRef = useRef<number>();
  const noise2D = useRef(createNoise2D());

  useEffect(() => {
    const container = containerRef.current;
    const svg = svgRef.current;
    if (!container || !svg) return;

    const setSize = () => {
      const { width, height } = container.getBoundingClientRect();
      svg.style.width = `${width}px`;
      svg.style.height = `${height}px`;
    };

    const setLines = () => {
      const { width, height } = container.getBoundingClientRect();

      // Clear existing paths
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      pathsRef.current = [];
      linesRef.current = [];

      const xGap = 6;
      const yGap = 6;
      const oWidth = width + 200;
      const oHeight = height + 40;
      const totalLines = Math.ceil(oWidth / xGap);
      const totalPoints = Math.ceil(oHeight / yGap);
      const xStart = (width - xGap * totalLines) / 2;
      const yStart = (height - yGap * totalPoints) / 2;

      for (let i = 0; i <= totalLines; i++) {
        const points = [];
        for (let j = 0; j <= totalPoints; j++) {
          points.push({
            x: xStart + xGap * i,
            y: yStart + yGap * j,
            wave: { x: 0, y: 0 },
            cursor: { x: 0, y: 0, vx: 0, vy: 0 },
          });
        }
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "hsl(225 70% 55% / 0.22)");
        path.setAttribute("stroke-width", "0.7");
        svg.appendChild(path);
        pathsRef.current.push(path);
        linesRef.current.push(points);
      }
    };

    const movePoints = (time: number) => {
      const mouse = mouseRef.current;
      linesRef.current.forEach((points) => {
        points.forEach((p) => {
          const move = noise2D.current(
            (p.x + time * 0.008) * 0.002,
            (p.y + time * 0.003) * 0.0015
          ) * 10;

          p.wave.x = Math.cos(move) * 30;
          p.wave.y = Math.sin(move) * 14;

          const dx = p.x - mouse.sx;
          const dy = p.y - mouse.sy;
          const d = Math.hypot(dx, dy);
          const l = Math.max(175, mouse.vs);

          if (d < l) {
            const s = 1 - d / l;
            const f = Math.cos(d * 0.001) * s;
            p.cursor.vx += Math.cos(mouse.a) * f * l * mouse.vs * 0.00065;
            p.cursor.vy += Math.sin(mouse.a) * f * l * mouse.vs * 0.00065;
          }

          p.cursor.vx += (0 - p.cursor.x) * 0.005;
          p.cursor.vy += (0 - p.cursor.y) * 0.005;
          p.cursor.vx *= 0.925;
          p.cursor.vy *= 0.925;
          p.cursor.x += p.cursor.vx * 2;
          p.cursor.y += p.cursor.vy * 2;
          p.cursor.x = Math.min(100, Math.max(-100, p.cursor.x));
          p.cursor.y = Math.min(100, Math.max(-100, p.cursor.y));
        });
      });
    };

    const moved = (p: typeof linesRef.current[0][0], withCursor = true) => ({
      x: Math.round((p.x + p.wave.x + (withCursor ? p.cursor.x : 0)) * 10) / 10,
      y: Math.round((p.y + p.wave.y + (withCursor ? p.cursor.y : 0)) * 10) / 10,
    });

    const drawLines = () => {
      linesRef.current.forEach((points, li) => {
        let p1 = moved(points[0], false);
        let d = `M ${p1.x} ${p1.y}`;
        points.forEach((point, pi) => {
          const isLast = pi === points.length - 1;
          p1 = moved(point, !isLast);
          d += ` L ${p1.x} ${p1.y}`;
        });
        pathsRef.current[li]?.setAttribute("d", d);
      });
    };

    const updateMousePosition = (x: number, y: number) => {
      if (!container) return;
      const bounds = container.getBoundingClientRect();
      const mouse = mouseRef.current;
      mouse.x = x - bounds.left;
      mouse.y = y - bounds.top + window.scrollY;
      if (!mouse.set) {
        mouse.sx = mouse.x;
        mouse.sy = mouse.y;
        mouse.lx = mouse.x;
        mouse.ly = mouse.y;
        mouse.set = true;
      }
    };

    const tick = (time: number) => {
      const mouse = mouseRef.current;
      mouse.sx += (mouse.x - mouse.sx) * 0.1;
      mouse.sy += (mouse.y - mouse.sy) * 0.1;

      const dx = mouse.x - mouse.lx;
      const dy = mouse.y - mouse.ly;
      const d = Math.hypot(dx, dy);
      mouse.v = d;
      mouse.vs += (d - mouse.vs) * 0.1;
      mouse.vs = Math.min(100, mouse.vs);
      mouse.lx = mouse.x;
      mouse.ly = mouse.y;
      mouse.a = Math.atan2(dy, dx);

      if (container) {
        container.style.setProperty("--x", `${mouse.sx}px`);
        container.style.setProperty("--y", `${mouse.sy}px`);
      }

      movePoints(time);
      drawLines();
      rafRef.current = requestAnimationFrame(tick);
    };

    setSize();
    setLines();

    const handleResize = () => { setSize(); setLines(); };
    const handleMouseMove = (e: MouseEvent) => updateMousePosition(e.pageX, e.pageY);
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      updateMousePosition(e.touches[0].clientX, e.touches[0].clientY);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("touchmove", handleTouchMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ pointerEvents: "none" }}
    >
      <svg ref={svgRef} style={{ display: "block" }} />
    </div>
  );
}
