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
    role: "Systems & Algorithms",
    icon: SiCplusplus,
    color: "#38bdf8",
    glow: "rgba(56, 189, 248, 0.5)",
    border: "border-sky-400/40",
  },
  {
    name: "Python",
    role: "Logic & Automation",
    icon: SiPython,
    color: "#facc15",
    glow: "rgba(250, 204, 21, 0.5)",
    border: "border-yellow-400/40",
  },
  {
    name: "Linux",
    role: "OS & Toolchain",
    icon: SiLinux,
    color: "#fde047",
    glow: "rgba(253, 224, 71, 0.45)",
    border: "border-amber-300/40",
  },
  {
    name: "Git",
    role: "Version Architecture",
    icon: SiGit,
    color: "#f97316",
    glow: "rgba(249, 115, 22, 0.5)",
    border: "border-orange-500/40",
  },
  {
    name: "VS Code",
    role: "Primary Workbench",
    icon: VscCode,
    color: "#06b6d4",
    glow: "rgba(6, 182, 212, 0.5)",
    border: "border-cyan-400/40",
  },
  {
    name: "GitHub",
    role: "Open Source Collab",
    icon: SiGithub,
    color: "#c084fc",
    glow: "rgba(192, 132, 252, 0.5)",
    border: "border-purple-400/40",
  },
];

const OrbitIcons = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [dimensions, setDimensions] = useState({
    rx: 180,
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
        rx: isMobile ? 130 : 180,
        ry: isMobile ? 62 : 88,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // 60-120fps direct DOM animation loop for buttery orbital physics
  useEffect(() => {
    const tiltRad = (-12 * Math.PI) / 180; // -12deg tilt
    const cosTilt = Math.cos(tiltRad);
    const sinTilt = Math.sin(tiltRad);

    const orbitDuration = 22; // Seconds for full 360 deg revolution
    const baseSpeed = (2 * Math.PI) / orbitDuration;

    const animate = (now) => {
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      // Speed modulation on hover
      const speedMultiplier = isPaused ? 0.15 : 1.0;
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
        // > 0 means coming towards the viewer (in front of Sun)
        // < 0 means moving away (behind Sun)
        const depth = Math.sin(planetAngle);

        let zIndex = 20;
        let scale = 1.0;
        let opacity = 1.0;
        let brightness = 1.0;

        if (depth >= 0) {
          // Front hemisphere: pass in front of Sun disc (z-30)
          zIndex = 30;
          scale = 0.98 + 0.14 * depth; // 0.98 to 1.12
          opacity = 0.9 + 0.1 * depth;
          brightness = 1.0 + 0.05 * depth;
        } else {
          // Back hemisphere: pass behind Sun disc (z-10)
          zIndex = 10;
          scale = 0.82 + 0.16 * (depth + 1); // 0.82 to 0.98
          opacity = 0.45 + 0.45 * (depth + 1); // 0.45 to 0.90
          brightness = 0.68 + 0.32 * (depth + 1);
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
      {/* 1. Orbit Path SVG (Matching the -12deg tilted ellipse) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        style={{
          transform: "rotate(-12deg)",
          transformOrigin: "center center",
        }}
      >
        <defs>
          <linearGradient id="orbitLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
            <stop offset="40%" stopColor="#a855f7" stopOpacity="0.5" />
            <stop offset="70%" stopColor="#eab308" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0.3" />
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
          opacity="0.55"
        />
      </svg>

      {/* 2. Central "H" Sun (z-20) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center pointer-events-auto group">
        {/* Outer Solar Corona Glow */}
        <div className="absolute w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-r from-amber-500/20 via-purple-600/20 to-cyan-500/20 blur-2xl animate-pulse pointer-events-none" />

        {/* Ambient Orbiting Solar Corona Rings */}
        <div className="absolute w-32 h-32 sm:w-36 sm:h-36 rounded-full border border-amber-400/25 border-dashed animate-spin-slow pointer-events-none" />
        <div
          className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full border border-purple-400/20 pointer-events-none"
          style={{ animation: "spin 18s linear infinite reverse" }}
        />

        {/* Sun Core Disc */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-amber-500/30 via-purple-900/50 to-slate-950/90 border border-amber-400/50 shadow-[0_0_35px_rgba(245,158,11,0.45)] backdrop-blur-xl flex flex-col items-center justify-center relative transition-transform duration-300 group-hover:scale-105 cursor-pointer">
          <div className="flex flex-col items-center justify-center">
            <span className="text-3xl sm:text-4xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-br from-amber-200 via-yellow-300 to-amber-500 drop-shadow-[0_0_16px_rgba(251,191,36,0.9)]">
              H
            </span>
            <span className="text-[8px] sm:text-[9px] tracking-widest font-mono uppercase text-amber-300/80 -mt-1 font-semibold">
              STAR
            </span>
          </div>

          {/* Tooltip on Sun Hover */}
          <div className="absolute -bottom-7 px-2.5 py-0.5 rounded-full bg-slate-950/95 border border-amber-400/30 text-[10px] font-mono text-amber-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
            Himanvic Core
          </div>
        </div>
      </div>

      {/* 3. Orbiting Planetary Nodes (Direct DOM 3D Billboarding) */}
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
              {/* Planetary Sphere (faces front upright at all times) */}
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center bg-slate-900/90 backdrop-blur-md border ${planet.border} shadow-lg transition-transform duration-200 group-hover:scale-115`}
                style={{
                  boxShadow: isHovered
                    ? `0 0 24px ${planet.glow}`
                    : `0 0 14px ${planet.glow}`,
                }}
              >
                <IconComponent
                  className="text-2xl sm:text-3xl transition-transform duration-200 group-hover:rotate-6"
                  style={{ color: planet.color }}
                />
              </div>

              {/* Informative Floating Tooltip on Hover */}
              <div
                className={`absolute -bottom-10 px-2.5 py-1 rounded-md bg-slate-950/95 border border-white/20 text-center whitespace-nowrap pointer-events-none transition-all duration-200 shadow-xl ${
                  isHovered
                    ? "opacity-100 scale-100 -translate-y-0.5"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
                style={{ zIndex: 50 }}
              >
                <div className="text-[11px] font-bold text-white tracking-wide">
                  {planet.name}
                </div>
                <div className="text-[9px] text-gray-400 font-mono">
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
