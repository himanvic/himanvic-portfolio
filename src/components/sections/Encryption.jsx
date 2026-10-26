// File Name: Encryption.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { slideInFromTop } from "../../utils/motion";

const WORDS = [
  {
    name: "Himanvic",
    subtitle: "Identity & Creator",
    description: "Student developer passionate about learning, building, and exploring systems.",
    colors: ["#c084fc", "#a855f7", "#818cf8", "#38bdf8", "#ffffff"],
    primary: "#c084fc",
    glow: "rgba(192, 132, 252, 0.45)",
  },
  {
    name: "C++",
    subtitle: "Core Language",
    description: "Systems programming, algorithms, low-level mechanics, and performance fundamentals.",
    colors: ["#3b82f6", "#60a5fa", "#38bdf8", "#93c5fd", "#ffffff"],
    primary: "#3b82f6",
    glow: "rgba(59, 130, 246, 0.45)",
  },
  {
    name: "Python",
    subtitle: "Core Language",
    description: "Rapid prototyping, algorithmic experiments, simulation logic, and developer tooling.",
    colors: ["#facc15", "#f59e0b", "#38bdf8", "#fbbf24", "#ffffff"],
    primary: "#facc15",
    glow: "rgba(250, 204, 21, 0.45)",
  },
  {
    name: "Dynamics",
    subtitle: "Computational Physics & Motion",
    description: "Where algorithms, system mechanics, and real-time interactive simulation meet.",
    colors: ["#ec4899", "#c084fc", "#a855f7", "#38bdf8", "#ffffff"],
    primary: "#ec4899",
    glow: "rgba(236, 72, 153, 0.45)",
  },
  {
    name: "Curiosity",
    subtitle: "Core Philosophy",
    description: "Driven by asking 'how does it work under the hood?' and building to find out.",
    colors: ["#ff9933", "#38bdf8", "#10b981", "#c084fc", "#ffffff"],
    primary: "#ff9933",
    glow: "rgba(255, 153, 51, 0.45)",
  },
];

const PARTICLE_COUNT = 1800;

