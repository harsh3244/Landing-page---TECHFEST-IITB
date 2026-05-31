import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  ChevronRight, Cpu, Shield, Zap, Lock, TerminalSquare, Eye,
  Fingerprint, Activity, Menu, X, Radio, Crosshair, Database, Wifi
} from "lucide-react";

// ─── Utilities ───────────────────────────────────────────────────────────────

const useInView = (threshold = 0.15) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
};

// ─── Subcomponents ────────────────────────────────────────────────────────────

const CornerBrackets = ({ size = 20, color = "#00C8FF", animated = false }) => (
  <>
    {[
      { top: 0, left: 0, borderRight: "none", borderBottom: "none" },
      { top: 0, right: 0, borderLeft: "none", borderBottom: "none" },
      { bottom: 0, left: 0, borderRight: "none", borderTop: "none" },
      { bottom: 0, right: 0, borderLeft: "none", borderTop: "none" },
    ].map((s, i) => (
      <div
        key={i}
        className={animated ? "animate-pulse" : ""}
        style={{
          position: "absolute",
          width: size,
          height: size,
          border: `2px solid ${color}`,
          ...s,
          transition: "all 0.3s",
        }}
      />
    ))}
  </>
);

const AnimatedCounter = ({ end, duration = 2.5, suffix = "", decimals = 0 }) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView(0.5);
  useEffect(() => {
    if (!inView) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(parseFloat((eased * end).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, end, duration, decimals]);

  return (
    <span ref={ref} className="font-heading font-black text-4xl md:text-5xl tracking-wider tabular-nums">
      {decimals > 0 ? count.toFixed(decimals) : count.toLocaleString()}{suffix}
    </span>
  );
};

const Radar = () => (
  <div className="relative w-40 h-40">
    <svg viewBox="0 0 160 160" className="w-full h-full" style={{ filter: "drop-shadow(0 0 8px #00C8FF)" }}>
      <circle cx="80" cy="80" r="75" fill="none" stroke="#00C8FF" strokeWidth="1" strokeOpacity="0.3" />
      <circle cx="80" cy="80" r="55" fill="none" stroke="#00C8FF" strokeWidth="0.5" strokeOpacity="0.2" />
      <circle cx="80" cy="80" r="35" fill="none" stroke="#00C8FF" strokeWidth="0.5" strokeOpacity="0.2" />
      <line x1="80" y1="5" x2="80" y2="155" stroke="#00C8FF" strokeWidth="0.5" strokeOpacity="0.2" />
      <line x1="5" y1="80" x2="155" y2="80" stroke="#00C8FF" strokeWidth="0.5" strokeOpacity="0.2" />
      <circle cx="110" cy="50" r="3" fill="#AAFF00" />
      <circle cx="50" cy="100" r="2" fill="#FF0080" />
      <circle cx="120" cy="105" r="2" fill="#AAFF00" />
    </svg>
    <div
      className="absolute inset-0"
      style={{
        background: "conic-gradient(from 0deg, transparent 270deg, rgba(0,200,255,0.3) 360deg)",
        animation: "radar-sweep 3s linear infinite",
        borderRadius: "50%",
      }}
    />
  </div>
);

const LiveTicker = () => {
  const items = [
    "SYS.STATUS: ONLINE", "NEURAL SYNC: 99.7%", "THREAT LEVEL: MINIMAL",
    "UNITS DEPLOYED: 12,847", "LATENCY: 0.3ms", "ENCRYPTION: QUANTUM-LOCKED",
    "BIO-SYNC: ACTIVE", "UPTIME: 9,312 HRS", "NEXT UPGRADE: AVAILABLE",
  ];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % items.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="bg-black/80 border-b border-primary/30 py-1.5 px-6 font-mono text-xs overflow-hidden relative z-50">
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        <span className="text-primary flex items-center gap-1.5 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse inline-block" />
          LIVE FEED
        </span>
        <div className="flex-1 overflow-hidden h-4 relative">
          <AnimatePresence mode="wait">
            <motion.span
              key={idx}
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute text-secondary tracking-widest"
            >
              {items[idx]}
            </motion.span>
          </AnimatePresence>
        </div>
        <div className="flex gap-3 shrink-0">
          {["#AAFF00","#00C8FF","#FF0080"].map((c,i) => (
            <div key={i} className="w-1 h-3 rounded-sm animate-pulse" style={{ backgroundColor: c, animationDelay: `${i*200}ms` }} />
          ))}
        </div>
      </div>
    </div>
  );
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { href: "#features", label: "MODULES" },
    { href: "#process", label: "PROTOCOL" },
    { href: "#operatives", label: "OPERATIVES" },
    { href: "#contact", label: "INITIATE" },
  ];

  return (
    <nav
      className="fixed top-7 left-0 right-0 z-40 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(5,10,20,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(0,200,255,0.2)" : "none",
        boxShadow: scrolled ? "0 0 30px rgba(0,200,255,0.08)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-4">
        <a href="#" className="flex items-center gap-2 group shrink-0">
          <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-primary group-hover:animate-spin" style={{ filter: "drop-shadow(0 0 6px #AAFF00)" }} />
          <span className="font-heading font-black text-base sm:text-xl tracking-widest text-white">
            NEXUS<span className="text-primary" style={{ textShadow: "0 0 10px #AAFF00" }}>CYBORG</span>
          </span>
        </a>

        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              className="font-mono text-xs tracking-widest text-muted-foreground hover:text-primary transition-colors duration-200 relative group whitespace-nowrap"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" style={{ boxShadow: "0 0 6px #AAFF00" }} />
            </a>
          ))}
          <a
            href="#contact"
            className="px-4 py-2 font-heading font-bold text-xs tracking-widest text-background uppercase transition-all duration-300 hover:scale-105 whitespace-nowrap"
            style={{
              background: "linear-gradient(135deg, #AAFF00, #00C8FF)",
              boxShadow: "0 0 20px rgba(170,255,0,0.4), 0 0 40px rgba(0,200,255,0.2)",
            }}
            data-testid="nav-cta"
          >
            GET AUGMENTED
          </a>
        </div>

        <button className="lg:hidden text-primary p-1" onClick={() => setOpen(!open)} data-testid="nav-mobile-toggle">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden px-6 pb-6 border-t border-primary/20 bg-background/98 backdrop-blur-xl"
            style={{ background: "rgba(5,10,20,0.98)" }}
          >
            {links.map(l => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-4 font-mono text-sm tracking-widest text-muted-foreground hover:text-primary transition-colors border-b border-white/5"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="block mt-4 py-3 text-center font-heading font-bold text-sm tracking-widest text-background uppercase"
              style={{ background: "linear-gradient(135deg, #AAFF00, #00C8FF)" }}
              data-testid="nav-mobile-cta"
            >
              GET AUGMENTED
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// ─── Sections ─────────────────────────────────────────────────────────────────

const Hero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 80]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 pb-16 px-4 sm:px-6"
      style={{ background: "radial-gradient(ellipse at 50% 40%, #0A1628 0%, #050A14 60%)" }}>
      <div className="scanline" />
      <div className="scanline-bg" />

      {/* Animated grid */}
      <div className="absolute inset-0 circuit-grid opacity-30" />

      {/* Radial glows */}
      <motion.div style={{ y }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] lg:w-[700px] h-[300px] sm:h-[500px] lg:h-[700px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(170,255,0,0.07) 0%, transparent 70%)" }} />
        <div className="absolute top-1/2 left-0 w-[300px] h-[300px] rounded-full hidden md:block"
          style={{ background: "radial-gradient(circle, rgba(0,200,255,0.06) 0%, transparent 70%)" }} />
        <div className="absolute top-1/2 right-0 w-[250px] h-[250px] rounded-full hidden md:block"
          style={{ background: "radial-gradient(circle, rgba(255,0,128,0.04) 0%, transparent 70%)" }} />
      </motion.div>

      {/* Radar — desktop only */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
        className="absolute top-28 right-10 hidden xl:block">
        <Radar />
      </motion.div>

      {/* Left HUD bars — desktop only */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2 }}
        className="absolute left-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-3 font-mono text-xs">
        {[
          { label: "NEURAL", val: 99.7, color: "#AAFF00" },
          { label: "BIO-SYN", val: 88.2, color: "#00C8FF" },
          { label: "THREAT", val: 2.1, color: "#FF0080" },
        ].map((d) => (
          <div key={d.label} className="flex items-center gap-2">
            <span className="text-muted-foreground tracking-widest w-16">{d.label}</span>
            <div className="w-20 h-1 bg-white/5 overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${d.val}%` }}
                transition={{ delay: 1.5, duration: 1.5, ease: "easeOut" }}
                className="h-full" style={{ backgroundColor: d.color, boxShadow: `0 0 6px ${d.color}` }} />
            </div>
            <span style={{ color: d.color }}>{d.val}%</span>
          </div>
        ))}
      </motion.div>

      {/* Main content */}
      <div className="relative z-20 w-full max-w-5xl mx-auto text-center flex flex-col items-center">
        <div className="relative inline-flex items-center mb-5 sm:mb-7 px-4 py-1.5"
          style={{ border: "1px solid rgba(170,255,0,0.35)", background: "rgba(170,255,0,0.06)" }}>
          <CornerBrackets size={10} color="#AAFF00" animated />
          <span className="font-mono text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase text-primary">
            SYSTEM INITIALIZATION // V9.4.2
          </span>
        </div>

        <h1
          className="font-heading font-black text-white uppercase leading-none mb-4 sm:mb-5 tracking-tight"
          style={{
            fontSize: "clamp(2.8rem, 11vw, 7.5rem)",
            textShadow: "0 0 60px rgba(170,255,0,0.12)",
          }}
        >
          <span className="glitch block" data-text="NEXUS">NEXUS</span>
          <span
            className="glitch block text-transparent"
            data-text="CYBORG"
            style={{ WebkitTextStroke: "clamp(1px, 0.4vw, 2px) #AAFF00", filter: "drop-shadow(0 0 20px #AAFF00)" }}
          >CYBORG</span>
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-muted-foreground font-mono max-w-xl sm:max-w-2xl mb-7 sm:mb-9 leading-relaxed px-2">
          Where human intuition meets machine precision. Upgrade your biology with military-grade cybernetic enhancements designed for the next step in human evolution.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-sm sm:max-w-none sm:w-auto">
          <a
            href="#features"
            className="group relative px-6 sm:px-10 py-3.5 sm:py-4 font-heading font-black text-xs sm:text-sm tracking-widest uppercase text-background flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #AAFF00 0%, #00C8FF 100%)",
              boxShadow: "0 0 25px rgba(170,255,0,0.55), 0 0 50px rgba(0,200,255,0.3)",
            }}
            data-testid="button-explore"
          >
            <span>INITIALIZE UPGRADE</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>

          <a
            href="#specs"
            className="group relative px-6 sm:px-10 py-3.5 sm:py-4 font-heading font-bold text-xs sm:text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105"
            style={{
              border: "1px solid rgba(0,200,255,0.65)",
              color: "#00C8FF",
              background: "rgba(0,200,255,0.06)",
              boxShadow: "0 0 18px rgba(0,200,255,0.2), inset 0 0 18px rgba(0,200,255,0.06)",
            }}
            data-testid="button-specs"
          >
            <CornerBrackets size={8} color="rgba(0,200,255,0.65)" />
            VIEW SPECIFICATIONS
          </a>
        </div>

        <div className="mt-6 sm:mt-10 flex items-center gap-2 text-muted-foreground font-mono text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0" style={{ boxShadow: "0 0 6px #AAFF00" }} />
          <span className="tracking-widest">NO BIOLOGICAL LIMITATIONS DETECTED</span>
        </div>
      </div>

      {/* Bottom HUD — hidden on small mobile, shown md+ */}
      <div className="absolute bottom-6 left-0 right-0 px-6 sm:px-8 hidden md:flex justify-between items-end font-mono text-xs text-muted-foreground z-20">
        <div className="leading-relaxed">
          SYS.STATUS: <span className="text-primary" style={{ textShadow: "0 0 8px #AAFF00" }}>ONLINE</span><br />
          LATENCY: <span className="text-secondary">0.3ms</span>
        </div>
        <div className="flex gap-1.5 items-end">
          {[4,6,8,5,7,9,6,8].map((h, i) => (
            <div key={i} className="w-1.5 animate-pulse rounded-sm"
              style={{ height: h * 3, animationDelay: `${i * 120}ms`, background: i % 3 === 0 ? "#AAFF00" : i % 3 === 1 ? "#00C8FF" : "#FF0080" }} />
          ))}
        </div>
        <div className="text-right leading-relaxed">
          SIGNAL: <span className="text-accent" style={{ textShadow: "0 0 8px #FF0080" }}>ENCRYPTED</span><br />
          VER: 9.4.2
        </div>
      </div>
    </section>
  );
};

