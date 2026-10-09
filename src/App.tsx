import { useState, useEffect, useRef, useCallback } from 'react';
import { Menu, X, ChevronRight, Zap, Shield, Flame, Heart, Clock, MapPin, Phone, Mail, Instagram, Twitter, Youtube, ArrowRight, Star, Users, Dumbbell, Target, Activity } from 'lucide-react';

const BG_IMAGE_1 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_125121_afb71ce9-9c64-4c54-90b5-c89c0764c052.png&w=1920&q=85';
const BG_IMAGE_2 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_135737_0da59642-725b-451a-997b-b0283d95a42a.png&w=1280&q=85';

const NAV_LINKS = ['Module', 'Case Records', 'Biotech', 'Tiers', 'Live Demo'];

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

// Programs data
const programs = [
  {
    icon: Dumbbell,
    title: 'Strength Protocol',
    desc: 'Progressive overload systems engineered for maximum hypertrophy. Periodized blocks from mesocycles to peaking phases.',
    tag: 'MODULE 01',
    color: 'from-red-500/20 to-transparent',
  },
  {
    icon: Zap,
    title: 'Combat Systems',
    desc: 'MMA, boxing, and tactical conditioning. Forge reflexes that operate faster than conscious thought.',
    tag: 'MODULE 02',
    color: 'from-orange-500/20 to-transparent',
  },
  {
    icon: Activity,
    title: 'Metabolic Forge',
    desc: 'HIIT protocols and metabolic conditioning that push your VO2 max beyond previous limitations.',
    tag: 'MODULE 03',
    color: 'from-yellow-500/20 to-transparent',
  },
  {
    icon: Shield,
    title: 'Recovery Matrix',
    desc: 'Cryotherapy, infrared, and mobility work. Your body rebuilds stronger in the spaces between intensity.',
    tag: 'MODULE 04',
    color: 'from-cyan-500/20 to-transparent',
  },
];

// Membership tiers
const tiers = [
  {
    name: 'Initiate',
    price: '49',
    period: '/month',
    features: ['Full gym access', '2 group classes/week', 'Locker room access', 'Basic fitness assessment'],
    popular: false,
  },
  {
    name: 'Operator',
    price: '99',
    period: '/month',
    features: ['Unlimited gym access', 'All group classes', '1 PT session/month', 'Recovery zone access', 'Nutrition planning', 'Progress tracking app'],
    popular: true,
  },
  {
    name: 'Apex',
    price: '199',
    period: '/month',
    features: ['Everything in Operator', '4 PT sessions/month', 'Unlimited recovery', 'Custom programming', 'Priority booking', 'Guest passes (2/mo)', 'Competition prep'],
    popular: false,
  },
];

