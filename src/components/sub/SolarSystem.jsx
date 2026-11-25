import React, { useEffect, useRef, useState, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playWarpSound, playCyberBlip } from "@/utils/audio";
import { useDeviceCapabilities } from "@/utils/deviceCapabilities";
import { initCppEngine, getCppEngineSync } from "@/utils/cppEngine";

// Defer heavy Three.js cores so initial hero text & CTA paint immediately
const HoloCore3D = lazy(() => import("./HoloCore3D"));
const RealTimeEarthCore = lazy(() => import("./RealTimeEarthCore"));

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

const SolarSystem = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isCoreHovered, setIsCoreHovered] = useState(false);
  const [isEarthActive, setIsEarthActive] = useState(false);

  // Refs avoid tearing down the RAF loop when hovering planets or dragging Earth
  const isPausedRef = useRef(false);
  const hoveredIndexRef = useRef(null);
  const pointerDownPosRef = useRef(null);

  useEffect(() => {
    hoveredIndexRef.current = hoveredIndex;
  }, [hoveredIndex]);

  useEffect(() => {
    const handleToggleEarth = (e) => {
      if (e.detail && typeof e.detail.active === "boolean") {
        setIsEarthActive(e.detail.active);
      } else {
        setIsEarthActive((prev) => !prev);
      }
    };
    window.addEventListener("toggle-earth-core", handleToggleEarth);
    return () => {
      window.removeEventListener("toggle-earth-core", handleToggleEarth);
    };
  }, []);

  const toggleCore = () => {
    setIsEarthActive((prev) => {
      const next = !prev;
      if (next) {
        playWarpSound();
      } else {
        playCyberBlip(540, 0.04);
      }
      return next;
    });
  };

  // Distinguish intentional click/tap (< 6px move) from OrbitControls drag on the 3D globe
  const handleCorePointerDown = (e) => {
    pointerDownPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleCorePointerUp = (e) => {
    if (!pointerDownPosRef.current) return;
    const dx = e.clientX - pointerDownPosRef.current.x;
    const dy = e.clientY - pointerDownPosRef.current.y;
    pointerDownPosRef.current = null;
    if (dx * dx + dy * dy < 36) {
      toggleCore();
    }
  };

  const { prefersReducedMotion, isCoarsePointer } = useDeviceCapabilities();
  const [dimensions, setDimensions] = useState(() => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1024;
    if (w < 380) return { rx: 108, ry: 48 };
    if (w < 640) return { rx: 125, ry: 56 };
    return { rx: 175, ry: 78 };
  });

  const containerRef = useRef(null);
  const isVisibleRef = useRef(true);
  const planetRefs = useRef([]);
  const angleRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const animFrameRef = useRef(null);
  const wasmRef = useRef(getCppEngineSync());

  useEffect(() => {
    let active = true;
    initCppEngine().then((wasm) => {
      if (active && wasm) wasmRef.current = wasm;
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const updateDimensions = () => {
      const w = window.innerWidth;
      if (w < 380) setDimensions({ rx: 108, ry: 48 });
      else if (w < 640) setDimensions({ rx: 125, ry: 56 });
      else setDimensions({ rx: 175, ry: 78 });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions, { passive: true });
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // 60-120fps direct DOM orbital loop (honors prefers-reduced-motion)
  useEffect(() => {
    const tiltRad = (-10 * Math.PI) / 180;
    const cosTilt = Math.cos(tiltRad);
    const sinTilt = Math.sin(tiltRad);
    const orbitDuration = 22;
    const baseSpeed = (2 * Math.PI) / orbitDuration;

    const positionPlanets = () => {
      const { rx, ry } = dimensions;
      const count = PLANETS.length;
      const wasm = wasmRef.current;

      if (wasm) {
        const hovered = hoveredIndexRef.current ?? -1;
        wasm.exports.compute_planet_orbits(angleRef.current, rx, ry, count, hovered);
        const out = wasm.orbitOut;
        for (let idx = 0; idx < count; idx++) {
          const el = planetRefs.current[idx];
          if (!el) continue;
          const base = idx * 5;
          el.style.transform = `translate3d(${out[base].toFixed(2)}px, ${out[base + 1].toFixed(2)}px, 0) scale(${out[base + 3].toFixed(3)})`;
          el.style.zIndex = Math.round(out[base + 2]);
          el.style.opacity = out[base + 4].toFixed(3);
        }
        return;
      }

      for (let idx = 0; idx < count; idx++) {
        const el = planetRefs.current[idx];
        if (!el) continue;

        const planetAngle = angleRef.current + (idx * 2 * Math.PI) / count;
        const x0 = rx * Math.cos(planetAngle);
        const y0 = ry * Math.sin(planetAngle);
        const x = x0 * cosTilt - y0 * sinTilt;
        const y = x0 * sinTilt + y0 * cosTilt;
        const depth = Math.sin(planetAngle);

        let zIndex = 20;
        let scale = 1.0;
        let opacity = 1.0;

        if (hoveredIndexRef.current === idx) {
          zIndex = 50;
          scale = 1.12;
          opacity = 1.0;
        } else if (depth > 0) {
          zIndex = 30;
          scale = 0.98 + 0.2 * depth;
          opacity = 0.9 + 0.1 * depth;
        } else {
          zIndex = 10;
          scale = 0.8 + 0.18 * (depth + 1);
          opacity = 0.45 + 0.45 * (depth + 1);
        }

        el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`;
        el.style.zIndex = zIndex;
        el.style.opacity = opacity.toFixed(3);
      }
    };

    if (prefersReducedMotion) {
      positionPlanets();
      return undefined;
    }

    const animate = (now) => {
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      const speedMultiplier = isPausedRef.current ? 0.2 : 1.0;
      angleRef.current = (angleRef.current + baseSpeed * speedMultiplier * dt) % (2 * Math.PI);

      positionPlanets();

      if (!isVisibleRef.current || document.hidden) {
        animFrameRef.current = null;
        return;
      }
      animFrameRef.current = requestAnimationFrame(animate);
    };

    lastTimeRef.current = performance.now();
    animFrameRef.current = requestAnimationFrame(animate);

    let observer = null;
    if (typeof IntersectionObserver !== "undefined" && containerRef.current) {
      observer = new IntersectionObserver(
        ([entry]) => {
          isVisibleRef.current = entry.isIntersecting;
          if (entry.isIntersecting && !document.hidden && !animFrameRef.current) {
            lastTimeRef.current = performance.now();
            animFrameRef.current = requestAnimationFrame(animate);
          }
        },
        { threshold: 0.05 }
      );
      observer.observe(containerRef.current);
    }

    const handleVisibility = () => {
      if (!document.hidden && isVisibleRef.current && !animFrameRef.current) {
        lastTimeRef.current = performance.now();
        animFrameRef.current = requestAnimationFrame(animate);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
      observer?.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [dimensions, prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="relative w-[min(310px,92vw)] h-[240px] sm:w-[410px] sm:h-[280px] flex items-center justify-center select-none"
      onMouseEnter={() => {
        if (!isCoarsePointer) isPausedRef.current = true;
      }}
      onMouseLeave={() => {
        isPausedRef.current = false;
      }}
    >
      {/* 1. Orbit Path SVG (-10deg tilted ellipse) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        style={{ transform: "rotate(-10deg)" }}
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

      {/* 2. Central Core (z-20) - Seamless In-Place Morph between "H" Sun and 3D Real-Time Earth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center pointer-events-auto">
        {/* Volumetric Atmospheric Corona Glow */}
        <div
          className={`absolute rounded-full blur-3xl transition-all duration-700 pointer-events-none ${
            isEarthActive
              ? "w-48 h-48 sm:w-56 sm:h-56 bg-gradient-to-r from-cyan-500/25 via-sky-500/20 to-blue-600/20"
              : "w-44 h-44 sm:w-56 sm:h-56 bg-gradient-to-r from-amber-500/25 via-cyan-500/25 to-blue-500/20 animate-pulse"
          }`}
        />

        {/* Outer Orbiting Compass Radar Rings */}
        <div className="absolute w-32 h-32 sm:w-36 sm:h-36 rounded-full border border-amber-400/25 border-dashed animate-spin-slow pointer-events-none" />
        <div
          className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full border border-cyan-400/20 pointer-events-none"
          style={{ animation: "spin 16s linear infinite reverse" }}
        />

        {/* Morphing Core Container */}
        <div
          onPointerDown={handleCorePointerDown}
          onPointerUp={handleCorePointerUp}
          onMouseEnter={() => setIsCoreHovered(true)}
          onMouseLeave={() => setIsCoreHovered(false)}
          className={`relative rounded-full flex items-center justify-center transition-all duration-500 cursor-pointer overflow-visible ${
            isEarthActive
              ? "w-28 h-28 sm:w-32 sm:h-32"
              : "w-[88px] h-[88px] sm:w-[104px] sm:h-[104px] bg-gradient-to-br from-[#0c1427]/85 via-[#080d1a]/90 to-[#02050e]/85 border-2 border-cyan-400/50 shadow-[0_0_40px_rgba(6,182,212,0.4),inset_0_0_25px_rgba(250,204,21,0.2)] ring-1 ring-amber-400/30 hover:scale-105 backdrop-blur-2xl"
          }`}
        >
          <AnimatePresence mode="wait">
            {!isEarthActive ? (
              <motion.div
                key="h-sun"
                initial={{ opacity: 0, scale: 0.82 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.82 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-full h-full flex items-center justify-center relative"
              >
                <div className="absolute inset-[-14px] pointer-events-none z-10">
                  <Suspense fallback={null}>
                    <HoloCore3D isHovered={isCoreHovered} />
                  </Suspense>
                </div>

                <div className="absolute inset-2 rounded-full border border-cyan-400/20 pointer-events-none z-0" />

                <span className="relative z-20 text-3xl sm:text-4xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-200 to-amber-300 drop-shadow-[0_0_20px_rgba(56,189,248,0.85)] select-none pointer-events-none">
                  H
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="earth-globe"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="w-full h-full relative flex items-center justify-center"
              >
                <Suspense
                  fallback={
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="w-5 h-5 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                    </div>
                  }
                >
                  <RealTimeEarthCore isHovered={isCoreHovered} />
                </Suspense>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 3. Orbiting Planetary Nodes */}
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
            onClick={() => {
              if (isCoarsePointer) {
                setHoveredIndex((prev) => (prev === idx ? null : idx));
              }
            }}
          >
            <div className="relative group flex flex-col items-center">
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 p-2.5 rounded-2xl flex items-center justify-center bg-[#090d1f]/90 backdrop-blur-xl border shadow-xl transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#0c142b]"
                style={{
                  borderColor: undefined,
                  boxShadow: isHovered
                    ? `0 0 28px ${planet.glow}, inset 0 0 12px ${planet.glow}`
                    : `0 0 16px ${planet.glow}`,
                }}
              >
                <div className={`absolute inset-0 rounded-2xl border ${planet.border} pointer-events-none`} />
                <IconComponent
                  className="text-2xl sm:text-3xl transition-transform duration-200 group-hover:rotate-6 group-hover:scale-105"
                  style={{ color: planet.color }}
                />

                <span
                  className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: planet.color, boxShadow: `0 0 6px ${planet.color}` }}
                />
              </div>

              {/* Informative HUD Tooltip on Hover */}
              <div
                className={`absolute -bottom-11 px-3 py-1 rounded-lg bg-slate-950/95 border border-cyan-500/30 text-center whitespace-nowrap pointer-events-none transition-all duration-200 shadow-2xl backdrop-blur-md ${
                  isHovered
                    ? "opacity-100 scale-100 -translate-y-0.5"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
                style={{ zIndex: 60 }}
              >
                <div className="text-[11px] font-bold text-white tracking-wide flex items-center gap-1.5 justify-center">
                  <span>{planet.name}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${planet.badge}`}>Active</span>
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

export default SolarSystem;
