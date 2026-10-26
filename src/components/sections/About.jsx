import React from "react";
import { HiOutlineSparkles, HiOutlineTerminal, HiOutlineLightBulb } from "react-icons/hi";
import { FiCode, FiCpu, FiCheckCircle } from "react-icons/fi";

const About = () => {
  return (
    <section
      id="about"
      className="relative w-full py-24 sm:py-32 px-4 sm:px-6 lg:px-8 text-white z-10 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl w-full mx-auto relative z-10">
        {/* Section Header: Proper Centered Stack (Fixed Placement) */}
        <div className="flex flex-col items-center justify-center text-center mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-4 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono tracking-widest uppercase backdrop-blur-md shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            <span>GET TO KNOW ME</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 text-transparent bg-clip-text pb-2 inline-block tracking-tight">
            About Me
          </h2>

          <p className="mt-3 text-sm sm:text-base text-gray-400 max-w-xl mx-auto">
            A look into who I am, how I approach software, and the foundations I'm building today.
          </p>
        </div>

        {/* Bento Grid: Left Main Narrative + Right Pillar Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          {/* LEFT: Main Narrative Card (7 cols) */}
          <div className="lg:col-span-7 bg-[#101026]/85 border border-purple-500/20 hover:border-purple-500/40 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden flex flex-col justify-between transition-all duration-300 group">
            {/* Subtle glow orb */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-purple-600/15 rounded-full blur-2xl pointer-events-none group-hover:bg-purple-600/25 transition-all duration-500" />

            <div className="relative z-10 space-y-6">
              {/* Header inside card */}
              <div className="flex items-center gap-4 border-b border-white/10 pb-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600/40 via-indigo-600/30 to-cyan-500/30 border border-purple-400/40 flex items-center justify-center font-black text-xl text-white shadow-[0_0_20px_rgba(168,85,247,0.35)] shrink-0">
                  H
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                    <span>Hey, I'm</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                      himanvic
                    </span>
                    <span className="text-xl">👋</span>
                  </h3>
                  <p className="text-xs sm:text-sm font-mono text-purple-300/80 mt-0.5">
                    Student Developer &amp; Systems Enthusiast
                  </p>
                </div>
              </div>

              {/* Story paragraphs */}
              <div className="space-y-4 text-gray-300 text-sm sm:text-base leading-relaxed font-light">
                <p>
                  I'm a student developer who enjoys turning ideas into digital experiences. I build and experiment with software projects, developer tools, and creative experiments, bringing ideas to life one project at a time.
                </p>

                <p>
                  I'm currently focused on{" "}
                  <span className="text-white font-semibold bg-white/5 px-2 py-0.5 rounded border border-white/10">
                    C++ and Python
                  </span>
                  , strengthening my programming fundamentals, problem solving, and software design.
                </p>

                <p>
                  I believe in learning by building, improving through experimentation, and creating things that people can actually use.
                </p>
              </div>
            </div>

            {/* Signature Quote Banner */}
            <div className="mt-8 pt-5 border-t border-purple-500/20 relative z-10 flex items-center gap-3 bg-purple-950/20 -mx-6 sm:-mx-10 -mb-6 sm:-mb-10 p-5 px-6 sm:px-10 rounded-b-3xl">
              <span className="text-2xl text-purple-400 leading-none">“</span>
              <p className="italic text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-blue-300 to-cyan-300 font-medium text-sm sm:text-base">
                Curious by nature. Building by passion. Learning every day.
              </p>
            </div>
          </div>

          {/* RIGHT: Focus Pillars & Quick Attributes (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4 sm:gap-5">
            {/* Pillar 1: Dedicated Arsenal */}
            <div className="bg-[#101026]/80 border border-blue-500/20 hover:border-blue-400/40 rounded-2xl p-5 sm:p-6 backdrop-blur-xl shadow-lg transition-all duration-300 group">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-400/30 text-blue-400 text-2xl group-hover:scale-110 transition-transform">
                  <FiCpu />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-blue-400 font-mono font-semibold">
                    Core Arsenal
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-white mt-0.5">
                    C++ &amp; Python
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-300 mt-1 leading-snug">
                    Low-level memory &amp; systems programming paired with versatile computational scripting.
                  </p>
                </div>
              </div>
            </div>

            {/* Pillar 2: Core Philosophy */}
            <div className="bg-[#101026]/80 border border-purple-500/20 hover:border-purple-400/40 rounded-2xl p-5 sm:p-6 backdrop-blur-xl shadow-lg transition-all duration-300 group">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-400/30 text-purple-400 text-2xl group-hover:scale-110 transition-transform">
                  <HiOutlineLightBulb />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-purple-400 font-mono font-semibold">
                    Philosophy
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-white mt-0.5">
                    Learn by Building
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-300 mt-1 leading-snug">
                    Real code over passive theory. Exploring architecture through iterative experimentation.
                  </p>
                </div>
              </div>
            </div>

            {/* Pillar 3: Active Mission */}
            <div className="bg-[#101026]/80 border border-cyan-500/20 hover:border-cyan-400/40 rounded-2xl p-5 sm:p-6 backdrop-blur-xl shadow-lg transition-all duration-300 group">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 text-2xl group-hover:scale-110 transition-transform">
                  <HiOutlineTerminal />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-cyan-400 font-mono font-semibold">
                    Current Focus
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-white mt-0.5">
                    Foundations &amp; Logic
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-300 mt-1 leading-snug">
                    Data structures, algorithmic efficiency, and clean, modular software design.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Status Pill at bottom */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm font-mono text-gray-400">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-gray-300">Status: Building &amp; Experimenting</span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="text-amber-400">🐧</span>
            <span className="text-gray-300">Environment: Linux &amp; VS Code</span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="text-cyan-400">⚡</span>
            <span className="text-gray-300">Languages: C++ &amp; Python Exclusively</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