// Trainers
const trainers = [
  { name: 'Kai Nakamura', specialty: 'Strength & Powerlifting', exp: '12 years', img: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&h=500&fit=crop&crop=top' },
  { name: 'Zara Okafor', specialty: 'Combat & Conditioning', exp: '8 years', img: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&h=500&fit=crop&crop=top' },
  { name: 'Dmitri Volkov', specialty: 'Olympic Lifting', exp: '15 years', img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=500&fit=crop&crop=top' },
  { name: 'Maya Chen', specialty: 'Mobility & Recovery', exp: '10 years', img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=500&fit=crop&crop=top' },
];

// Schedule
const schedule = [
  { time: '06:00', mon: 'Strength Protocol', tue: 'Combat Systems', wed: 'Metabolic Forge', thu: 'Strength Protocol', fri: 'Open Gym' },
  { time: '08:00', mon: 'Metabolic Forge', tue: 'Mobility Flow', wed: 'Strength Protocol', thu: 'Combat Systems', fri: 'HIIT Blast' },
  { time: '12:00', mon: 'Open Gym', tue: 'Strength Protocol', wed: 'Combat Systems', thu: 'Metabolic Forge', fri: 'Open Gym' },
  { time: '17:00', mon: 'Combat Systems', tue: 'Strength Protocol', wed: 'HIIT Blast', thu: 'Open Gym', fri: 'Social Lift' },
  { time: '19:00', mon: 'HIIT Blast', tue: 'Open Gym', wed: 'Mobility Flow', thu: 'Strength Protocol', fri: '—' },
];

// Testimonials
const testimonials = [
  { name: 'Alex Rivera', role: 'Operator Member — 2 years', text: 'This place rewired how I think about training. The programming is surgical — every session builds on the last. Down 18kg and stronger than I\'ve ever been.', rating: 5 },
  { name: 'Jordan Park', role: 'Apex Member — 1 year', text: 'The recovery zone alone is worth the membership. But combined with the coaching? I hit my first 200kg deadlift at 8 months in. Unreal.', rating: 5 },
  { name: 'Sam Torres', role: 'Operator Member — 3 years', text: 'I\'ve trained at six gyms across three cities. Nothing comes close. The community pushes you, the systems deliver, and the atmosphere is electric.', rating: 5 },
];

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
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
    const nx = e.clientX / window.innerWidth;
    const ny = e.clientY / window.innerHeight;
    gridTargetRef.current = { x: (nx - 0.5) * 16, y: (ny - 0.5) * 16 };
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      smoothRef.current.x += (mouseRef.current.x - smoothRef.current.x) * 0.1;
      smoothRef.current.y += (mouseRef.current.y - smoothRef.current.y) * 0.1;

      gridOffsetRef.current.x += (gridTargetRef.current.x - gridOffsetRef.current.x) * 0.06;
      gridOffsetRef.current.y += (gridTargetRef.current.y - gridOffsetRef.current.y) * 0.06;

      if (gridRef.current) {
        const pattern = gridRef.current.querySelector('pattern');
        if (pattern) {
          pattern.setAttribute('x', String(gridOffsetRef.current.x));
          pattern.setAttribute('y', String(gridOffsetRef.current.y));
        }
      }

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

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="min-h-screen bg-white tracking-[-0.02em]"
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      <canvas ref={canvasRef} className="hidden" />

      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between md:justify-center p-4 sm:p-5">
        <div className="hidden md:flex bg-black/60 backdrop-blur-md rounded-full pl-3 pr-2 py-2 items-center gap-1 nav-drop">
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

      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden" style={{ height: '100dvh' }}>
        <svg ref={gridRef} className="absolute inset-0 w-full h-full z-0" style={{ opacity: 0.1 }}>
          <defs>
            <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse" x="0" y="0">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#64748b" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        <div
          className="absolute inset-0 z-10 bg-center bg-cover ken-burns"
          style={{ backgroundImage: `url(${BG_IMAGE_1})` }}
        />

        <div
          ref={revealRef}
          className="absolute inset-0 z-30 bg-center bg-cover"
          style={{ backgroundImage: `url(${BG_IMAGE_2})` }}
        />

        {/* Stats Arcs */}
        <div className="absolute inset-y-0 right-0 pointer-events-none hidden sm:block z-50">
          <svg viewBox="0 0 380 700" preserveAspectRatio="xMaxYMid meet" className="h-full w-auto">
            <defs>
              {ARC_DATA.map((arc, i) => {
                const start = polarToCart(ARC_CENTER.x, ARC_CENTER.y, arc.r, arc.startDeg);
                const end = polarToCart(ARC_CENTER.x, ARC_CENTER.y, arc.r, arc.endDeg);
                return (
                  <linearGradient key={`grad-${i}`} id={`arcGrad${i}`} gradientUnits="userSpaceOnUse" x1={start.x} y1={start.y} x2={end.x} y2={end.y}>
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
                  <path d={path} fill="none" stroke={`url(#arcGrad${i})`} strokeWidth="1.1" strokeDasharray={len} strokeDashoffset={len} className="arc-line" style={{ '--len': len, animationDelay: `${lineDelay}s` } as React.CSSProperties} />
                  <circle cx={dot.x} cy={dot.y} r={7} fill="none" stroke="white" strokeWidth="1" strokeOpacity="0.35" className="arc-ring" style={{ animationDelay: `${dotDelay + 0.3}s` }} />
                  <circle cx={dot.x} cy={dot.y} r={3.4} fill="white" className="arc-dot" style={{ animationDelay: `${dotDelay}s` }} />
                  <text x={dot.x + 16} y={dot.y + 4} fill="white" fontSize="32" fontWeight="700" letterSpacing="-1px" className="arc-text" style={{ animationDelay: `${dotDelay + 0.15}s` }}>
                    {arc.value}<tspan fontSize="19" dy="-10">{arc.suffix}</tspan>
                  </text>
                  <text x={dot.x + 18} y={dot.y + 22} fill="white" fillOpacity="0.8" fontSize="8.5" fontWeight="600" letterSpacing="2px" className="arc-text" style={{ animationDelay: `${dotDelay + 0.3}s` }}>
                    {arc.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Hero Text */}
        <div className="absolute bottom-12 sm:bottom-16 md:bottom-24 left-5 sm:left-8 md:left-12 max-w-[300px] sm:max-w-md z-50">
          <p className="hero-rise text-[11px] sm:text-xs font-semibold tracking-[0.12em] text-white/90 mb-3" style={{ animationDelay: '0.15s' }}>
            Gateway to your <span className="italic">augmented self</span>
          </p>
          <h1 className="hero-rise text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-[-0.08em] text-white mb-4" style={{ animationDelay: '0.3s' }}>
            A window <br /> of coming <br /> enhancements
          </h1>
          <p className="hero-rise text-sm sm:text-base text-white/90 leading-relaxed mb-6" style={{ animationDelay: '0.5s' }}>
            A future where carbon fiber, titanium, and human instinct align. Not machine. Not human. Something wonderfully poised between.
          </p>
          <div className="hero-rise" style={{ animationDelay: '0.7s' }}>
            <button className="group relative bg-white text-gray-900 font-semibold px-7 sm:px-8 py-3 sm:py-3.5 rounded-full shadow-lg shadow-black/20 hover:scale-[1.04] active:scale-95 transition-transform overflow-hidden">
              <span className="relative z-10">Reserve Now</span>
              <span className="shine-sweep absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full" />
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 hidden md:flex flex-col items-center gap-2 opacity-60">
          <span className="text-[10px] tracking-[0.2em] text-white uppercase">Scroll</span>
          <div className="w-px h-8 bg-white/40 animate-pulse" />
        </div>
      </section>

      {/* ===== PROGRAMS SECTION ===== */}
      <section className="relative bg-gray-950 py-20 sm:py-28 md:py-36 overflow-hidden">
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 md:px-12">
          {/* Section header */}
          <div className="mb-16 md:mb-20">
            <p className="text-[11px] sm:text-xs font-semibold tracking-[0.12em] text-red-400 mb-3">TRAINING MODULES</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl leading-[1.05] tracking-[-0.06em] text-white mb-4">
              Engineered for<br />human optimization
            </h2>
            <p className="text-sm sm:text-base text-white/60 max-w-lg leading-relaxed">
              Four interconnected systems designed to push every dimension of physical capability. Each module builds on the last.
            </p>
          </div>

          {/* Program cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {programs.map((prog, i) => (
              <div
                key={prog.title}
                className="group relative bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 sm:p-7 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-500 cursor-pointer"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${prog.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <span className="text-[10px] tracking-[0.15em] text-white/40 font-medium">{prog.tag}</span>
                  <div className="mt-4 mb-5">
                    <prog.icon size={28} className="text-white/80" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 tracking-[-0.02em]">{prog.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed mb-5">{prog.desc}</p>
                  <div className="flex items-center gap-2 text-xs text-white/40 group-hover:text-white/70 transition-colors">
                    <span>Explore module</span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS BANNER ===== */}
      <section className="relative bg-gray-950 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 py-16 sm:py-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
            {[
              { value: '2,400+', label: 'Active Members', icon: Users },
              { value: '15', label: 'Expert Coaches', icon: Target },
              { value: '98%', label: 'Goal Completion', icon: Flame },
              { value: '24/7', label: 'Facility Access', icon: Clock },
            ].map((stat) => (
              <div key={stat.label} className="text-center sm:text-left">
                <stat.icon size={20} className="text-red-400 mb-3 mx-auto sm:mx-0" strokeWidth={1.5} />
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-[-0.04em]">{stat.value}</div>
                <div className="text-xs sm:text-sm text-white/40 mt-1 tracking-[0.05em]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MEMBERSHIP TIERS ===== */}
      <section className="relative bg-gray-950 py-20 sm:py-28 md:py-36 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 md:px-12">
          <div className="text-center mb-16 md:mb-20">
            <p className="text-[11px] sm:text-xs font-semibold tracking-[0.12em] text-red-400 mb-3">MEMBERSHIP TIERS</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl leading-[1.05] tracking-[-0.06em] text-white mb-4">
              Choose your protocol
            </h2>
            <p className="text-sm sm:text-base text-white/60 max-w-lg mx-auto leading-relaxed">
              Every tier unlocks a different depth of access. No contracts. No hidden fees. Just commitment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-2xl p-6 sm:p-8 border transition-all duration-300 ${
                  tier.popular
                    ? 'bg-white/[0.06] border-red-500/30 scale-[1.02] md:scale-105'
                    : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[10px] font-bold tracking-[0.1em] px-3 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white tracking-[-0.02em]">{tier.name}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-bold text-white tracking-[-0.04em]">${tier.price}</span>
                    <span className="text-sm text-white/40">{tier.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-white/60">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-full text-sm font-semibold transition-all ${
                    tier.popular
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-white/[0.06] text-white border border-white/[0.1] hover:bg-white/[0.1]'
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TRAINERS ===== */}
      <section className="relative bg-gray-950 border-t border-white/[0.06] py-20 sm:py-28 md:py-36 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 md:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-16 md:mb-20 gap-4">
            <div>
              <p className="text-[11px] sm:text-xs font-semibold tracking-[0.12em] text-red-400 mb-3">THE COACHES</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl leading-[1.05] tracking-[-0.06em] text-white">
                Built different.<br />Train different.
              </h2>
            </div>
            <p className="text-sm text-white/50 max-w-xs leading-relaxed">
              Each coach brings a decade+ of specialization. They don't just train you — they reconstruct you.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {trainers.map((trainer) => (
              <div key={trainer.name} className="group relative">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4">
                  <img
                    src={trainer.img}
                    alt={trainer.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-base font-semibold text-white tracking-[-0.02em]">{trainer.name}</h3>
                    <p className="text-xs text-white/50 mt-1">{trainer.specialty}</p>
                    <p className="text-[10px] text-red-400 mt-1 tracking-[0.1em]">{trainer.exp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SCHEDULE ===== */}
      <section className="relative bg-gray-950 border-t border-white/[0.06] py-20 sm:py-28 md:py-36 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 md:px-12">
          <div className="text-center mb-16 md:mb-20">
            <p className="text-[11px] sm:text-xs font-semibold tracking-[0.12em] text-red-400 mb-3">WEEKLY PROTOCOL</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl leading-[1.05] tracking-[-0.06em] text-white mb-4">
              Class schedule
            </h2>
            <p className="text-sm sm:text-base text-white/60 max-w-lg mx-auto leading-relaxed">
              Structured sessions throughout the day. Every class is capped at 12 athletes for maximum coaching attention.
            </p>
          </div>

          {/* Desktop schedule table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full max-w-4xl mx-auto">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left py-4 px-4 text-[10px] tracking-[0.15em] text-white/30 font-medium">TIME</th>
                  {['MON', 'TUE', 'WED', 'THU', 'FRI'].map((day) => (
                    <th key={day} className="text-left py-4 px-4 text-[10px] tracking-[0.15em] text-white/30 font-medium">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {schedule.map((row, i) => (
                  <tr key={row.time} className={`border-b border-white/[0.04] ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                    <td className="py-4 px-4 text-sm font-semibold text-red-400">{row.time}</td>
                    <td className="py-4 px-4 text-sm text-white/60">{row.mon}</td>
                    <td className="py-4 px-4 text-sm text-white/60">{row.tue}</td>
                    <td className="py-4 px-4 text-sm text-white/60">{row.wed}</td>
                    <td className="py-4 px-4 text-sm text-white/60">{row.thu}</td>
                    <td className="py-4 px-4 text-sm text-white/60">{row.fri}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile schedule cards */}
          <div className="md:hidden space-y-3">
            {schedule.map((row) => (
              <div key={row.time} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                <div className="text-sm font-semibold text-red-400 mb-2">{row.time}</div>
                <div className="grid grid-cols-2 gap-2 text-xs text-white/60">
                  <div><span className="text-white/30">Mon:</span> {row.mon}</div>
                  <div><span className="text-white/30">Tue:</span> {row.tue}</div>
                  <div><span className="text-white/30">Wed:</span> {row.wed}</div>
                  <div><span className="text-white/30">Thu:</span> {row.thu}</div>
                  <div className="col-span-2"><span className="text-white/30">Fri:</span> {row.fri}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="relative bg-gray-950 border-t border-white/[0.06] py-20 sm:py-28 md:py-36 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 md:px-12">
          <div className="text-center mb-16 md:mb-20">
            <p className="text-[11px] sm:text-xs font-semibold tracking-[0.12em] text-red-400 mb-3">FIELD REPORTS</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl leading-[1.05] tracking-[-0.06em] text-white">
              What operators say
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 sm:p-10 md:p-12">
              <div className="flex gap-1 mb-6">
                {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-red-400 text-red-400" />
                ))}
              </div>
              <p className="text-base sm:text-lg text-white/80 leading-relaxed mb-8 min-h-[80px]">
                "{testimonials[activeTestimonial].text}"
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">{testimonials[activeTestimonial].name}</p>
                  <p className="text-xs text-white/40 mt-0.5">{testimonials[activeTestimonial].role}</p>
                </div>
                <div className="flex gap-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveTestimonial(i)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === activeTestimonial ? 'bg-red-400 w-6' : 'bg-white/20 hover:bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="relative bg-gray-950 border-t border-white/[0.06] py-20 sm:py-28 md:py-36 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

        <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 md:px-12 text-center">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1.5 mb-6">
            <Heart size={14} className="text-red-400" />
            <span className="text-[10px] tracking-[0.15em] text-red-400 font-semibold">LIMITED SPOTS AVAILABLE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-[-0.06em] text-white mb-6">
            Your transformation<br />starts today
          </h2>
          <p className="text-sm sm:text-base text-white/60 max-w-lg mx-auto leading-relaxed mb-10">
            Book a free consultation and facility tour. No pressure. No commitments. Just a conversation about what's possible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group relative bg-white text-gray-900 font-semibold px-8 py-4 rounded-full shadow-lg shadow-black/20 hover:scale-[1.04] active:scale-95 transition-transform overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                Book Free Trial
                <ArrowRight size={16} />
              </span>
              <span className="shine-sweep absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full" />
            </button>
            <button className="border border-white/20 text-white font-semibold px-8 py-4 rounded-full hover:bg-white/[0.06] transition-colors">
              View All Programs
            </button>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative bg-gray-950 border-t border-white/[0.06] pt-16 sm:pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-8 mb-16">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <svg width="28" height="28" viewBox="0 0 256 256" fill="white">
                  <path d="M 256 64 L 256 128 L 192.5 128 L 160 95 L 128 64 L 96 95 L 63.5 128 L 64 128 L 128 192 L 128 256 L 64.5 256 L 32 223 L 0 192 L 0 64 L 64 0 L 192 0 Z M 256 192 L 256 256 L 192.5 256 L 160 223 L 128 192 L 128 128 L 192 128 Z" />
                </svg>
                <span className="text-white font-bold text-lg tracking-[-0.02em]">AUGMENTED</span>
              </div>
              <p className="text-sm text-white/40 leading-relaxed max-w-xs">
                Where carbon fiber meets carbon-based life. Training facilities engineered for the next evolution of human performance.
              </p>
              <div className="flex gap-3 mt-5">
                {[Instagram, Twitter, Youtube].map((Icon, i) => (
                  <button key={i} className="w-9 h-9 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.1] transition-colors">
                    <Icon size={16} className="text-white/60" />
                  </button>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-xs font-semibold tracking-[0.1em] text-white/60 mb-4">PROGRAMS</h4>
              <ul className="space-y-2.5">
                {['Strength Protocol', 'Combat Systems', 'Metabolic Forge', 'Recovery Matrix', 'Open Gym'].map((link) => (
                  <li key={link}><a href="#" className="text-sm text-white/40 hover:text-white/70 transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold tracking-[0.1em] text-white/60 mb-4">COMPANY</h4>
              <ul className="space-y-2.5">
                {['About', 'Careers', 'Blog', 'Press', 'Partners'].map((link) => (
                  <li key={link}><a href="#" className="text-sm text-white/40 hover:text-white/70 transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-xs font-semibold tracking-[0.1em] text-white/60 mb-4">CONTACT</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <MapPin size={14} className="text-white/30 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-white/40">742 Industrial Blvd<br />Brooklyn, NY 11222</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={14} className="text-white/30 flex-shrink-0" />
                  <span className="text-sm text-white/40">+1 (347) 555-0199</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={14} className="text-white/30 flex-shrink-0" />
                  <span className="text-sm text-white/40">connect@augmented.gym</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/30">© 2026 Augmented Gym. All rights reserved.</p>
            <div className="flex gap-6">
              {['Privacy', 'Terms', 'Cookies'].map((link) => (
                <a key={link} href="#" className="text-xs text-white/30 hover:text-white/60 transition-colors">{link}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