const QuantumParticleCanvas = ({ activeIndex, onWordChange }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const particlesRef = useRef([]);
  const ripplesRef = useRef([]);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const animFrameRef = useRef(null);
  const lastSwitchTimeRef = useRef(performance.now());
  const activeIndexRef = useRef(activeIndex);

  // Keep activeIndexRef synced
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  // Compute text target points using offscreen canvas sampling
  const getWordTargets = useCallback((text, width, height) => {
    if (!width || !height) return [];
    const off = document.createElement("canvas");
    off.width = width;
    off.height = height;
    const g = off.getContext("2d", { willReadFrequently: true });
    if (!g) return [];

    g.fillStyle = "#ffffff";
    g.textAlign = "center";
    g.textBaseline = "middle";

    const charCount = text.length;
    let fontSize = Math.min(130, Math.floor(width / (charCount * 0.58)));
    if (text === "C++") fontSize = Math.min(160, Math.floor(width * 0.36));
    if (text === "Python") fontSize = Math.min(135, Math.floor(width * 0.28));
    if (text === "Dynamics") fontSize = Math.min(120, Math.floor(width * 0.19));
    if (text === "Curiosity") fontSize = Math.min(110, Math.floor(width * 0.17));
    if (fontSize < 36) fontSize = 36;

    g.font = `900 ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    g.fillText(text, width / 2, height / 2);

    const imgData = g.getImageData(0, 0, width, height).data;
    const targets = [];
    const step = width < 600 ? 3 : 4;

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        if (imgData[(y * width + x) * 4 + 3] > 120) {
          targets.push([x, y]);
        }
      }
    }

    // Fallback if no targets found
    if (targets.length === 0) {
      for (let i = 0; i < 500; i++) {
        const theta = (i / 500) * Math.PI * 2;
        const radius = Math.min(width, height) * 0.3;
        targets.push([width / 2 + Math.cos(theta) * radius, height / 2 + Math.sin(theta) * radius]);
      }
    }

    return targets;
  }, []);

  // Morph particles to target word with energetic supernova dispersal
  const applyWordMorph = useCallback((idx, burstIntensity = 1.0) => {
    const wordObj = WORDS[idx];
    if (!wordObj || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    if (width === 0 || height === 0) return;

    const targets = getWordTargets(wordObj.text || wordObj.name, width, height);
    if (!targets.length) return;

    const palette = wordObj.colors;
    const particles = particlesRef.current;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const target = targets[i % targets.length];
      p.tx = target[0];
      p.ty = target[1];
      p.color = palette[Math.floor(Math.random() * palette.length)];

      // Supernova radial burst outward
      const angle = Math.random() * Math.PI * 2;
      const force = (Math.random() * 16 + 6) * burstIntensity;
      p.vx += Math.cos(angle) * force;
      p.vy += Math.sin(angle) * force;
    }
  }, [getWordTargets]);

  // Singularity shockwave on click / tap
  const triggerShockwave = useCallback((cx, cy) => {
    const currentWord = WORDS[activeIndexRef.current] || WORDS[0];
    ripplesRef.current.push({
      x: cx,
      y: cy,
      radius: 12,
      maxRadius: 240,
      color: currentWord.primary,
      alpha: 0.95,
    });

    const particles = particlesRef.current;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const dx = p.x - cx;
      const dy = p.y - cy;
      const dist = Math.hypot(dx, dy);

      if (dist < 260 && dist > 0) {
        const push = (1 - dist / 260) * 32;
        const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.3;
        p.vx += Math.cos(angle) * push;
        p.vy += Math.sin(angle) * push;
      }
    }
    lastSwitchTimeRef.current = performance.now(); // Reset cycle timer on user interaction
  }, []);

  // Initialize and run the simulation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const updateSize = () => {
      if (!canvas.parentElement) return;
      const width = canvas.parentElement.offsetWidth;
      const height = Math.min(420, Math.max(300, Math.floor(window.innerHeight * 0.42)));

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Re-morph to current word with adjusted coordinates
      applyWordMorph(activeIndexRef.current, 0.3);
    };

    // Initialize particles array if empty
    if (particlesRef.current.length === 0) {
      const initialTargets = getWordTargets(WORDS[0].name, 800, 380);
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const t = initialTargets[i % initialTargets.length] || [400, 190];
        particlesRef.current.push({
          x: t[0] + (Math.random() - 0.5) * 100,
          y: t[1] + (Math.random() - 0.5) * 100,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          tx: t[0],
          ty: t[1],
          color: WORDS[0].colors[i % WORDS[0].colors.length],
          size: Math.random() * 1.5 + 1.2,
          seed: Math.random() * 1000,
        });
      }
    }

    updateSize();

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Animation render loop
    const render = (time) => {
      const rect = canvas.getBoundingClientRect();
      const W = rect.width;
      const H = rect.height;

      // Auto-switch words every 3.8s
      if (time - lastSwitchTimeRef.current > 3800) {
        lastSwitchTimeRef.current = time;
        const nextIndex = (activeIndexRef.current + 1) % WORDS.length;
        onWordChange(nextIndex);
      }

      // Trail fade background
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(9, 11, 28, 0.28)";
      ctx.fillRect(0, 0, W, H);

      // Render expanding ripples from shockwave clicks
      const ripples = ripplesRef.current;
      for (let rIdx = ripples.length - 1; rIdx >= 0; rIdx--) {
        const rip = ripples[rIdx];
        rip.radius += 8;
        rip.alpha *= 0.92;

        if (rip.alpha < 0.02 || rip.radius > rip.maxRadius) {
          ripples.splice(rIdx, 1);
          continue;
        }

        ctx.save();
        ctx.strokeStyle = rip.color;
        ctx.globalAlpha = rip.alpha;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = rip.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Lighter blend mode for bright energetic quantum glow
      ctx.globalCompositeOperation = "lighter";
      const tSec = time * 0.001;
      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Quantum zero-point energy breathing
        const jitterX = Math.sin(tSec * 2.5 + p.seed) * 0.65;
        const jitterY = Math.cos(tSec * 2.2 + p.seed * 1.3) * 0.65;

        // Damped spring physics towards target position
        const dx = p.tx + jitterX - p.x;
        const dy = p.ty + jitterY - p.y;
        p.vx = (p.vx + dx * 0.055) * 0.84;
        p.vy = (p.vy + dy * 0.055) * 0.84;

        // Interactive cursor repulsion field
        if (mouse.active) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const dist = Math.hypot(mdx, mdy);
          if (dist < 110 && dist > 0) {
            const push = (1 - dist / 110) * 16;
            p.vx += (mdx / dist) * push;
            p.vy += (mdy / dist) * push;
          }
        }

        // Apply velocity
        p.x += p.vx;
        p.y += p.vy;

        // Draw particle
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      resizeObserver.disconnect();
    };
  }, [applyWordMorph, getWordTargets, onWordChange]);

  // When activeIndex changes from outside (e.g. pill click), trigger morph
  useEffect(() => {
    lastSwitchTimeRef.current = performance.now();
    applyWordMorph(activeIndex, 1.15);
  }, [activeIndex, applyWordMorph]);

  // Event handlers for mouse and touch
  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
  };

  const handleMouseLeave = () => {
    mouseRef.current.active = false;
  };

  const handleTouchMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas || !e.touches.length) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top,
      active: true,
    };
  };

  const handleTouchEnd = () => {
    mouseRef.current.active = false;
  };

  const handleClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    triggerShockwave(cx, cy);
  };

  const handleTouchStart = (e) => {
    const canvas = canvasRef.current;
    if (!canvas || !e.touches.length) return;
    const rect = canvas.getBoundingClientRect();
    const cx = e.touches[0].clientX - rect.left;
    const cy = e.touches[0].clientY - rect.top;
    triggerShockwave(cx, cy);
  };

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        className="w-full block cursor-crosshair touch-none"
      />
    </div>
  );
};

const Encryption = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeWord = WORDS[activeIndex] || WORDS[0];

  return (
    <section
      id="profile"
      className="flex flex-col items-center justify-center relative min-h-screen w-full py-20 px-4 sm:px-6 lg:px-8 z-10 overflow-hidden"
    >
      {/* Anchor for backward compatibility */}
      <div id="encryption" className="absolute -top-20" />

      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-purple-700/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Top Header & Badge */}
      <div className="flex flex-col items-center text-center z-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full bg-purple-900/40 border border-purple-500/40 text-purple-300 text-xs sm:text-sm font-mono tracking-wide backdrop-blur-md shadow-lg shadow-purple-950/40">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>Aspiring Software Developer</span>
        </div>

        <motion.h2
          variants={slideInFromTop}
          initial="hidden"
          animate="visible"
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-100 pb-1"
        >
          My Profile{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
            &amp;
          </span>{" "}
          Journey.
        </motion.h2>

        <p className="text-gray-300 text-sm sm:text-base md:text-lg mt-3 max-w-xl leading-relaxed">
          Building foundations today for a craft that will span decades.
        </p>
      </div>

      {/* Central Interactive Quantum Particle Morph Display */}
      <div className="relative w-full max-w-5xl mt-10 rounded-3xl bg-[#090b1c]/80 border border-purple-500/25 p-4 sm:p-7 backdrop-blur-xl shadow-[0_0_60px_rgba(147,51,234,0.18)] flex flex-col items-center overflow-hidden z-10">
        {/* Subtle holographic border flare */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent pointer-events-none" />

        {/* Top telemetry bar */}
        <div className="flex flex-wrap items-center justify-between w-full mb-2 px-2 text-xs font-mono text-purple-300/80 gap-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            <span className="text-gray-300 font-semibold">QUANTUM PARTICLE MORPH</span>
            <span className="hidden sm:inline text-purple-400/60">•</span>
            <span className="hidden sm:inline text-gray-400">1,800 Active Entities</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <span className="hidden sm:inline">Hover to disperse</span>
            <span className="hidden sm:inline text-purple-400/60">•</span>
            <span>Click for shockwave</span>
          </div>
        </div>

        {/* The Quantum Particle Morph Canvas */}
        <div className="w-full relative rounded-2xl overflow-hidden bg-[#050713] border border-purple-500/20 shadow-inner">
          <QuantumParticleCanvas
            activeIndex={activeIndex}
            onWordChange={setActiveIndex}
          />

          {/* Active word info overlay badge (bottom-left) */}
          <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono flex items-center gap-2 pointer-events-none">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: activeWord.primary }}
            />
            <span className="text-white font-medium">{activeWord.name}</span>
            <span className="text-gray-400 hidden sm:inline">— {activeWord.subtitle}</span>
          </div>
        </div>

        {/* Interactive Word Selector Pills */}
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mt-6 w-full">
          {WORDS.map((w, idx) => {
            const isActive = activeIndex === idx;
            return (
              <button
                key={w.name}
                onClick={() => setActiveIndex(idx)}
                className={`relative px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? "text-white bg-gradient-to-r from-purple-950 via-indigo-950 to-purple-950 border shadow-lg"
                    : "text-gray-400 hover:text-gray-200 bg-white/5 border border-white/10 hover:border-purple-500/40 hover:bg-white/10"
                }`}
                style={{
                  borderColor: isActive ? w.primary : undefined,
                  boxShadow: isActive ? `0 0 20px ${w.glow}` : undefined,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: w.primary,
                    boxShadow: isActive ? `0 0 10px ${w.primary}` : "none",
                    transform: isActive ? "scale(1.25)" : "scale(1)",
                  }}
                />
                <span className="tracking-wide">{w.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Word Narrative Description */}
        <div className="mt-4 text-center min-h-[44px] flex items-center justify-center px-4">
          <motion.p
            key={activeWord.name}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-gray-300 text-xs sm:text-sm max-w-2xl leading-relaxed"
          >
            {activeWord.description}
          </motion.p>
        </div>

        {/* Simulation Attribution Badge */}
        <div className="mt-4 pt-4 border-t border-purple-500/15 w-full flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-2 px-2">
          <div className="flex items-center gap-1.5">
            <span className="text-purple-300 font-semibold">Interactive Canvas:</span>
            <span className="text-cyan-400 font-mono">Real-Time Particle Simulation</span>
            <span className="text-gray-500 hidden sm:inline">(Euler Dynamics)</span>
          </div>
          <div className="text-gray-500 font-mono text-[11px]">
            Damped Euler Springs • Zero-Point Vibration • Shockwave Dynamics
          </div>
        </div>
      </div>
    </section>
  );
};

export default Encryption;
