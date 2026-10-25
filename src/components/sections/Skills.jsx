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
      {/* Text Content */}
      <div className="relative z-20 text-center px-4 sm:px-6 max-w-5xl w-full">
        <div className="inline-block px-4 py-1.5 mb-3 rounded-full bg-purple-900/40 border border-purple-500/30 text-purple-300 text-xs sm:text-sm font-medium tracking-wide">
          CORE FOCUS
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white">
          Languages &amp; Tools
        </h2>
        <p className="text-gray-300 text-sm sm:text-base mb-12 max-w-2xl mx-auto">
          Currently exploring and strengthening fundamentals in <span className="text-blue-400 font-semibold">C++</span> and <span className="text-yellow-400 font-semibold">Python</span>, learning through hands-on experimentation.
        </p>

        {/* Primary Languages Showcase */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto mb-10">
          {/* C++ Card */}
          <div className="bg-[#151528]/80 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-md hover:border-blue-400/60 transition-all hover:scale-[1.02] flex items-center gap-5 text-left">
            <div className="p-4 bg-blue-500/10 rounded-xl text-blue-400 text-5xl">
              <SiCplusplus />
            </div>
            <div>
              <h3 className="text-white text-xl font-bold">C++</h3>
              <p className="text-gray-300 text-sm mt-1">
                Object-oriented programming, data structures, algorithms, and system fundamentals.
              </p>
            </div>
          </div>

          {/* Python Card */}
          <div className="bg-[#151528]/80 border border-yellow-500/30 rounded-2xl p-6 backdrop-blur-md hover:border-yellow-400/60 transition-all hover:scale-[1.02] flex items-center gap-5 text-left">
            <div className="p-4 bg-yellow-500/10 rounded-xl text-yellow-400 text-5xl">
              <SiPython />
            </div>
            <div>
              <h3 className="text-white text-xl font-bold">Python</h3>
              <p className="text-gray-300 text-sm mt-1">
                Scripting, automation, algorithmic problem solving, and experimental projects.
              </p>
            </div>
          </div>
        </div>

        {/* Developer Workflow & Tools */}
        <div className="max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-wider text-purple-300/80 mb-4 font-semibold">
            Development Environment &amp; Workflow
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#121224]/80 border border-purple-500/20 rounded-xl text-gray-300 hover:text-white transition-colors">
              <SiGit className="text-orange-500 text-xl" />
              <span className="text-sm font-medium">Git</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#121224]/80 border border-purple-500/20 rounded-xl text-gray-300 hover:text-white transition-colors">
              <SiGithub className="text-white text-xl" />
              <span className="text-sm font-medium">GitHub</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#121224]/80 border border-purple-500/20 rounded-xl text-gray-300 hover:text-white transition-colors">
              <SiLinux className="text-yellow-300 text-xl" />
              <span className="text-sm font-medium">Linux</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#121224]/80 border border-purple-500/20 rounded-xl text-gray-300 hover:text-white transition-colors">
              <VscCode className="text-cyan-400 text-xl" />
              <span className="text-sm font-medium">VS Code</span>
            </div>
          </div>
        </div>
      </div>

      {/* Purple Orbital Background Video */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-35"
        >
          <source src="/assets/videos/skills.webm" type="video/webm" />
        </video>
      </div>
    </section>
  );
};

export default Skills;
