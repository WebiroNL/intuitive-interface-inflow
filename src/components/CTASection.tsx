import { Link } from 'react-router-dom';
import { ArrowRight, Rocket, MessageCircle } from 'lucide-react';
import { useRef, useEffect } from 'react';

interface CTASectionProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  subtitle?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  variant?: 'default' | 'gradient' | 'dark';
  delay?: number;
}

const featureCards = [
  {
    icon: <Rocket size={18} className="text-primary" />,
    heading: 'Start vandaag nog',
    body: 'Plan een gratis intake en we bouwen jouw website binnen 2 weken.',
    linkLabel: 'Intake plannen',
    linkTo: '/intake',
  },
  {
    icon: <MessageCircle size={18} className="text-primary" />,
    heading: 'Liever eerst praten?',
    body: 'Stel al je vragen via WhatsApp of e-mail — we reageren snel.',
    linkLabel: 'Neem contact op',
    linkTo: '/contact',
  },
];

// Webiro brand ribbons: blue, yellow, light-blue, purple, gold
const RIBBONS = [
  { r: 58,  g: 77,  b: 234, width: 110, cx: 0.28, parallax: 38, angleBase: 0.55 }, // #3A4DEA
  { r: 255, g: 215, b: 92,  width: 65,  cx: 0.42, parallax: 55, angleBase: 0.60 }, // #FFD75C
  { r: 107, g: 123, b: 245, width: 85,  cx: 0.58, parallax: 45, angleBase: 0.52 }, // light blue
  { r: 107, g: 77,  b: 234, width: 55,  cx: 0.70, parallax: 30, angleBase: 0.58 }, // purple
  { r: 255, g: 185, b: 40,  width: 40,  cx: 0.82, parallax: 60, angleBase: 0.50 }, // gold
];

function RibbonCanvas({ sectionRef }: { sectionRef: React.RefObject<HTMLElement> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Smooth target mouse position
  const targetMouse = useRef({ x: 0.62, y: 0.5 });
  const currentMouse = useRef({ x: 0.62, y: 0.5 });
  const frameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Track mouse over the whole section
    const onMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      targetMouse.current = {
        x: Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)),
        y: Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)),
      };
    };
    section.addEventListener('mousemove', onMouseMove);

    const drawRibbon = (
      r: number, g: number, b: number,
      width: number,
      cxFraction: number,
      angle: number,
      parallaxX: number,
      mx: number, my: number,
      w: number, h: number
    ) => {
      // Centre X of ribbon at mid-height, shifted by mouse parallax
      const cx = w * cxFraction + (mx - 0.5) * parallaxX;
      const cy = h * 0.5 + (my - 0.5) * 20;

      // Ribbon direction unit vector
      const dx = Math.sin(angle);
      const dy = Math.cos(angle);
      // Perpendicular (for width)
      const px = Math.cos(angle);
      const py = -Math.sin(angle);

      // Extend well past canvas edges so no gaps
      const ext = Math.sqrt(w * w + h * h);

      // Four corners of parallelogram
      const hw = width / 2;
      const ax = cx - dx * ext - px * hw, ay = cy - dy * ext - py * hw;
      const bx = cx - dx * ext + px * hw, by = cy - dy * ext + py * hw;
      const cx2 = cx + dx * ext + px * hw, cy2 = cy + dy * ext + py * hw;
      const dx2 = cx + dx * ext - px * hw, dy2 = cy + dy * ext - py * hw;

      // Gradient perpendicular to ribbon (edge soft-ness)
      const gx1 = cx - px * hw, gy1 = cy - py * hw;
      const gx2 = cx + px * hw, gy2 = cy + py * hw;
      const grad = ctx.createLinearGradient(gx1, gy1, gx2, gy2);
      grad.addColorStop(0,    `rgba(${r},${g},${b},0)`);
      grad.addColorStop(0.12, `rgba(${r},${g},${b},0.85)`);
      grad.addColorStop(0.5,  `rgba(${r},${g},${b},0.95)`);
      grad.addColorStop(0.88, `rgba(${r},${g},${b},0.85)`);
      grad.addColorStop(1,    `rgba(${r},${g},${b},0)`);

      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.lineTo(cx2, cy2);
      ctx.lineTo(dx2, dy2);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
    };

    const draw = () => {
      // Smooth lerp toward target
      currentMouse.current.x += (targetMouse.current.x - currentMouse.current.x) * 0.06;
      currentMouse.current.y += (targetMouse.current.y - currentMouse.current.y) * 0.06;

      const mx = currentMouse.current.x;
      const my = currentMouse.current.y;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      ctx.clearRect(0, 0, w, h);

      RIBBONS.forEach((rib) => {
        // Angle influenced by mouse X: left = more vertical, right = more tilted
        const angle = rib.angleBase + (mx - 0.5) * 0.22;
        drawRibbon(rib.r, rib.g, rib.b, rib.width, rib.cx, angle, rib.parallax, mx, my, w, h);
      });

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);

    return () => {
      section.removeEventListener('mousemove', onMouseMove);
      ro.disconnect();
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [sectionRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
    />
  );
}

export function CTASection({
  title = "Klaar voor jouw nieuwe website?",
  description = "Neem contact op en we helpen je graag verder.",
  subtitle,
  buttonText = "Plan gratis intake",
  buttonLink = "/intake",
  primaryButtonText,
  primaryButtonLink,
}: CTASectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const displayDescription = subtitle || description;
  const displayButtonText = primaryButtonText || buttonText;
  const displayButtonLink = primaryButtonLink || buttonLink;

  return (
    <section ref={sectionRef} className="relative bg-background border-t border-border overflow-hidden">
      {/* Ribbons — right 60% of section */}
      <div className="absolute inset-y-0 right-0 w-full lg:w-[60%]">
        <RibbonCanvas sectionRef={sectionRef as React.RefObject<HTMLElement>} />
        {/* Left fade so text stays readable */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, hsl(var(--background)) 0%, hsl(var(--background) / 0.85) 25%, transparent 65%)'
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left: heading + buttons */}
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
              {title}
            </h2>
            <p className="text-muted-foreground text-base lg:text-lg leading-relaxed mb-8 max-w-sm">
              {displayDescription}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to={displayButtonLink}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-all text-sm"
              >
                {displayButtonText}
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-foreground rounded-md font-semibold hover:bg-muted transition-all text-sm"
              >
                Contact opnemen
              </Link>
            </div>
          </div>

          {/* Right: two feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border rounded-lg overflow-hidden border border-border">
            {featureCards.map((card) => (
              <div key={card.heading} className="bg-background/75 backdrop-blur-md p-7 flex flex-col gap-4">
                <div className="w-9 h-9 rounded-md border border-border flex items-center justify-center bg-background">
                  {card.icon}
                </div>
                <div>
                  <p className="text-foreground font-semibold text-sm mb-1.5">{card.heading}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{card.body}</p>
                </div>
                <Link
                  to={card.linkTo}
                  className="inline-flex items-center gap-1 text-primary text-sm font-medium hover:underline mt-auto"
                >
                  {card.linkLabel} <ArrowRight size={13} />
                </Link>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

export default CTASection;
