import React, { useEffect, useRef, useState } from "react";
import {
  SiCplusplus,
  SiPython,
  SiGit,
  SiLinux,
  SiGithub,
} from "react-icons/si";
import { VscCode } from "react-icons/vsc";

const PLANETS = [
  {
    name: "C++",
    role: "Core Systems & Memory",
    icon: SiCplusplus,
    color: "#38bdf8",
    glow: "rgba(56, 189, 248, 0.6)",
    border: "border-sky-400/60",
    badge: "bg-sky-500/20 text-sky-300",
  },
  {
    name: "Python",
    role: "Logic, Math & Algorithms",
    icon: SiPython,
    color: "#facc15",
    glow: "rgba(250, 204, 21, 0.6)",
    border: "border-yellow-400/60",
    badge: "bg-yellow-500/20 text-yellow-300",
  },
  {
    name: "Linux",
    role: "Kernel & Development OS",
    icon: SiLinux,
    color: "#fde047",
    glow: "rgba(253, 224, 71, 0.5)",
    border: "border-amber-300/50",
    badge: "bg-amber-500/20 text-amber-300",
  },
  {
    name: "Git",
    role: "Version Control Engine",
    icon: SiGit,
    color: "#f97316",
    glow: "rgba(249, 115, 22, 0.6)",
    border: "border-orange-500/60",
    badge: "bg-orange-500/20 text-orange-300",
  },
  {
    name: "VS Code",
    role: "Primary Workbench",
    icon: VscCode,
    color: "#06b6d4",
    glow: "rgba(6, 182, 212, 0.6)",
    border: "border-cyan-400/60",
    badge: "bg-cyan-500/20 text-cyan-300",
  },
  {
    name: "GitHub",
    role: "Open Source Ecosystem",
    icon: SiGithub,
    color: "#a5f3fc",
    glow: "rgba(165, 243, 252, 0.6)",
    border: "border-cyan-300/50",
    badge: "bg-cyan-400/20 text-cyan-200",
  },
];

