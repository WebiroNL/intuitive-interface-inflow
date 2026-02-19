import { useEffect, useRef } from "react";
import { createNoise2D } from "simplex-noise";

interface Props {
  className?: string;
}

const isMobile = () => window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent);

export function SilkWaves({ className = "" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const linesRef = useRef<Array<Array<{ x: number; y: number; wave: { x: number; y: number }; cursor: { x: number; y: number; vx: number; vy: number } }>>>([]);
  const pathsRef = useRef<SVGPathElement[]>([]);
  const mouseRef = useRef({ x: -10, y: 0, lx: 0, ly: 0, sx: 0, sy: 0, v: 0, vs: 0, a: 0, set: false });
  const rafRef = useRef<number>();
  const frameRef = useRef(0);
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

      const mobile = isMobile();
      const xGap = mobile ? 6 : 3;
      const yGap = mobile ? 6 : 3;
      const oWidth = width + (mobile ? 60 : 200);
      const oHeight = height + (mobile ? 20 : 40);
      const totalLines = Math.ceil(oWidth / xGap);
      const totalPoints = Math.ceil(oHeight / yGap);
      const xStart = (width - xGap * totalLines) / 2;
      const yStart = (height - yGap * totalPoints) / 2;

      // Define SVG gradient
      const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
      const grad = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
      grad.setAttribute("id", "silkGradient");
      grad.setAttribute("x1", "0%");
      grad.setAttribute("y1", "0%");
      grad.setAttribute("x2", "100%");
      grad.setAttribute("y2", "0%");
      const stopDefs: [string, string, string][] = [
        ["0%",   "stop1", "hsla(234,82%,57%,0.06)"],
        ["25%",  "stop2", "hsla(234,82%,57%,0.35)"],
        ["50%",  "stop3", "hsla(248,80%,59%,0.30)"],
        ["75%",  "stop4", "hsla(259,79%,61%,0.28)"],
        ["100%", "stop5", "hsla(259,79%,61%,0.06)"],
      ];
      stopDefs.forEach(([offset, id, color]) => {
        const stop = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        stop.setAttribute("offset", offset);
        stop.setAttribute("stop-color", color);
        stop.setAttribute("id", id);
        grad.appendChild(stop);
      });
      defs.appendChild(grad);
      svg.appendChild(defs);

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
        path.setAttribute("stroke", "url(#silkGradient)");
        path.setAttribute("stroke-width", "1.6");
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
      frameRef.current++;
      // On mobile, render at ~30fps by skipping every other frame
      if (isMobile() && frameRef.current % 2 !== 0) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
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

      // Breathing gradient animation
      const t = time * 0.0006;
      const breath1 = 0.30 + Math.sin(t * 1.1) * 0.15;
      const breath2 = 0.26 + Math.sin(t * 0.9 + 1) * 0.12;
      const breath3 = 0.24 + Math.sin(t * 1.3 + 2) * 0.12;
      const grad = svg.querySelector("#silkGradient");
      if (grad) {
        const s1 = grad.querySelector("#stop2") as SVGStopElement;
        const s2 = grad.querySelector("#stop3") as SVGStopElement;
        const s3 = grad.querySelector("#stop4") as SVGStopElement;
        if (s1) s1.setAttribute("stop-color", `hsla(234,82%,57%,${breath1.toFixed(2)})`);
        if (s2) s2.setAttribute("stop-color", `hsla(248,80%,59%,${breath2.toFixed(2)})`);
        if (s3) s3.setAttribute("stop-color", `hsla(259,79%,61%,${breath3.toFixed(2)})`);
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
      <svg ref={svgRef} style={{ display: "block", willChange: "transform" }} />
    </div>
  );
}
