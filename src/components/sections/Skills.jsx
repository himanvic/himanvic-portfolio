import React from "react";
import {
  SiCplusplus,
  SiPython,
  SiGit,
  SiGithub,
  SiLinux,
} from "react-icons/si";
import { VscCode } from "react-icons/vsc";

const Skills = () => {
  return (
    <section
      id="skills"
      className="relative w-full py-24 sm:py-32 md:py-40 overflow-hidden flex flex-col items-center justify-center z-10"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Text Content */}
      <div className="relative z-20 text-center px-4 sm:px-6 max-w-5xl w-full flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-3 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-widest uppercase backdrop-blur-md shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>CORE FOCUS</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-cyan-400 via-sky-300 to-amber-300 text-transparent bg-clip-text pb-2 inline-block tracking-tight">
          Languages &amp; Tools
        </h2>

        <p className="text-gray-300 text-sm sm:text-base mb-12 max-w-2xl mx-auto font-light leading-relaxed">
          Currently exploring and strengthening fundamentals in <span className="text-cyan-400 font-semibold">C++</span> and <span className="text-amber-400 font-semibold">Python</span>, learning through hands-on experimentation.
        </p>

        {/* Primary Languages Showcase */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl w-full mx-auto mb-12">
          {/* C++ Card */}
          <div className="bg-[#090d1f]/85 border border-cyan-500/30 rounded-2xl p-6 backdrop-blur-xl hover:border-cyan-400/60 transition-all hover:scale-[1.02] flex items-center gap-5 text-left shadow-lg group">
            <div className="p-4 bg-cyan-500/10 border border-cyan-400/30 rounded-xl text-cyan-400 text-5xl group-hover:scale-110 transition-transform">
              <SiCplusplus />
            </div>
            <div>
              <h3 className="text-white text-xl font-bold flex items-center gap-2">
                <span>C++</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">Core</span>
              </h3>
              <p className="text-gray-300 text-sm mt-1 leading-snug">
                Object-oriented programming, data structures, algorithms, and system fundamentals.
              </p>
            </div>
          </div>

          {/* Python Card */}
          <div className="bg-[#090d1f]/85 border border-amber-500/30 rounded-2xl p-6 backdrop-blur-xl hover:border-amber-400/60 transition-all hover:scale-[1.02] flex items-center gap-5 text-left shadow-lg group">
            <div className="p-4 bg-amber-500/10 border border-amber-400/30 rounded-xl text-amber-400 text-5xl group-hover:scale-110 transition-transform">
              <SiPython />
            </div>
            <div>
              <h3 className="text-white text-xl font-bold flex items-center gap-2">
                <span>Python</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">Logic</span>
              </h3>
              <p className="text-gray-300 text-sm mt-1 leading-snug">
                Scripting, automation, algorithmic problem solving, and experimental projects.
              </p>
            </div>
          </div>
        </div>

        {/* Developer Workflow & Tools */}
        <div className="max-w-2xl mx-auto w-full">
          <p className="text-xs uppercase tracking-wider text-cyan-400/80 mb-4 font-mono font-semibold">
            Development Environment &amp; Workflow
          </p>
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#090d1f]/80 border border-cyan-500/20 hover:border-cyan-400/50 rounded-xl text-gray-300 hover:text-white transition-all shadow-sm">
              <SiGit className="text-orange-500 text-xl" />
              <span className="text-sm font-medium font-mono">Git</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#090d1f]/80 border border-cyan-500/20 hover:border-cyan-400/50 rounded-xl text-gray-300 hover:text-white transition-all shadow-sm">
              <SiGithub className="text-cyan-200 text-xl" />
              <span className="text-sm font-medium font-mono">GitHub</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#090d1f]/80 border border-cyan-500/20 hover:border-cyan-400/50 rounded-xl text-gray-300 hover:text-white transition-all shadow-sm">
              <SiLinux className="text-amber-300 text-xl" />
              <span className="text-sm font-medium font-mono">Linux</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#090d1f]/80 border border-cyan-500/20 hover:border-cyan-400/50 rounded-xl text-gray-300 hover:text-white transition-all shadow-sm">
              <VscCode className="text-cyan-400 text-xl" />
              <span className="text-sm font-medium font-mono">VS Code</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cybernetic Background Wormhole Video (Recolored from Purple to Electric Cyan/Blue) */}
      <div
        className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden"
        style={{
          maskImage: "radial-gradient(ellipse 75% 70% at 50% 50%, black 25%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(ellipse 75% 70% at 50% 50%, black 25%, transparent 85%)",
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-45"
          style={{
            filter: "hue-rotate(285deg) saturate(1.35) brightness(1.15)",
          }}
        >
          <source src="/assets/videos/skills.webm" type="video/webm" />
        </video>
      </div>
    </section>
  );
};

export default Skills;
