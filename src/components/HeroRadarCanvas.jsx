import React, { useEffect, useRef } from 'react';

/**
 * HeroRadarCanvas
 * Renders an ultra-smooth, lightweight cosmic flight radar canvas in the background.
 * Visualizes global flight routes (great-circle arcs), pulsing airport nodes,
 * moving aircraft beacons, and ambient celestial particles.
 * Adapts automatically to Light and Dark modes.
 */
export function HeroRadarCanvas({ theme = 'light' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = canvas.parentElement.offsetWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // Global Waypoint Hubs (Normalized coordinates across canvas)
    const hubs = [
      { id: 'HND', name: 'Tokyo', nx: 0.82, ny: 0.38, code: 'HND' },
      { id: 'CDG', name: 'Paris', nx: 0.48, ny: 0.32, code: 'CDG' },
      { id: 'JFK', name: 'New York', nx: 0.24, ny: 0.36, code: 'JFK' },
      { id: 'LHR', name: 'London', nx: 0.44, ny: 0.28, code: 'LHR' },
      { id: 'KEF', name: 'Reykjavik', nx: 0.38, ny: 0.18, code: 'KEF' },
      { id: 'DPS', name: 'Bali', nx: 0.78, ny: 0.72, code: 'DPS' },
      { id: 'SYD', name: 'Sydney', nx: 0.88, ny: 0.82, code: 'SYD' },
      { id: 'DXB', name: 'Dubai', nx: 0.60, ny: 0.45, code: 'DXB' }
    ];

    // Flight routes between hubs
    const routes = [
      { from: 2, to: 1, duration: 420 }, // JFK -> CDG
      { from: 1, to: 7, duration: 380 }, // CDG -> DXB
      { from: 7, to: 0, duration: 460 }, // DXB -> HND
      { from: 0, to: 5, duration: 340 }, // HND -> DPS
      { from: 5, to: 6, duration: 280 }, // DPS -> SYD
      { from: 2, to: 4, duration: 320 }, // JFK -> KEF
      { from: 4, to: 3, duration: 240 }  // KEF -> LHR
    ];

    // Active flights traversing routes
    const flights = routes.map((route, i) => ({
      route,
      progress: (i * 0.16) % 1,
      speed: 0.0018 + (i % 3) * 0.0006
    }));

    // Ambient floating stardust particles
    const particles = Array.from({ length: 42 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 1.8 + 0.6,
      alpha: Math.random() * 0.5 + 0.2
    }));

    let pulseTick = 0;

    const render = () => {
      pulseTick += 0.035;
      ctx.clearRect(0, 0, width, height);

      const isDark = theme === 'dark';
      const arcColor = isDark ? 'rgba(10, 132, 255, 0.22)' : 'rgba(0, 122, 255, 0.18)';
      const nodeColor = isDark ? '#0a84ff' : '#007aff';
      const flightBeaconColor = isDark ? '#bf5af2' : '#ff9500';
      const particleColor = isDark ? 'rgba(255, 255, 255, ' : 'rgba(0, 122, 255, ';

      // 1. Render ambient floating dust particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = `${particleColor}${p.alpha * (isDark ? 0.35 : 0.25)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Render Flight Routes (Curved Geodesic Arcs)
      routes.forEach((route) => {
        const h1 = hubs[route.from];
        const h2 = hubs[route.to];
        const x1 = h1.nx * width;
        const y1 = h1.ny * height;
        const x2 = h2.nx * width;
        const y2 = h2.ny * height;

        // Quadratic control point for natural curved trajectory
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2 - Math.min(width, height) * 0.12;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(midX, midY, x2, y2);
        ctx.strokeStyle = arcColor;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // 3. Render Active Moving Flights along Arcs
      flights.forEach((f) => {
        f.progress += f.speed;
        if (f.progress >= 1) f.progress = 0;

        const h1 = hubs[f.route.from];
        const h2 = hubs[f.route.to];
        const x1 = h1.nx * width;
        const y1 = h1.ny * height;
        const x2 = h2.nx * width;
        const y2 = h2.ny * height;
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2 - Math.min(width, height) * 0.12;

        // Quadratic bezier formula
        const t = f.progress;
        const bx = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * midX + t * t * x2;
        const by = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * midY + t * t * y2;

        // Flight Beacon Glow
        const grad = ctx.createRadialGradient(bx, by, 1, bx, by, 12);
        grad.addColorStop(0, flightBeaconColor);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(bx, by, 12, 0, Math.PI * 2);
        ctx.fill();

        // Flight Center Core
        ctx.fillStyle = isDark ? '#ffffff' : '#000000';
        ctx.beginPath();
        ctx.arc(bx, by, 2.2, 0, Math.PI * 2);
        ctx.fill();
      });

      // 4. Render Hub Nodes with Radar Ripple Pulse
      hubs.forEach((hub, idx) => {
        const hx = hub.nx * width;
        const hy = hub.ny * height;

        // Radar ripple
        const ripplePhase = (pulseTick + idx * 1.2) % 3;
        const rippleRadius = 4 + ripplePhase * 10;
        const rippleAlpha = Math.max(0, 1 - ripplePhase / 3) * 0.35;

        ctx.strokeStyle = nodeColor;
        ctx.globalAlpha = rippleAlpha;
        ctx.beginPath();
        ctx.arc(hx, hy, rippleRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Hub Core Dot
        ctx.fillStyle = nodeColor;
        ctx.beginPath();
        ctx.arc(hx, hy, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Hub Airport Code Tag
        ctx.font = '600 9px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
        ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.45)';
        ctx.fillText(hub.code, hx + 6, hy - 4);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <div className="hero-radar-canvas-container" aria-hidden="true">
      <canvas ref={canvasRef} className="hero-radar-canvas" />
      <div className="radar-atmospheric-vignette" />
    </div>
  );
}