const Stats = () => {
  const stats = [
    { label: "UNITS DEPLOYED", value: 12847, suffix: "", color: "#AAFF00", icon: <Database className="w-5 h-5" /> },
    { label: "SYSTEM UPTIME", value: 99.7, suffix: "%", color: "#00C8FF", decimals: 1, icon: <Wifi className="w-5 h-5" /> },
    { label: "NEURAL LATENCY", value: 0.3, suffix: "ms", color: "#FF0080", decimals: 1, icon: <Activity className="w-5 h-5" /> },
  ];

  return (
    <div id="specs" className="border-y relative z-30" style={{ borderColor: "rgba(0,200,255,0.15)", background: "rgba(5,10,20,0.9)", backdropFilter: "blur(20px)" }}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x" style={{ borderColor: "rgba(0,200,255,0.1)" }}>
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="p-10 flex flex-col items-center justify-center gap-3 relative group cursor-default"
            style={{ borderColor: "rgba(0,200,255,0.1)" }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: `radial-gradient(ellipse at center, ${stat.color}08 0%, transparent 70%)` }} />
            <div className="flex items-center gap-2 mb-1" style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <AnimatedCounter end={stat.value} suffix={stat.suffix} decimals={stat.decimals ?? 0} />
            <div className="w-full h-px mt-2 mb-2" style={{ background: `linear-gradient(to right, transparent, ${stat.color}60, transparent)` }} />
            <span className="font-mono text-xs tracking-[0.25em]" style={{ color: stat.color }}>{stat.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const Features = () => {
  const features = [
    { icon: <Cpu className="w-7 h-7" />, title: "Neural Interface", desc: "Direct brain-to-machine link with sub-millisecond response. Think it. Execute it.", color: "#AAFF00" },
    { icon: <Activity className="w-7 h-7" />, title: "Bio-Sync Protocol", desc: "Seamless handshake with your biological nervous system. Zero rejection rate.", color: "#00C8FF" },
    { icon: <Shield className="w-7 h-7" />, title: "Threat Detection AI", desc: "Predictive threat mapping that identifies danger 4 seconds before it manifests.", color: "#FF0080" },
    { icon: <Lock className="w-7 h-7" />, title: "Quantum Encryption", desc: "256-qubit cognitive stream encryption. Your thoughts, your data, your fortress.", color: "#AAFF00" },
    { icon: <Eye className="w-7 h-7" />, title: "Optical Enhancement", desc: "AR overlay with thermal imaging, night vision, and real-time object tagging.", color: "#00C8FF" },
    { icon: <Zap className="w-7 h-7" />, title: "Kinetic Amplification", desc: "Micro-hydraulic exo-layer increases physical output by 400% per limb.", color: "#FF0080" },
  ];

  return (
    <section id="features" className="relative py-28 px-6" style={{ background: "linear-gradient(180deg, #050A14 0%, #080E1C 100%)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.3em] mb-4 px-4 py-2"
            style={{ border: "1px solid rgba(0,200,255,0.3)", color: "#00C8FF" }}
          >
            <Radio className="w-3 h-3 animate-pulse" /> UPGRADE CATALOG
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-heading font-black text-white uppercase"
            style={{ textShadow: "0 0 30px rgba(0,200,255,0.3)" }}
          >
            SYSTEM MODULES
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="relative p-6 group cursor-default"
              style={{
                background: "rgba(8,14,28,0.8)",
                border: "1px solid rgba(255,255,255,0.05)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-px transition-all duration-300"
                style={{ background: `linear-gradient(to right, transparent, ${f.color}, transparent)`, boxShadow: `0 0 10px ${f.color}` }} />
              <CornerBrackets size={14} color={`${f.color}60`} />

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(ellipse at top left, ${f.color}08 0%, transparent 60%)` }} />

              <div className="relative z-10">
                <div className="mb-5 w-12 h-12 flex items-center justify-center relative"
                  style={{ border: `1px solid ${f.color}40`, background: `${f.color}10`, color: f.color, boxShadow: `0 0 15px ${f.color}20` }}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-heading font-bold text-white mb-3 tracking-wide">{f.title}</h3>
                <p className="text-muted-foreground font-mono text-sm leading-relaxed">{f.desc}</p>
                <div className="mt-5 flex items-center gap-2 font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ color: f.color }}>
                  <span>LEARN MORE</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    { num: "01", title: "ASSESSMENT", desc: "Full biological scan and nervous system mapping using quantum resonance imaging.", color: "#AAFF00", icon: <Crosshair className="w-6 h-6" /> },
    { num: "02", title: "INTEGRATION", desc: "Surgical implementation of cybernetic nodes via nano-precision robotics.", color: "#00C8FF", icon: <Cpu className="w-6 h-6" /> },
    { num: "03", title: "CALIBRATION", desc: "Neural syncing and firmware initialization. Full boot sequence in 72 hours.", color: "#FF0080", icon: <Zap className="w-6 h-6" /> },
  ];

  return (
    <section id="process" className="relative py-28 px-6" style={{ background: "rgba(5,10,20,0.95)", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-heading font-black text-white uppercase"
          >
            INSTALL PROTOCOL
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-16 left-[16.67%] right-[16.67%] h-px"
            style={{ background: "linear-gradient(to right, #AAFF00, #00C8FF, #FF0080)", opacity: 0.3 }} />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="flex flex-col items-center text-center relative"
            >
              <div className="relative mb-8">
                <div className="w-32 h-32 flex flex-col items-center justify-center relative"
                  style={{
                    border: `2px solid ${step.color}`,
                    background: `${step.color}08`,
                    boxShadow: `0 0 30px ${step.color}30, inset 0 0 20px ${step.color}10`,
                  }}>
                  <CornerBrackets size={10} color={step.color} />
                  <div style={{ color: step.color }}>{step.icon}</div>
                  <span className="font-heading text-3xl font-black mt-1" style={{ color: step.color, textShadow: `0 0 10px ${step.color}` }}>
                    {step.num}
                  </span>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{ border: `1px solid ${step.color}30` }}
                />
              </div>
              <h3 className="text-xl font-heading font-bold text-white mb-3 tracking-widest">{step.title}</h3>
              <p className="text-muted-foreground font-mono text-sm leading-relaxed max-w-xs">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const testimonials = [
    { initials: "K.V.", role: "Recon Specialist", unit: "UNIT-7734", color: "#AAFF00", text: "The optical enhancements changed everything. I see data before I see the physical object. The latency is practically negative." },
    { initials: "J.D.", role: "Heavy Assault", unit: "UNIT-2291", color: "#00C8FF", text: "Kinetic amplification makes heavy ordnance feel like a sidearm. Integration was flawless. Nexus delivered on every claim." },
    { initials: "A.R.", role: "Intelligence Operative", unit: "UNIT-5580", color: "#FF0080", text: "Quantum encryption means my cognitive streams are fully secured. I operate in denied areas with zero signal vulnerability." },
  ];

  return (
    <section id="operatives" className="relative py-28 px-6" style={{ background: "linear-gradient(180deg, #080E1C 0%, #050A14 100%)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-heading font-black text-white uppercase"
          >
            ACTIVE OPERATIVES
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative p-7 group"
              style={{
                background: "rgba(8,14,28,0.7)",
                border: "1px solid rgba(255,255,255,0.05)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div className="absolute top-0 left-6 right-6 h-px" style={{ background: `linear-gradient(to right, transparent, ${t.color}80, transparent)` }} />
              <div className="absolute top-4 right-4 opacity-10">
                <Fingerprint className="w-20 h-20" style={{ color: t.color }} />
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 flex items-center justify-center font-heading font-bold text-sm relative"
                  style={{ border: `1px solid ${t.color}60`, background: `${t.color}15`, color: t.color, boxShadow: `0 0 12px ${t.color}30` }}>
                  {t.initials}
                </div>
                <div>
                  <div className="text-white font-mono text-sm tracking-widest">{t.role}</div>
                  <div className="font-mono text-xs" style={{ color: t.color }}>{t.unit}</div>
                </div>
              </div>
              <p className="text-muted-foreground font-mono text-sm leading-relaxed italic">
                "{t.text}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTA = () => {
  const [hover, setHover] = useState(false);
  return (
    <section id="contact" className="relative py-32 px-6 overflow-hidden"
      style={{ background: "radial-gradient(ellipse at center, #0A1628 0%, #050A14 70%)" }}>
      <div className="absolute inset-0 circuit-grid opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(170,255,0,0.06) 0%, rgba(0,200,255,0.04) 50%, transparent 70%)" }} />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative p-12 md:p-20 text-center"
          style={{
            background: "rgba(8,14,28,0.8)",
            border: "1px solid rgba(170,255,0,0.2)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 0 60px rgba(170,255,0,0.08), inset 0 0 40px rgba(170,255,0,0.03)",
          }}
        >
          <CornerBrackets size={24} color="#AAFF00" animated />

          <div className="flex justify-center mb-8">
            <div className="relative">
              <TerminalSquare className="w-14 h-14 text-primary" style={{ filter: "drop-shadow(0 0 16px #AAFF00)" }} />
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full"
                style={{ border: "1px solid #AAFF00" }}
              />
            </div>
          </div>

          <h2 className="text-4xl md:text-6xl font-heading font-black text-white mb-6 uppercase"
            style={{ textShadow: "0 0 40px rgba(170,255,0,0.3)" }}>
            READY FOR UPGRADE?
          </h2>
          <p className="text-lg text-muted-foreground font-mono mb-10 max-w-xl mx-auto leading-relaxed">
            Slots for the V9.4 beta program are critically limited.<br />
            Secure your place in the future before the window closes.
          </p>

          <button
            data-testid="button-cta"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className="px-14 py-5 font-heading font-black text-base tracking-widest uppercase text-background transition-all duration-300"
            style={{
              background: hover
                ? "linear-gradient(135deg, #00C8FF, #AAFF00)"
                : "linear-gradient(135deg, #AAFF00, #00C8FF)",
              boxShadow: hover
                ? "0 0 50px rgba(0,200,255,0.7), 0 0 100px rgba(170,255,0,0.4)"
                : "0 0 30px rgba(170,255,0,0.5), 0 0 60px rgba(0,200,255,0.3)",
              transform: hover ? "scale(1.05)" : "scale(1)",
            }}
          >
            INITIATE SEQUENCE
          </button>

          <p className="mt-6 font-mono text-xs text-muted-foreground tracking-widest">
            NO COMMITMENT &nbsp;/&nbsp; FULL EVALUATION &nbsp;/&nbsp; 30-DAY INTEGRATION
          </p>
        </motion.div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="relative py-12 px-6" style={{ background: "#050A14", borderTop: "1px solid rgba(0,200,255,0.12)" }}>
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="flex items-center gap-2.5">
        <Cpu className="w-5 h-5 text-primary" style={{ filter: "drop-shadow(0 0 6px #AAFF00)" }} />
        <span className="font-heading font-black text-xl tracking-widest text-white">
          NEXUS<span className="text-primary" style={{ textShadow: "0 0 10px #AAFF00" }}>CYBORG</span>
        </span>
      </div>

      <div className="flex flex-wrap justify-center gap-6 font-mono text-xs text-muted-foreground">
        {["#features/MODULES", "#process/PROTOCOL", "#operatives/OPERATIVES", "#contact/CONTACT"].map(item => {
          const [href, label] = item.split("/");
          return (
            <a key={href} href={href} className="hover:text-primary transition-colors tracking-widest">{label}</a>
          );
        })}
      </div>

      <div className="font-mono text-xs tracking-widest" style={{ color: "rgba(0,200,255,0.4)" }}>
        &copy; 2084 NEXUS CYBERNETICS CORP.
      </div>
    </div>
  </footer>
);

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="bg-background text-foreground min-h-screen selection:bg-primary selection:text-background font-mono overflow-x-hidden">
      <LiveTicker />
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}
