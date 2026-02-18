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

// Webiro brand ribbons
const RIBBONS = [
  { r: 58,  g: 77,  b: 234, w: 100 }, // #3A4DEA primary blue
  { r: 255, g: 215, b: 92,  w: 60  }, // #FFD75C yellow
  { r: 107, g: 123, b: 245, w: 80  }, // light blue
  { r: 107, g: 77,  b: 234, w: 50  }, // purple
  { r: 255, g: 185, b: 40,  w: 38  }, // gold
];

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0.72, y: 0.5 });
  const smooth = useRef({ x: 0.72, y: 0.5 });
  const raf = useRef<number>();

  const displayDescription = subtitle || description;
  const displayButtonText = primaryButtonText || buttonText;
  const displayButtonLink = primaryButtonLink || buttonLink;

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext('2d')!;

    // Set canvas pixel size to match CSS size (no DPR trick — keep it simple)
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Mouse tracking on the whole section
    const onMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      mouse.current.x = (e.clientX - r.left) / r.width;
      mouse.current.y = (e.clientY - r.top) / r.height;
    };
    section.addEventListener('mousemove', onMove);

    const draw = () => {
      // Smooth lerp
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.07;
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.07;
      const mx = smooth.current.x;
      const my = smooth.current.y;

      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Base angle — mouse X strongly tilts all ribbons
      // mx=0 → ~30°, mx=1 → ~60°
      const baseAngle = 0.45 + mx * 0.45; // radians from vertical

      RIBBONS.forEach((rib, i) => {
        // Spread ribbons across right half, each with slight mouse parallax
        const baseCX = W * (0.35 + i * 0.14);
        const cx = baseCX + (mx - 0.5) * (30 + i * 15);
        const cy = H * 0.5 + (my - 0.5) * (20 + i * 8);

        // Ribbon direction
        const angle = baseAngle + i * 0.03;
        const sinA = Math.sin(angle);
        const cosA = Math.cos(angle);

        // Extend far past canvas edges
        const ext = W + H;

        // Half-width perpendicular
        const hw = rib.w / 2;
        const px = cosA, py = -sinA; // perpendicular direction

        // 4 corners
        const x0 = cx - sinA * ext - px * hw, y0 = cy - cosA * ext - py * hw;
        const x1 = cx - sinA * ext + px * hw, y1 = cy - cosA * ext + py * hw;
        const x2 = cx + sinA * ext + px * hw, y2 = cy + cosA * ext + py * hw;
        const x3 = cx + sinA * ext - px * hw, y3 = cy + cosA * ext - py * hw;

        // Sharp gradient — only very thin soft edge
        const gx1 = cx - px * hw, gy1 = cy - py * hw;
        const gx2 = cx + px * hw, gy2 = cy + py * hw;
        const g = ctx.createLinearGradient(gx1, gy1, gx2, gy2);
        g.addColorStop(0,    `rgba(${rib.r},${rib.g},${rib.b},0)`);
        g.addColorStop(0.08, `rgba(${rib.r},${rib.g},${rib.b},0.88)`);
        g.addColorStop(0.5,  `rgba(${rib.r},${rib.g},${rib.b},0.92)`);
        g.addColorStop(0.92, `rgba(${rib.r},${rib.g},${rib.b},0.88)`);
        g.addColorStop(1,    `rgba(${rib.r},${rib.g},${rib.b},0)`);

        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.closePath();
        ctx.fillStyle = g;
        ctx.fill();
      });

      raf.current = requestAnimationFrame(draw);
    };

    raf.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      section.removeEventListener('mousemove', onMove);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-background border-t border-border overflow-hidden">

      {/* Canvas fills the full section */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: 'block' }}
      />

      {/* Left-side fade so left text stays on clean white */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to right, hsl(var(--background)) 30%, hsl(var(--background) / 0.5) 55%, transparent 80%)'
        }}
      />

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
              <div key={card.heading} className="bg-background/80 backdrop-blur-sm p-7 flex flex-col gap-4">
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
