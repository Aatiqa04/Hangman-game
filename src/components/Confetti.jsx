import { useEffect, useRef } from 'react';

// Lightweight canvas confetti. `small` = brief 30-particle burst; otherwise
// it's the full celebratory rain that runs while `active` stays true.
export default function Confetti({ active, small = false }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!active) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const colors = ['#7c5cff', '#22d3ee', '#4ade80', '#fbbf24', '#ff7a59', '#f472b6'];
    const count = small ? 40 : 160;
    const particles = Array.from({ length: count }, () => ({
      x: window.innerWidth / 2 + (Math.random() - 0.5) * (small ? 120 : 240),
      y: small ? window.innerHeight / 3 : -20,
      vx: (Math.random() - 0.5) * (small ? 6 : 8),
      vy: small ? Math.random() * -8 - 4 : Math.random() * -6 - 4,
      g: 0.18 + Math.random() * 0.08,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      size: small ? 5 + Math.random() * 5 : 6 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 0,
    }));

    const maxLife = small ? 60 : Infinity;
    const tick = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      let alive = 0;
      particles.forEach((p) => {
        if (p.life > maxLife) return;
        p.vy += p.g;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.life += 1;
        const fade = small ? Math.max(0, 1 - p.life / maxLife) : 1;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = fade;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
        alive += 1;
      });
      if (small && alive === 0) return;
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [active, small]);

  if (!active) return null;
  return <canvas ref={canvasRef} className="confetti-canvas" aria-hidden />;
}
