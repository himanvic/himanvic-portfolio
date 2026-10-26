// File Name: Projects.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PROJECTS } from "@/constants/PROJECT_DATA";
import { Link } from "react-router-dom";
import {
  FaChevronLeft,
  FaChevronRight,
  FaExternalLinkAlt,
  FaPlay,
  FaPause,
} from "react-icons/fa";

const Projects = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  const touchStartXRef = useRef(0);
  const total = PROJECTS.length;

  // Responsive width tracking
  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = viewportWidth < 640;
  const isTablet = viewportWidth >= 640 && viewportWidth < 1024;

  const nextProject = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevProject = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-revolve timer with hover pause
  useEffect(() => {
    if (!isAutoPlay || isHovered) return;
    const interval = setInterval(() => {
      nextProject();
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlay, isHovered, nextProject]);

  // Touch gesture support for mobile devices
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartXRef.current;
    if (diff > 45) {
      prevProject();
    } else if (diff < -45) {
      nextProject();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") prevProject();
      if (e.key === "ArrowRight") nextProject();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextProject, prevProject]);

  // Compute 3D orbital transform values for each card relative to activeIndex
  const getCardTransform = (index) => {
    let diff = index - activeIndex;
    if (diff === 2) diff = -1;
    if (diff === -2) diff = 1;

    // Center active card
    if (diff === 0) {
      return {
        x: 0,
        y: 0,
        z: 80,
        scale: isMobile ? 1.0 : 1.05,
        rotateY: 0,
        opacity: 1,
        zIndex: 30,
        isCenter: true,
      };
    }

    // Right card in orbit
    if (diff === 1) {
      const offsetX = isMobile ? 135 : isTablet ? 240 : 330;
      return {
        x: offsetX,
        y: 0,
        z: -90,
        scale: isMobile ? 0.78 : 0.86,
        rotateY: -28,
        opacity: isMobile ? 0.35 : 0.65,
        zIndex: 15,
        isCenter: false,
      };
    }

    // Left card in orbit (diff === -1)
    const offsetX = isMobile ? -135 : isTablet ? -240 : -330;
    return {
      x: offsetX,
      y: 0,
      z: -90,
      scale: isMobile ? 0.78 : 0.86,
      rotateY: 28,
      opacity: isMobile ? 0.35 : 0.65,
      zIndex: 15,
      isCenter: false,
    };
  };

  const handleCardClick = (index, link) => {
    if (index === activeIndex) {
      window.open(link, "_blank", "noopener,noreferrer");
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <section
      id="projects"
      className="w-full py-24 sm:py-32 flex flex-col items-center justify-center relative overflow-hidden text-white z-10"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-purple-700/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Header with badge */}
      <div className="text-center mb-8 px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-3 rounded-full bg-purple-900/40 border border-purple-500/30 text-purple-300 text-xs sm:text-sm font-medium tracking-wide backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>FEATURED CREATIONS</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 text-transparent bg-clip-text tracking-tight">
          My Projects
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm mt-2 max-w-md mx-auto">
          Revolving 3D orbit • Click cards to focus or launch
        </p>
      </div>

      {/* 3D Revolving Stage */}
      <div
        className="relative w-full max-w-6xl mx-auto flex items-center justify-center min-h-[540px] sm:min-h-[580px] px-4 select-none"
        style={{ perspective: "1200px" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Orbital Track Graphics (3D angled ellipse under the cards) */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] max-w-[94vw] h-[260px] rounded-[50%] border border-purple-500/20 pointer-events-none -z-10 shadow-[0_0_50px_rgba(168,85,247,0.12)]"
          style={{ transform: "translate(-50%, -50%) rotateX(68deg)" }}
        >
          {/* Animated dashed orbit ring */}
          <div className="absolute inset-0 rounded-[50%] border border-dashed border-cyan-400/25 animate-spin-slow" />
          {/* Orbit glowing nodes */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_#38bdf8]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 rounded-full bg-purple-400 shadow-[0_0_12px_#c084fc]" />
        </div>

        {/* The 3 Revolving Project Cards */}
        {PROJECTS.map((project, idx) => {
          const transform = getCardTransform(idx);
          const isCenter = transform.isCenter;

          return (
            <motion.div
              key={project.id}
              onClick={() => handleCardClick(idx, project.link)}
              animate={{
                x: transform.x,
                y: transform.y,
                z: transform.z,
                scale: transform.scale,
                rotateY: transform.rotateY,
                opacity: transform.opacity,
              }}
              transition={{
                type: "spring",
                stiffness: 240,
                damping: 26,
              }}
              style={{
                zIndex: transform.zIndex,
                transformStyle: "preserve-3d",
              }}
              className={`absolute w-[290px] sm:w-[350px] md:w-[380px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
                isCenter
                  ? "bg-[#111328]/95 border-2 border-purple-500/70 shadow-[0_0_45px_rgba(168,85,247,0.35)] ring-1 ring-cyan-400/30"
                  : "bg-[#0c0d1e]/85 border border-purple-500/20 shadow-xl hover:border-purple-500/50 hover:opacity-85"
              }`}
            >
              {/* Card Screenshot Header */}
              <div className="relative w-full h-44 sm:h-52 overflow-hidden bg-black/60">
                <img
                  src={project.image}
                  alt={project.name}
                  className={`w-full h-full object-cover object-top transition-transform duration-500 ${
                    isCenter ? "hover:scale-105" : ""
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111328] via-transparent to-black/30 pointer-events-none" />

                {/* Top Floating Badges */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-mono flex items-center gap-1.5 text-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Live App</span>
                </div>

                <div
                  className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-mono backdrop-blur-md border border-white/10 text-white"
                  style={{ backgroundColor: `${project.accent}25` }}
                >
                  {project.tag}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">
                      {project.name}
                    </h3>
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: project.accent }}
                    />
                  </div>

                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed line-clamp-3 mb-4">
                    {project.description}
                  </p>

                  {/* Tech stack pills */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.tech?.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-md bg-purple-950/50 border border-purple-500/20 text-[10px] sm:text-[11px] text-purple-200 font-mono"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action Button */}
                {isCenter ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-purple-900/40 transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <span>Launch Web App</span>
                    <FaExternalLinkAlt className="text-xs" />
                  </a>
                ) : (
                  <div className="w-full py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-xs text-center font-medium flex items-center justify-center gap-1.5 group-hover:text-purple-300 group-hover:border-purple-500/30 transition-colors">
                    <span>Click to Revolve</span>
                    <FaChevronRight className="text-[10px]" />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Floating Orbital Left / Right Nav Chevrons */}
        <button
          onClick={prevProject}
          aria-label="Previous project"
          className="absolute left-2 sm:left-4 z-40 w-11 h-11 rounded-full bg-black/60 border border-purple-500/30 text-white backdrop-blur-md flex items-center justify-center hover:bg-purple-900/40 hover:border-purple-400 hover:scale-110 transition-all shadow-lg shadow-purple-950/50 cursor-pointer"
        >
          <FaChevronLeft className="text-sm" />
        </button>

        <button
          onClick={nextProject}
          aria-label="Next project"
          className="absolute right-2 sm:right-4 z-40 w-11 h-11 rounded-full bg-black/60 border border-purple-500/30 text-white backdrop-blur-md flex items-center justify-center hover:bg-purple-900/40 hover:border-purple-400 hover:scale-110 transition-all shadow-lg shadow-purple-950/50 cursor-pointer"
        >
          <FaChevronRight className="text-sm" />
        </button>
      </div>

      {/* Orbital Pagination Dots & Auto-Play Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6 z-20">
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#111328]/80 border border-purple-500/25 backdrop-blur-md shadow-md">
          {PROJECTS.map((project, idx) => {
            const isActive = activeIndex === idx;
            return (
              <button
                key={project.id}
                onClick={() => setActiveIndex(idx)}
                aria-label={`Jump to ${project.name}`}
                className={`transition-all duration-300 rounded-full cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? "px-3 py-1 bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-xs font-semibold shadow-md shadow-purple-900/50"
                    : "w-2.5 h-2.5 bg-gray-600 hover:bg-purple-400"
                }`}
              >
                {isActive && (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    <span>{project.name}</span>
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* Auto-revolve toggle button */}
        <button
          onClick={() => setIsAutoPlay((prev) => !prev)}
          className="flex items-center gap-1.5 text-xs font-mono text-gray-400 hover:text-purple-300 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all cursor-pointer"
          title={isAutoPlay ? "Pause auto-orbit" : "Resume auto-orbit"}
        >
          {isAutoPlay ? (
            <>
              <FaPause className="text-[10px] text-cyan-400" />
              <span>Orbit Active</span>
            </>
          ) : (
            <>
              <FaPlay className="text-[10px] text-gray-400" />
              <span>Orbit Paused</span>
            </>
          )}
        </button>
      </div>

      {/* View All Projects Button */}
      <Link
        to="/projects"
        className="mt-10 px-7 py-3 rounded-full bg-gradient-to-r from-purple-900/60 via-purple-800/40 to-purple-900/60 border border-purple-500/40 text-purple-200 text-sm sm:text-base font-semibold hover:text-white hover:border-purple-400 hover:shadow-[0_0_25px_rgba(168,85,247,0.35)] transition-all cursor-pointer backdrop-blur-md"
      >
        View All Projects &amp; Experiments →
      </Link>
    </section>
  );
};

export default Projects;
