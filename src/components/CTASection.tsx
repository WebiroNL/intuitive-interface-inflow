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

// Ribbon definitions — Webiro brand palette
const ribbons = [
  { color: '234 82% 57%', width: 120, delay: 0,    speed: 0.018, offset: 0 },
  { color: '250 70% 65%', width: 80,  delay: 0.04, speed: 0.012, offset: 0.15 },
  { color: '220 90% 68%', width: 55,  delay: 0.08, speed: 0.022, offset: 0.32 },
  { color: '260 65% 72%', width: 90,  delay: 0.02, speed: 0.015, offset: 0.5 },
  { color: '210 85% 75%', width: 45,  delay: 0.1,  speed: 0.025, offset: 0.68 },
];

function RibbonCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.7, y: 0.4 });
  const frameRef = useRef<number>();
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    };
    canvas.addEventListener('mousemove', handleMouse);

    const draw = () => {
      timeRef.current += 0.008;
      const t = timeRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      ctx.clearRect(0, 0, w, h);

      ribbons.forEach((r, i) => {
        // Base angle ~35 degrees, slightly influenced by mouse
        const angle = 0.6 + (mx - 0.5) * 0.15 + Math.sin(t * r.speed * 2 + i) * 0.04;

        // Horizontal position — offset across width, mouse-parallax shifts them
        const baseX = w * (0.3 + r.offset * 0.75) + (mx - 0.5) * 60 * (i % 2 === 0 ? 1 : -1);
        const baseY = (my - 0.5) * 30 * r.speed * 100 + Math.sin(t * r.speed + r.delay * 10) * 12;

        // Ribbon is a rotated thick line rendered as a parallelogram
        const len = h * 2.2;
        const hw = r.width / 2;

        // 4 corners of the ribbon strip
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        const x0 = baseX - hw * cos - (-h * 0.3) * (-sin);
        const y0 = baseY - hw * sin - (-h * 0.3) * cos + baseY;
        const x1 = baseX + hw * cos - (-h * 0.3) * (-sin);
        const y1 = baseY + hw * sin - (-h * 0.3) * cos + baseY;
        const x2 = baseX + hw * cos - len * (-sin);
        const y2 = baseY + hw * sin - len * cos + baseY;
        const x3 = baseX - hw * cos - len * (-sin);
        const y3 = baseY - hw * sin - len * cos + baseY;

        // Gradient along the ribbon
        const grad = ctx.createLinearGradient(baseX, -h * 0.1, baseX, h * 1.1);
        grad.addColorStop(0,   `hsla(${r.color}, 0)`);
        grad.addColorStop(0.2, `hsla(${r.color}, 0.55)`);
        grad.addColorStop(0.5, `hsla(${r.color}, 0.7)`);
        grad.addColorStop(0.8, `hsla(${r.color}, 0.55)`);
        grad.addColorStop(1,   `hsla(${r.color}, 0)`);

        ctx.beginPath();
        ctx.moveTo(x0, y0 - baseY);
        ctx.lineTo(x1, y1 - baseY);
        ctx.lineTo(x2, y2 - baseY);
        ctx.lineTo(x3, y3 - baseY);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
      });

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouse);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: 'block' }}
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
  const displayDescription = subtitle || description;
  const displayButtonText = primaryButtonText || buttonText;
  const displayButtonLink = primaryButtonLink || buttonLink;

  return (
    <section className="relative bg-background border-t border-border overflow-hidden">
      {/* Interactive ribbon canvas — right half */}
      <div className="absolute inset-y-0 right-0 w-full lg:w-3/5 pointer-events-none lg:pointer-events-auto">
        <RibbonCanvas />
        {/* Fade-out to the left so text stays readable */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, hsl(var(--background)) 0%, hsl(var(--background) / 0.3) 40%, transparent 100%)'
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border rounded-lg overflow-hidden border border-border backdrop-blur-sm">
            {featureCards.map((card) => (
              <div key={card.heading} className="bg-background/80 p-7 flex flex-col gap-4">
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
