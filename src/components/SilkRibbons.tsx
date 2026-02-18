import { useRef, useEffect } from "react";

// Webiro brand ribbon definitions
// Each ribbon = bundle of thin bezier fibers
const RIBBONS = [
  {
    r: 58, g: 77, b: 234,   // #3A4DEA primary blue
    fibers: 90, width: 260,
    // Control points as fractions of canvas [x, y]
    p0: [1.1, -0.1], p1: [0.75, 0.2], p2: [0.55, 0.6], p3: [0.3, 1.1],
    sens: [0, 0, 0.08, 0.14], // mouse sensitivity per control point
  },
  {
    r: 255, g: 195, b: 50,  // warm yellow/gold
    fibers: 70, width: 200,
    p0: [1.2, 0.1], p1: [0.85, 0.3], p2: [0.6, 0.55], p3: [0.45, 1.1],
    sens: [0, 0, 0.06, 0.12],
  },
  {
    r: 140, g: 70, b: 235,  // purple
    fibers: 60, width: 170,
    p0: [1.0, -0.2], p1: [0.7, 0.15], p2: [0.5, 0.5], p3: [0.2, 1.0],
    sens: [0, 0, 0.10, 0.18],
  },
  {
    r: 150, g: 165, b: 255, // periwinkle/light blue
    fibers: 50, width: 140,
    p0: [1.3, 0.0], p1: [0.9, 0.4], p2: [0.65, 0.65], p3: [0.5, 1.2],
    sens: [0, 0, 0.05, 0.09],
  },
];

interface Props {
  sectionRef: React.RefObject<HTMLElement>;
}

export function SilkRibbons({ sectionRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0.78, y: 0.42 });
  const smooth = useRef({ x: 0.78, y: 0.42 });
  const time = useRef(0);
  const raf = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      mouse.current.x = (e.clientX - r.left) / r.width;
      mouse.current.y = (e.clientY - r.top) / r.height;
    };
    section.addEventListener("mousemove", onMove);

    const draw = () => {
      time.current += 0.006;
      const t = time.current;

      // Smooth lerp toward mouse
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.05;
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.05;
      const mx = smooth.current.x;
      const my = smooth.current.y;

      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;

      ctx.clearRect(0, 0, W, H);

      RIBBONS.forEach((rib, ri) => {
        // Resolve control points to canvas coordinates + mouse perturbation + idle sway
        const sway = Math.sin(t * 0.8 + ri * 1.2) * 0.025;

        const pts = [rib.p0, rib.p1, rib.p2, rib.p3].map((p, pi) => ({
          x: (p[0] + (mx - 0.5) * rib.sens[pi] + (pi > 1 ? sway : 0)) * W,
          y: (p[1] + (my - 0.5) * rib.sens[pi] * 0.6) * H,
        }));

        // Perpendicular direction at the start of the curve (from p0 → p1 tangent)
        const tx0 = pts[1].x - pts[0].x;
        const ty0 = pts[1].y - pts[0].y;
        const len0 = Math.sqrt(tx0 * tx0 + ty0 * ty0) || 1;
        const nx0 = -ty0 / len0, ny0 = tx0 / len0; // perpendicular at start

        // Perpendicular at end (from p2 → p3 tangent)
        const tx1 = pts[3].x - pts[2].x;
        const ty1 = pts[3].y - pts[2].y;
        const len1 = Math.sqrt(tx1 * tx1 + ty1 * ty1) || 1;
        const nx1 = -ty1 / len1, ny1 = tx1 / len1; // perpendicular at end

        const hw = rib.width / 2;

        for (let i = 0; i < rib.fibers; i++) {
          const frac = i / (rib.fibers - 1); // 0..1 across ribbon width
          const offset = (frac - 0.5) * rib.width;

          // Offset each control point along the perpendicular at that end
          const ox0 = nx0 * offset, oy0 = ny0 * offset;
          const ox1 = nx1 * offset, oy1 = ny1 * offset;

          // Interpolate offset for middle points
          const ox_m1 = nx0 * offset * 0.6 + nx1 * offset * 0.4;
          const oy_m1 = ny0 * offset * 0.6 + ny1 * offset * 0.4;
          const ox_m2 = nx0 * offset * 0.3 + nx1 * offset * 0.7;
          const oy_m2 = ny0 * offset * 0.3 + ny1 * offset * 0.7;

          // Opacity: brightest in the center, fades at edges
          const edgeFade = 1 - Math.abs(frac - 0.5) * 2; // 0..1..0
          const opacity = 0.08 + edgeFade * 0.55;

          ctx.beginPath();
          ctx.moveTo(pts[0].x + ox0, pts[0].y + oy0);
          ctx.bezierCurveTo(
            pts[1].x + ox_m1, pts[1].y + oy_m1,
            pts[2].x + ox_m2, pts[2].y + oy_m2,
            pts[3].x + ox1,   pts[3].y + oy1
          );
          ctx.strokeStyle = `rgba(${rib.r},${rib.g},${rib.b},${opacity})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      });

      raf.current = requestAnimationFrame(draw);
    };

    raf.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      section.removeEventListener("mousemove", onMove);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [sectionRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    />
  );
}
