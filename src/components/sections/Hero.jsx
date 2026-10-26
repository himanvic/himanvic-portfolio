import React from "react";
import OrbitIcons from "../sub/OrbitIcons";
import RotatingTitles from "../sub/RotatingTitles";

const Hero = () => {
  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex items-center justify-center text-white overflow-hidden px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16"
    >
      {/* Background ambient video - Upside Down Top Canopy (Seamless Radial Edge Blending) */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[108%] h-[380px] sm:h-[460px] overflow-hidden pointer-events-none z-0"
        style={{
          perspective: "1000px",
          maskImage: "radial-gradient(ellipse 80% 85% at 50% 0%, black 40%, transparent 95%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 85% at 50% 0%, black 40%, transparent 95%)",
        }}
      >
        <video
          className="w-full h-full object-cover"
          style={{
            transform: "rotate(180deg) rotateX(10deg) scale(1.06)",
            transformOrigin: "center center",
          }}
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/assets/videos/hero.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Hero content container */}
      <div className="relative z-10 max-w-7xl w-full flex flex-col lg:flex-row items-center justify-between gap-12 sm:gap-16 lg:gap-8">
        {/* LEFT: TEXT & CALL TO ACTIONS */}
        <div className="flex-1 text-center lg:text-left px-2 max-w-2xl lg:max-w-none">
          {/* Beacon Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md text-emerald-300 text-xs sm:text-sm font-mono font-medium tracking-wide shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span>ASPIRING DEVELOPER • C++ &amp; PYTHON</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.12]">
            Turning{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-amber-300 inline-block pb-2">
              Curiosity
            </span>{" "}
            into Code,
            <br />
            <span className="text-gray-100">and Ideas into Experiences.</span>
          </h1>

          {/* Refined non-repetitive Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
            Focused on low-level systems in C++ and algorithmic experimentation in Python. Building digital experiences and mastering software engineering from the ground up.
          </p>

          {/* Dual Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <a
              href="#projects"
              className="px-7 py-3.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-sky-500 text-white font-medium rounded-full shadow-[0_0_24px_rgba(6,182,212,0.4)] hover:shadow-[0_0_32px_rgba(6,182,212,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 group cursor-pointer"
            >
              <span>Explore Projects</span>
              <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
            </a>

            <a
              href="#about"
              className="px-6 py-3.5 rounded-full border border-cyan-500/20 bg-slate-900/60 hover:bg-slate-900/90 backdrop-blur-md text-gray-200 hover:text-white font-medium hover:border-cyan-400/50 transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <span>My Journey</span>
              <span className="text-amber-400">⚡</span>
            </a>
          </div>
        </div>

        {/* RIGHT: "H" Sun Solar System + Rotating Titles */}
        <div className="flex-1 flex flex-col items-center justify-center relative px-2 w-full">
          <OrbitIcons />

          {/* Dynamic Titles beneath the Solar System */}
          <div className="mt-8 sm:mt-12 text-center">
            <div className="text-[11px] uppercase tracking-widest text-cyan-400/80 font-mono mb-2 font-semibold">
              Focus &amp; Craft
            </div>
            <RotatingTitles />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
