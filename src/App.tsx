import { useState, useEffect, useRef, useCallback } from 'react';
import { Menu, X } from 'lucide-react';

const BG_IMAGE_1 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_125121_afb71ce9-9c64-4c54-90b5-c89c0764c052.png&w=1920&q=85';
const BG_IMAGE_2 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_135737_0da59642-725b-451a-997b-b0283d95a42a.png&w=1280&q=85';

const NAV_LINKS = ['Module', 'Case Records', 'Biotech', 'Tiers', 'Live Demo'];

// Arc data for stats
const ARC_CENTER = { x: -110, y: 300 };
const ARC_DATA = [
  { r: 330, startDeg: -92, endDeg: 16, dotDeg: -46, value: '10', suffix: '+', label: 'YEARS REAL' },
  { r: 395, startDeg: -56, endDeg: 60, dotDeg: 2, value: '40', suffix: '+', label: 'USE FORMS' },
  { r: 460, startDeg: -14, endDeg: 72, dotDeg: 44, value: '95', suffix: '%', label: 'REPEAT MEMBERS' },
];

function degToRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function polarToCart(cx: number, cy: number, r: number, deg: number) {
  const rad = degToRad(deg);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const start = polarToCart(cx, cy, r, startDeg);
  const end = polarToCart(cx, cy, r, endDeg);
  const sweep = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${sweep} 1 ${end.x} ${end.y}`;
}

function arcLength(r: number, startDeg: number, endDeg: number) {
  return r * Math.abs(degToRad(endDeg - startDeg));
}

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -999, y: -999 });
  const smoothRef = useRef({ x: -999, y: -999 });
  const gridOffsetRef = useRef({ x: 0, y: 0 });
  const gridTargetRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const revealRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<SVGSVGElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
    const nx = e.clientX / window.innerWidth;
    const ny = e.clientY / window.innerHeight;
    gridTargetRef.current = { x: (nx - 0.5) * 16, y: (ny - 0.5) * 16 };
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      // Smooth cursor
      smoothRef.current.x += (mouseRef.current.x - smoothRef.current.x) * 0.1;
      smoothRef.current.y += (mouseRef.current.y - smoothRef.current.y) * 0.1;

      // Grid parallax lerp
      gridOffsetRef.current.x += (gridTargetRef.current.x - gridOffsetRef.current.x) * 0.06;
      gridOffsetRef.current.y += (gridTargetRef.current.y - gridOffsetRef.current.y) * 0.06;

      // Update grid
      if (gridRef.current) {
        const pattern = gridRef.current.querySelector('pattern');
        if (pattern) {
          pattern.setAttribute('x', String(gridOffsetRef.current.x));
          pattern.setAttribute('y', String(gridOffsetRef.current.y));
        }
      }

      // Update canvas mask
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const w = window.innerWidth;
          const h = window.innerHeight;
          if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w;
            canvas.height = h;
          }
          ctx.clearRect(0, 0, w, h);
          const cx = smoothRef.current.x;
          const cy = smoothRef.current.y;
          const radius = 260;
          const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
          gradient.addColorStop(0, 'rgba(255,255,255,1)');
          gradient.addColorStop(0.4, 'rgba(255,255,255,1)');
          gradient.addColorStop(0.6, 'rgba(255,255,255,0.75)');
          gradient.addColorStop(0.75, 'rgba(255,255,255,0.4)');
          gradient.addColorStop(0.88, 'rgba(255,255,255,0.12)');
          gradient.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.fill();

          const dataUrl = canvas.toDataURL();
          if (revealRef.current) {
            revealRef.current.style.maskImage = `url(${dataUrl})`;
            revealRef.current.style.webkitMaskImage = `url(${dataUrl})`;
            revealRef.current.style.maskSize = '100% 100%';
            revealRef.current.style.webkitMaskSize = '100% 100%';
          }
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove]);

  return (
    <div
      className="min-h-screen bg-white tracking-[-0.02em]"
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      {/* Hidden canvas for mask */}
      <canvas
        ref={canvasRef}
        className="hidden"
      />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between md:justify-center p-4 sm:p-5">
        {/* Desktop pill */}
        <div className="hidden md:flex bg-black/60 backdrop-blur-md rounded-full pl-3 pr-2 py-2 items-center gap-1 nav-drop">
          {/* Logo */}
          <svg width="22" height="22" viewBox="0 0 256 256" fill="white" className="flex-shrink-0">
            <path d="M 256 64 L 256 128 L 192.5 128 L 160 95 L 128 64 L 96 95 L 63.5 128 L 64 128 L 128 192 L 128 256 L 64.5 256 L 32 223 L 0 192 L 0 64 L 64 0 L 192 0 Z M 256 192 L 256 256 L 192.5 256 L 160 223 L 128 192 L 128 128 L 192 128 Z" />
          </svg>
          {NAV_LINKS.map((link, i) => (
            <button
              key={link}
              className={`text-sm font-medium px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors ${
                i === 0 ? 'text-white' : 'text-gray-300 hover:text-white'
              }`}
            >
              {link}
            </button>
          ))}
          <button className="bg-white text-gray-900 text-sm font-semibold px-5 py-1.5 rounded-full hover:bg-gray-100 ml-1 transition-colors">
            Connect
          </button>
        </div>

        {/* Mobile: logo pill + hamburger */}
        <div className="flex md:hidden items-center w-full justify-between">
          <div className="bg-black/60 backdrop-blur-md rounded-full p-2.5 nav-drop">
            <svg width="22" height="22" viewBox="0 0 256 256" fill="white">
              <path d="M 256 64 L 256 128 L 192.5 128 L 160 95 L 128 64 L 96 95 L 63.5 128 L 64 128 L 128 192 L 128 256 L 64.5 256 L 32 223 L 0 192 L 0 64 L 64 0 L 192 0 Z M 256 192 L 256 256 L 192.5 256 L 160 223 L 128 192 L 128 128 L 192 128 Z" />
            </svg>
          </div>
          <button
            className="bg-black/60 backdrop-blur-md rounded-full p-2.5 nav-drop"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} color="white" /> : <Menu size={22} color="white" />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-white pt-16 pb-6 px-5 shadow-lg md:hidden">
          {NAV_LINKS.map((link) => (
            <button
              key={link}
              className="block w-full text-left text-gray-800 py-3 border-b border-gray-100 text-sm font-medium"
              onClick={() => setMobileOpen(false)}
            >
              {link}
            </button>
          ))}
          <button
            className="mt-4 bg-gray-900 text-white text-sm font-semibold px-6 py-2.5 rounded-full w-full"
            onClick={() => setMobileOpen(false)}
          >
            Connect
          </button>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ height: '100dvh' }}>
        {/* Layer 1: Grid background */}
        <svg
          ref={gridRef}
          className="absolute inset-0 w-full h-full z-0"
          style={{ opacity: 0.1 }}
        >
          <defs>
            <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse" x="0" y="0">
              <path
                d="M 48 0 L 0 0 0 48"
                fill="none"
                stroke="#64748b"
                strokeWidth="0.6"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Layer 2: Base image with Ken Burns */}
        <div
          className="absolute inset-0 z-10 bg-center bg-cover ken-burns"
          style={{ backgroundImage: `url(${BG_IMAGE_1})` }}
        />

        {/* Layer 3: Cursor spotlight reveal */}
        <div
          ref={revealRef}
          className="absolute inset-0 z-30 bg-center bg-cover"
          style={{ backgroundImage: `url(${BG_IMAGE_2})` }}
        />

        {/* Layer 4: Stats arcs (hidden below sm) */}
        <div className="absolute inset-y-0 right-0 pointer-events-none hidden sm:block z-50">
          <svg
            viewBox="0 0 380 700"
            preserveAspectRatio="xMaxYMid meet"
            className="h-full w-auto"
          >
            <defs>
              {ARC_DATA.map((arc, i) => {
                const start = polarToCart(ARC_CENTER.x, ARC_CENTER.y, arc.r, arc.startDeg);
                const end = polarToCart(ARC_CENTER.x, ARC_CENTER.y, arc.r, arc.endDeg);
                return (
                  <linearGradient
                    key={`grad-${i}`}
                    id={`arcGrad${i}`}
                    gradientUnits="userSpaceOnUse"
                    x1={start.x}
                    y1={start.y}
                    x2={end.x}
                    y2={end.y}
                  >
                    <stop offset="0%" stopColor="white" stopOpacity="0" />
                    <stop offset="22%" stopColor="white" stopOpacity="0.5" />
                    <stop offset="55%" stopColor="white" stopOpacity="0.5" />
                    <stop offset="85%" stopColor="white" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="white" stopOpacity="0" />
                  </linearGradient>
                );
              })}
            </defs>

            {ARC_DATA.map((arc, i) => {
              const path = arcPath(ARC_CENTER.x, ARC_CENTER.y, arc.r, arc.startDeg, arc.endDeg);
              const len = arcLength(arc.r, arc.startDeg, arc.endDeg);
              const dot = polarToCart(ARC_CENTER.x, ARC_CENTER.y, arc.r, arc.dotDeg);
              const lineDelay = 0.4 + i * 0.22;
              const dotDelay = lineDelay + 0.9;

              return (
                <g key={i}>
                  {/* Arc line */}
                  <path
                    d={path}
                    fill="none"
                    stroke={`url(#arcGrad${i})`}
                    strokeWidth="1.1"
                    strokeDasharray={len}
                    strokeDashoffset={len}
                    className="arc-line"
                    style={{
                      '--len': len,
                      animationDelay: `${lineDelay}s`,
                    } as React.CSSProperties}
                  />
                  {/* Dot ring (pulse) */}
                  <circle
                    cx={dot.x}
                    cy={dot.y}
                    r={7}
                    fill="none"
                    stroke="white"
                    strokeWidth="1"
                    strokeOpacity="0.35"
                    className="arc-ring"
                    style={{ animationDelay: `${dotDelay + 0.3}s` }}
                  />
                  {/* Dot */}
                  <circle
                    cx={dot.x}
                    cy={dot.y}
                    r={3.4}
                    fill="white"
                    className="arc-dot"
                    style={{ animationDelay: `${dotDelay}s` }}
                  />
                  {/* Number */}
                  <text
                    x={dot.x + 16}
                    y={dot.y + 4}
                    fill="white"
                    fontSize="32"
                    fontWeight="700"
                    letterSpacing="-1px"
                    className="arc-text"
                    style={{ animationDelay: `${dotDelay + 0.15}s` }}
                  >
                    {arc.value}
                    <tspan fontSize="19" dy="-10">
                      {arc.suffix}
                    </tspan>
                  </text>
                  {/* Label */}
                  <text
                    x={dot.x + 18}
                    y={dot.y + 22}
                    fill="white"
                    fillOpacity="0.8"
                    fontSize="8.5"
                    fontWeight="600"
                    letterSpacing="2px"
                    className="arc-text"
                    style={{ animationDelay: `${dotDelay + 0.3}s` }}
                  >
                    {arc.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Layer 5: Hero text block */}
        <div className="absolute bottom-12 sm:bottom-16 md:bottom-24 left-5 sm:left-8 md:left-12 max-w-[300px] sm:max-w-md z-50">
          {/* Eyebrow */}
          <p
            className="hero-rise text-[11px] sm:text-xs font-semibold tracking-[0.12em] text-white/90 mb-3"
            style={{ animationDelay: '0.15s' }}
          >
            Gateway to your <span className="italic">augmented self</span>
          </p>

          {/* H1 */}
          <h1
            className="hero-rise text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-[-0.08em] text-white mb-4"
            style={{ animationDelay: '0.3s' }}
          >
            A window <br /> of coming <br /> enhancements
          </h1>

          {/* Paragraph */}
          <p
            className="hero-rise text-sm sm:text-base text-white/90 leading-relaxed mb-6"
            style={{ animationDelay: '0.5s' }}
          >
            A future where carbon fiber, titanium, and human instinct align. Not machine. Not human.
            Something wonderfully poised between.
          </p>

          {/* CTA Button */}
          <div className="hero-rise" style={{ animationDelay: '0.7s' }}>
            <button className="group relative bg-white text-gray-900 font-semibold px-7 sm:px-8 py-3 sm:py-3.5 rounded-full shadow-lg shadow-black/20 hover:scale-[1.04] active:scale-95 transition-transform overflow-hidden">
              <span className="relative z-10">Reserve Now</span>
              <span className="shine-sweep absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
