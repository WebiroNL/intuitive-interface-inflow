import { useEffect, useRef, useCallback } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  speed: number;
  angle: number;
  radius: number;
  orbitSpeed: number;
  layer: number; // 0 = outer stream, 1 = mid orbit, 2 = core
  life: number;
  maxLife: number;
  hue: number;
}

export function ParticleEngine({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const tRef = useRef(0);
  const { theme } = useTheme();
  const themeRef = useRef(theme);

  useEffect(() => { themeRef.current = theme; }, [theme]);

  const createParticle = useCallback((w: number, h: number, layer?: number): Particle => {
    const l = layer ?? Math.floor(Math.random() * 3);
    const cx = w / 2;
    const cy = h / 2;
    const angle = Math.random() * Math.PI * 2;

    if (l === 0) {
      // Outer streaming particles — spawn from edges, flow inward
      const edge = Math.random();
      let x: number, y: number;
      if (edge < 0.25) { x = 0; y = Math.random() * h; }
      else if (edge < 0.5) { x = w; y = Math.random() * h; }
      else if (edge < 0.75) { x = Math.random() * w; y = 0; }
      else { x = Math.random() * w; y = h; }

      const dx = cx - x;
      const dy = cy - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const speed = 0.3 + Math.random() * 0.6;

      return {
        x, y,
        vx: (dx / dist) * speed,
        vy: (dy / dist) * speed,
        size: 1 + Math.random() * 2,
        opacity: 0.2 + Math.random() * 0.4,
        speed,
        angle: Math.atan2(dy, dx),
        radius: dist,
        orbitSpeed: 0,
        layer: 0,
        life: 0,
        maxLife: dist / speed,
        hue: 234 + Math.random() * 30,
      };
    } else if (l === 1) {
      // Mid-orbit particles — circle around center
      const r = 60 + Math.random() * 80;
      return {
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
        vx: 0, vy: 0,
        size: 1.5 + Math.random() * 2,
        opacity: 0.4 + Math.random() * 0.4,
        speed: 0,
        angle,
        radius: r,
        orbitSpeed: (0.004 + Math.random() * 0.008) * (Math.random() > 0.5 ? 1 : -1),
        layer: 1,
        life: 0,
        maxLife: Infinity,
        hue: 248 + Math.random() * 20,
      };
    } else {
      // Core particles — tight inner glow
      const r = 10 + Math.random() * 30;
      return {
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
        vx: 0, vy: 0,
        size: 1 + Math.random() * 1.5,
        opacity: 0.6 + Math.random() * 0.4,
        speed: 0,
        angle,
        radius: r,
        orbitSpeed: (0.01 + Math.random() * 0.015) * (Math.random() > 0.5 ? 1 : -1),
        layer: 2,
        life: 0,
        maxLife: Infinity,
        hue: 255 + Math.random() * 25,
      };
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    // Init particles
    const particles: Particle[] = [];
    for (let i = 0; i < 40; i++) particles.push(createParticle(W, H, 0));
    for (let i = 0; i < 35; i++) particles.push(createParticle(W, H, 1));
    for (let i = 0; i < 20; i++) particles.push(createParticle(W, H, 2));
    particlesRef.current = particles;

    const draw = () => {
      const t = tRef.current;
      const isDark = themeRef.current === 'dark';
      const cx = W / 2;
      const cy = H / 2;

      ctx.clearRect(0, 0, W, H);

      // Core glow
      const coreGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 90);
      if (isDark) {
        coreGlow.addColorStop(0, 'rgba(58, 77, 234, 0.35)');
        coreGlow.addColorStop(0.4, 'rgba(138, 79, 232, 0.15)');
        coreGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        coreGlow.addColorStop(0, 'rgba(58, 77, 234, 0.2)');
        coreGlow.addColorStop(0.4, 'rgba(138, 79, 232, 0.08)');
        coreGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      }
      ctx.fillStyle = coreGlow;
      ctx.fillRect(0, 0, W, H);

      // Pulsating core ring
      const pulseR = 40 + Math.sin(t * 0.02) * 8;
      ctx.beginPath();
      ctx.arc(cx, cy, pulseR, 0, Math.PI * 2);
      ctx.strokeStyle = isDark ? 'rgba(58, 77, 234, 0.3)' : 'rgba(58, 77, 234, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      const pulseR2 = 75 + Math.sin(t * 0.015 + 1) * 12;
      ctx.beginPath();
      ctx.arc(cx, cy, pulseR2, 0, Math.PI * 2);
      ctx.strokeStyle = isDark ? 'rgba(138, 79, 232, 0.15)' : 'rgba(138, 79, 232, 0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw connection lines between nearby orbiting particles
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        if (a.layer === 0) continue;
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          if (b.layer === 0) continue;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            const alpha = (1 - dist / 80) * 0.15;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = isDark
              ? `rgba(58, 77, 234, ${alpha})`
              : `rgba(58, 77, 234, ${alpha * 0.6})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Update & draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        if (p.layer === 0) {
          // Stream toward center
          p.x += p.vx;
          p.y += p.vy;
          p.life++;

          // Add slight curve
          const dx = cx - p.x;
          const dy = cy - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 20) {
            const perpX = -dy / dist;
            const perpY = dx / dist;
            p.vx += perpX * 0.02;
            p.vy += perpY * 0.02;
          }

          // Fade in/out
          const lifeRatio = p.life / p.maxLife;
          const fade = lifeRatio < 0.1 ? lifeRatio / 0.1 : lifeRatio > 0.8 ? (1 - lifeRatio) / 0.2 : 1;

          // Draw trail
          const trailLen = 8;
          const trailDx = -p.vx * trailLen;
          const trailDy = -p.vy * trailLen;
          const trailGrad = ctx.createLinearGradient(p.x, p.y, p.x + trailDx, p.y + trailDy);
          const baseAlpha = p.opacity * fade;
          trailGrad.addColorStop(0, `hsla(${p.hue}, 80%, ${isDark ? '65' : '55'}%, ${baseAlpha})`);
          trailGrad.addColorStop(1, `hsla(${p.hue}, 80%, ${isDark ? '65' : '55'}%, 0)`);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + trailDx, p.y + trailDy);
          ctx.strokeStyle = trailGrad;
          ctx.lineWidth = p.size * 0.8;
          ctx.stroke();

          // Respawn if reached center or expired
          if (dist < 25 || p.life > p.maxLife) {
            particles[i] = createParticle(W, H, 0);
          }
        } else {
          // Orbiting particles
          p.angle += p.orbitSpeed;
          const breathe = p.layer === 2
            ? Math.sin(t * 0.03 + p.angle * 3) * 5
            : Math.sin(t * 0.02 + p.angle * 2) * 8;
          p.x = cx + Math.cos(p.angle) * (p.radius + breathe);
          p.y = cy + Math.sin(p.angle) * (p.radius + breathe);
        }

        // Draw particle dot
        const glow = p.layer === 2 ? 1.5 : 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * glow, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, ${isDark ? '70' : '55'}%, ${p.opacity * (p.layer === 0 ? 1 : (0.5 + Math.sin(t * 0.03 + p.angle) * 0.3))})`;
        ctx.fill();
      }

      // Central dot
      const coreAlpha = 0.7 + Math.sin(t * 0.04) * 0.2;
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(58, 77, 234, ${coreAlpha})`;
      ctx.fill();

      // Rotating arcs (engine feel)
      for (let a = 0; a < 3; a++) {
        const arcAngle = t * 0.008 + (a * Math.PI * 2) / 3;
        const arcR = 50 + Math.sin(t * 0.02 + a) * 5;
        ctx.beginPath();
        ctx.arc(cx, cy, arcR, arcAngle, arcAngle + 0.8);
        ctx.strokeStyle = isDark
          ? `rgba(255, 215, 92, ${0.15 + Math.sin(t * 0.03 + a) * 0.08})`
          : `rgba(58, 77, 234, ${0.12 + Math.sin(t * 0.03 + a) * 0.06})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      tRef.current++;
      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    const onResize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, [createParticle]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ display: 'block' }}
    />
  );
}

export default ParticleEngine;