const OrbitIcons = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [dimensions, setDimensions] = useState({
    rx: 185,
    ry: 88,
  });

  const planetRefs = useRef([]);
  const angleRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const animFrameRef = useRef(null);

  // Responsive radii based on viewport
  useEffect(() => {
    const updateDimensions = () => {
      const isMobile = window.innerWidth < 640;
      setDimensions({
        rx: isMobile ? 135 : 185,
        ry: isMobile ? 65 : 88,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // 60-120fps direct DOM animation loop for buttery orbital physics
  useEffect(() => {
    const tiltRad = (-10 * Math.PI) / 180; // -10deg tilt
    const cosTilt = Math.cos(tiltRad);
    const sinTilt = Math.sin(tiltRad);

    const orbitDuration = 22; // Seconds for full 360 deg revolution
    const baseSpeed = (2 * Math.PI) / orbitDuration;

    const animate = (now) => {
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      // Speed modulation on hover
      const speedMultiplier = isPaused ? 0.2 : 1.0;
      angleRef.current = (angleRef.current + baseSpeed * speedMultiplier * dt) % (2 * Math.PI);

      const { rx, ry } = dimensions;
      const count = PLANETS.length;

      PLANETS.forEach((_, idx) => {
        const el = planetRefs.current[idx];
        if (!el) return;

        // Angle for this planet
        const planetAngle = angleRef.current + (idx * 2 * Math.PI) / count;

        // Elliptical coordinates before tilt
        const x0 = rx * Math.cos(planetAngle);
        const y0 = ry * Math.sin(planetAngle);

        // Apply 3D perspective tilt
        const x = x0 * cosTilt - y0 * sinTilt;
        const y = x0 * sinTilt + y0 * cosTilt;

        // Depth: sin(planetAngle)
        // > 0 means coming towards viewer (in front of Sun)
        // < 0 means moving away (behind Sun)
        const depth = Math.sin(planetAngle);

        let zIndex = 20;
        let scale = 1.0;
        let opacity = 1.0;
        let brightness = 1.0;

        if (depth >= 0) {
          // Front hemisphere: pass in front of Sun disc (z-30)
          zIndex = 30;
          scale = 0.98 + 0.16 * depth; // 0.98 to 1.14
          opacity = 0.92 + 0.08 * depth;
          brightness = 1.0 + 0.08 * depth;
        } else {
          // Back hemisphere: pass behind Sun disc (z-10)
          zIndex = 10;
          scale = 0.80 + 0.18 * (depth + 1); // 0.80 to 0.98
          opacity = 0.45 + 0.45 * (depth + 1); // 0.45 to 0.90
          brightness = 0.65 + 0.35 * (depth + 1);
        }

        // Billboarding: translate to orbital coordinates, scale for depth,
        // while the child icon stays 100% upright and faces the viewer directly
        el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale.toFixed(3)})`;
        el.style.zIndex = zIndex;
        el.style.opacity = opacity.toFixed(3);
        el.style.filter = `brightness(${brightness.toFixed(2)})`;
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [dimensions, isPaused]);

  return (
    <div
      className="relative w-[340px] h-[340px] sm:w-[440px] sm:h-[440px] flex items-center justify-center select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 1. Orbit Path SVG (Matching the -10deg tilted ellipse with radar ticks) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        style={{
          transform: "rotate(-10deg)",
          transformOrigin: "center center",
        }}
      >
        <defs>
          <linearGradient id="orbitLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.5" />
            <stop offset="40%" stopColor="#06b6d4" stopOpacity="0.7" />
            <stop offset="70%" stopColor="#facc15" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <ellipse
          cx="50%"
          cy="50%"
          rx={dimensions.rx}
          ry={dimensions.ry}
          fill="none"
          stroke="url(#orbitLineGrad)"
          strokeWidth="1.5"
          strokeDasharray="6 8"
          opacity="0.6"
        />
        {/* Subtle Outer Trajectory Track */}
        <ellipse
          cx="50%"
          cy="50%"
          rx={dimensions.rx + 16}
          ry={dimensions.ry + 8}
          fill="none"
          stroke="rgba(6, 182, 212, 0.15)"
          strokeWidth="1"
          strokeDasharray="3 9"
        />
      </svg>

      {/* 2. Central "H" Singularity Core (z-20) - Elevated Highest Level (No text labels) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center pointer-events-auto group">
        {/* Deep Volumetric Atmospheric Corona Glow */}
        <div className="absolute w-52 h-52 sm:w-64 sm:h-64 rounded-full bg-gradient-to-r from-amber-500/25 via-cyan-500/25 to-blue-500/20 blur-3xl animate-pulse pointer-events-none" />

        {/* Outer Orbiting Compass Radar Rings */}
        <div className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full border border-amber-400/30 border-dashed animate-spin-slow pointer-events-none" />
        <div
          className="absolute w-32 h-32 sm:w-36 sm:h-36 rounded-full border border-cyan-400/25 pointer-events-none"
          style={{ animation: "spin 16s linear infinite reverse" }}
        />

        {/* Master Core Orb (Deep Obsidian Cosmic Glass with Inset Bloom) */}
        <div className="w-22 h-22 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[#0c1427]/95 via-[#080d1a]/98 to-[#02050e]/95 border-2 border-cyan-400/50 shadow-[0_0_45px_rgba(6,182,212,0.4),inset_0_0_25px_rgba(250,204,21,0.2)] backdrop-blur-2xl flex items-center justify-center relative transition-transform duration-300 group-hover:scale-108 cursor-pointer ring-1 ring-amber-400/30">
          {/* Inner Glowing Reticle */}
          <div className="absolute inset-2 rounded-full border border-cyan-400/20 pointer-events-none" />

          {/* Pure Laser-Cut Metallic "H" Monogram (Clean, Bold, Zero Text Labels) */}
          <span className="text-4xl sm:text-5xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-200 to-amber-300 drop-shadow-[0_0_20px_rgba(56,189,248,0.85)] select-none">
            H
          </span>
        </div>
      </div>

      {/* 3. Orbiting Planetary Nodes (Direct DOM 3D Billboarding - Highest Level Modules) */}
      {PLANETS.map((planet, idx) => {
        const IconComponent = planet.icon;
        const isHovered = hoveredIndex === idx;

        return (
          <div
            key={planet.name}
            ref={(el) => (planetRefs.current[idx] = el)}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform cursor-pointer"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="relative group flex flex-col items-center">
              {/* Planetary Orbital Capsule */}
              <div
                className={`w-13 h-13 sm:w-15 sm:h-15 p-3 rounded-2xl flex items-center justify-center bg-[#090d1f]/90 backdrop-blur-xl border ${planet.border} shadow-xl transition-all duration-300 group-hover:scale-115 group-hover:bg-[#0c142b]`}
                style={{
                  boxShadow: isHovered
                    ? `0 0 28px ${planet.glow}, inset 0 0 12px ${planet.glow}`
                    : `0 0 16px ${planet.glow}`,
                }}
              >
                {/* Tech Icon */}
                <IconComponent
                  className="text-2xl sm:text-3xl transition-transform duration-200 group-hover:rotate-6 group-hover:scale-105"
                  style={{ color: planet.color }}
                />

                {/* Micro Status Beacon Pip */}
                <span
                  className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: planet.color, boxShadow: `0 0 6px ${planet.color}` }}
                />
              </div>

              {/* Informative HUD Tooltip on Hover */}
              <div
                className={`absolute -bottom-10 px-3 py-1 rounded-lg bg-slate-950/95 border border-cyan-500/30 text-center whitespace-nowrap pointer-events-none transition-all duration-200 shadow-2xl backdrop-blur-md ${
                  isHovered
                    ? "opacity-100 scale-100 -translate-y-0.5"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
                style={{ zIndex: 50 }}
              >
                <div className="text-[11px] font-bold text-white tracking-wide flex items-center gap-1.5 justify-center">
                  <span>{planet.name}</span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${planet.badge}`}>Active</span>
                </div>
                <div className="text-[9px] text-gray-300 font-mono mt-0.5">
                  {planet.role}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrbitIcons;
