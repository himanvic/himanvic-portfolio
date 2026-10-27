// File Name: Projects.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PROJECTS } from "@/constants/projectsData";
import { fetchGitHubRepos, formatRepoForCard } from "@/utils/githubSync";
import { Link } from "react-router-dom";
import {
  FaChevronLeft,
  FaChevronRight,
  FaExternalLinkAlt,
  FaPlay,
  FaPause,
} from "react-icons/fa";

const Projects = () => {
  const [projectList, setProjectList] = useState(PROJECTS);
  const [activeIndex, setActiveIndex] = useState(0);
  const [, setDirection] = useState(1);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  const touchStartXRef = useRef(0);
  const total = projectList.length;

  // Responsive width tracking
  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Automatic sync with newly tagged "featured" GitHub repos
  useEffect(() => {
    let isMounted = true;
    async function syncFeatured() {
      const repos = await fetchGitHubRepos();
      if (!repos || !Array.isArray(repos) || !isMounted) return;

      const baselineNames = new Set(
        PROJECTS.map((p) => p.name.toLowerCase().replace(/[^a-z0-9]/g, ""))
      );

      const newFeatured = [];
      for (const repo of repos) {
        const cleanName = repo.name.toLowerCase().replace(/[^a-z0-9]/g, "");
        const cleanNoWebsite = cleanName.replace(/website$/, "");
        if (
          (repo.topics || []).includes("featured") &&
          !baselineNames.has(cleanName) &&
          !baselineNames.has(cleanNoWebsite)
        ) {
          const formatted = formatRepoForCard(repo);
          newFeatured.push({
            id: formatted.id,
            name: formatted.name,
            image: formatted.image,
            tag: formatted.tag,
            tech: formatted.tech,
            accent: formatted.accent,
            description: formatted.description,
            link: formatted.link,
          });
        }
      }

      if (newFeatured.length > 0 && isMounted) {
        setProjectList([...PROJECTS, ...newFeatured]);
      }
    }

    syncFeatured();
    return () => {
      isMounted = false;
    };
  }, []);

  const isMobile = viewportWidth < 640;
  const isTablet = viewportWidth >= 640 && viewportWidth < 1024;

  const nextProject = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevProject = useCallback(() => {
    setDirection(-1);
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
    const diff = touchStartXRef.current - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextProject();
      } else {
        prevProject();
      }
    }
  };

  const getCardTransform = (index) => {
    let diff = index - activeIndex;

    // Normalizing wrap-around for a circular carousel
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    // Center active card
    if (diff === 0) {
      return {
        x: 0,
        y: 0,
        z: 90,
        scale: isMobile ? 1.0 : 1.05,
        rotateY: 0,
        opacity: 1,
        zIndex: 30,
        isCenter: true,
      };
    }

    // Right card in orbit
    if (diff === 1) {
      const offsetX = isMobile ? 135 : isTablet ? 280 : 400;
      return {
        x: offsetX,
        y: 0,
        z: -120,
        scale: isMobile ? 0.78 : 0.85,
        rotateY: -26,
        opacity: isMobile ? 0.35 : 0.65,
        zIndex: 10,
        isCenter: false,
      };
    }

    // Left card in orbit (diff === -1)
    const offsetX = isMobile ? -135 : isTablet ? -280 : -400;
    return {
      x: offsetX,
      y: 0,
      z: -120,
      scale: isMobile ? 0.78 : 0.85,
      rotateY: 26,
      opacity: isMobile ? 0.35 : 0.65,
      zIndex: 10,
      isCenter: false,
    };
  };

  const handleCardClick = (index, link) => {
    if (index === activeIndex) {
      window.open(link, "_blank", "noopener,noreferrer");
    } else {
      let diff = index - activeIndex;
      if (diff === 2) diff = -1;
      if (diff === -2) diff = 1;
      setDirection(diff > 0 ? 1 : -1);
      setActiveIndex(index);
    }
  };

  return (
    <section
      id="projects"
      className="w-full py-24 sm:py-32 flex flex-col items-center justify-center relative overflow-hidden text-white z-10"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Header with badge */}
      <div className="flex flex-col items-center text-center mb-8 px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-3 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-mono tracking-wide backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>FEATURED CREATIONS</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-sky-300 to-amber-300 text-transparent bg-clip-text pb-2 tracking-normal inline-block">
          My Projects
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm mt-1 max-w-md mx-auto font-mono">
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
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] max-w-[94vw] h-[260px] rounded-[50%] border border-cyan-500/20 pointer-events-none -z-10 shadow-[0_0_50px_rgba(6,182,212,0.12)]"
          style={{ transform: "translate(-50%, -50%) rotateX(68deg)" }}
        >
          {/* Animated dashed orbit ring */}
          <div className="absolute inset-0 rounded-[50%] border border-dashed border-cyan-400/25 animate-spin-slow" />
          {/* Orbit glowing nodes */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_#38bdf8]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_12px_#facc15]" />
        </div>

        {/* The Revolving Project Cards (Baseline + Auto-Synced Featured) */}
        {projectList.map((project, idx) => {
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
                duration: 0.72,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                zIndex: transform.zIndex,
                transformStyle: "preserve-3d",
                willChange: "transform, opacity",
              }}
              className={`absolute w-[290px] sm:w-[350px] md:w-[380px] rounded-2xl overflow-hidden cursor-pointer ${
                isCenter
                  ? "bg-[#090d1f]/95 border-2 border-cyan-400/70 shadow-[0_0_45px_rgba(6,182,212,0.35)] ring-1 ring-cyan-400/40"
                  : "bg-[#060914]/85 border border-cyan-500/20 shadow-xl hover:border-cyan-400/50 hover:opacity-85"
              }`}
            >
              {/* Card Screenshot Header */}
              <div className="relative w-full h-44 sm:h-52 overflow-hidden bg-black/60">
                <img
                  src={project.image}
                  alt={project.name}
                  onError={(e) => {
                    e.currentTarget.src = `https://opengraph.githubassets.com/1/himanvic/${project.name.toLowerCase().replace(/\s+/g, "-")}`;
                  }}
                  className={`w-full h-full object-cover object-top transition-transform duration-500 ${
                    isCenter ? "hover:scale-105" : ""
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090d1f] via-transparent to-black/30 pointer-events-none" />

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
                    <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {project.name}
                    </h3>
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: project.accent }}
                    />
                  </div>

                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed line-clamp-3 mb-4 font-light">
                    {project.description}
                  </p>

                  {/* Tech stack pills */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.tech?.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-md bg-cyan-950/50 border border-cyan-500/20 text-[10px] sm:text-[11px] text-cyan-200 font-mono"
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
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-sky-500 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-cyan-950/50 transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <span>Launch Web App</span>
                    <FaExternalLinkAlt className="text-xs" />
                  </a>
                ) : (
                  <div className="w-full py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-xs text-center font-medium flex items-center justify-center gap-1.5 group-hover:text-cyan-300 group-hover:border-cyan-500/30 transition-colors">
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
          className="absolute left-2 sm:left-4 z-40 w-11 h-11 rounded-full bg-black/60 border border-cyan-500/30 text-white backdrop-blur-md flex items-center justify-center hover:bg-cyan-900/40 hover:border-cyan-400 hover:scale-110 transition-all shadow-lg shadow-cyan-950/50 cursor-pointer"
        >
          <FaChevronLeft className="text-sm" />
        </button>

        <button
          onClick={nextProject}
          aria-label="Next project"
          className="absolute right-2 sm:right-4 z-40 w-11 h-11 rounded-full bg-black/60 border border-cyan-500/30 text-white backdrop-blur-md flex items-center justify-center hover:bg-cyan-900/40 hover:border-cyan-400 hover:scale-110 transition-all shadow-lg shadow-cyan-950/50 cursor-pointer"
        >
          <FaChevronRight className="text-sm" />
        </button>
      </div>

      {/* Orbital Pagination Dots & Auto-Play Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6 z-20">
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#090d1f]/80 border border-cyan-500/25 backdrop-blur-md shadow-md">
          {projectList.map((project, idx) => {
            const isActive = activeIndex === idx;
            return (
              <button
                key={project.id}
                onClick={() => {
                  let diff = idx - activeIndex;
                  if (diff === 2) diff = -1;
                  if (diff === -2) diff = 1;
                  setDirection(diff > 0 ? 1 : -1);
                  setActiveIndex(idx);
                }}
                aria-label={`Jump to ${project.name}`}
                className={`transition-all duration-300 rounded-full cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? "px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold shadow-md shadow-cyan-950/60"
                    : "w-2.5 h-2.5 bg-gray-600 hover:bg-cyan-400"
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
          className="flex items-center gap-1.5 text-xs font-mono text-gray-400 hover:text-cyan-300 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all cursor-pointer"
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
        className="mt-10 px-7 py-3 rounded-full bg-gradient-to-r from-cyan-950/70 via-slate-900/80 to-cyan-950/70 border border-cyan-500/40 text-cyan-200 text-sm sm:text-base font-semibold hover:text-white hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(6,182,212,0.35)] transition-all cursor-pointer backdrop-blur-md font-mono"
      >
        View All Projects &amp; Experiments →
      </Link>
    </section>
  );
};

export default Projects;
