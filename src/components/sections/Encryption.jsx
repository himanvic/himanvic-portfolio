import React from "react";
import { motion } from "framer-motion";
import { slideInFromTop } from "../../utils/motion";

const Encryption = () => {
  return (
    <div className="flex flex-col items-center justify-center relative min-h-screen w-full h-full -z-20 overflow-hidden px-4">
      {/* Headline */}
      <div className="absolute top-6 z-[5] px-2">
        <motion.div
          variants={slideInFromTop}
          initial="hidden"
          animate="visible"
          className="text-2xl sm:text-3xl md:text-4xl font-medium text-center text-gray-200"
        >
          My Profile{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
            &amp;
          </span>{" "}
          Journey.
        </motion.div>
      </div>

      {/* Lock + Button */}
      <div className="flex flex-col items-center justify-center absolute z-[20] -translate-y-16">
        <div className="relative group cursor-pointer flex items-center justify-center w-36 h-36 select-none">
          {/* Atmospheric Holographic Halo */}
          <div className="absolute w-36 h-36 rounded-full bg-gradient-to-r from-purple-600/35 via-indigo-600/25 to-cyan-500/35 blur-xl opacity-75 group-hover:opacity-100 group-hover:scale-115 transition-all duration-700 pointer-events-none" />

          {/* SVG Orbital Rings & Core Glass Disc */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 140 140"
            className="w-full h-full absolute inset-0 z-10 drop-shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-transform duration-500 group-hover:scale-105"
          >
            <defs>
              <linearGradient id="ringGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#6366f1" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.85" />
              </linearGradient>

              <linearGradient id="ringGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#9333ea" stopOpacity="0.3" />
              </linearGradient>

              <radialGradient id="coreBg" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.92" />
                <stop offset="70%" stopColor="#0f1026" stopOpacity="0.96" />
                <stop offset="100%" stopColor="#080816" stopOpacity="1" />
              </radialGradient>

              <radialGradient id="haloGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.45" />
                <stop offset="60%" stopColor="#2563eb" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#000" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Ambient Background Glow */}
            <circle cx="70" cy="70" r="66" fill="url(#haloGlow)" />

            {/* Outer Orbital Ring (Slow clockwise rotation) */}
            <g>
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 70 70"
                to="360 70 70"
                dur="24s"
                repeatCount="indefinite"
              />
              <circle
                cx="70"
                cy="70"
                r="62"
                stroke="url(#ringGrad1)"
                strokeWidth="1.5"
                strokeDasharray="8 6 3 6"
                fill="none"
              />
              <circle cx="70" cy="8" r="2.5" fill="#38bdf8" />
              <circle cx="70" cy="132" r="2" fill="#c084fc" />
            </g>

            {/* Middle Tilted Orbital Ring (Counter-clockwise rotation) */}
            <g>
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="360 70 70"
                to="0 70 70"
                dur="16s"
                repeatCount="indefinite"
              />
              <ellipse
                cx="70"
                cy="70"
                rx="53"
                ry="45"
                stroke="url(#ringGrad2)"
                strokeWidth="1.2"
                strokeDasharray="14 8 2 8"
                fill="none"
                transform="rotate(-25 70 70)"
              />
              <circle cx="116" cy="52" r="2" fill="#818cf8" />
            </g>

            {/* Inner Core Glass Disc with 3D Depth */}
            <circle
              cx="70"
              cy="70"
              r="40"
              fill="url(#coreBg)"
              stroke="rgba(192, 132, 252, 0.45)"
              strokeWidth="1.5"
            />
            {/* Top Glass Arc Reflection */}
            <path
              d="M 38 62 A 36 36 0 0 1 102 62 A 34 26 0 0 0 38 62 Z"
              fill="rgba(255, 255, 255, 0.08)"
            />
          </svg>

          {/* Bold, Glowing Capital 'H' Monogram */}
          <span className="relative z-20 text-5xl sm:text-6xl font-black bg-gradient-to-br from-purple-300 via-indigo-300 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(168,85,247,0.95)] drop-shadow-[0_0_35px_rgba(56,189,248,0.7)] pointer-events-none -translate-y-0.5 tracking-tight">
            H
          </span>
        </div>
        <div className="Welcome-box px-4 py-1 z-[20] border mt-6 border-[#7042F88B] opacity-90">
          <h1 className="text-sm text-white">Aspiring Software Developer</h1>
        </div>
      </div>

      {/* Subtext */}
      <div className="absolute z-[20] bottom-[10px] px-4 text-center">
        <p className="text-gray-300 text-base sm:text-lg">
          A little about the person behind the projects.
        </p>
      </div>

      {/* Background Video */}
      <div className="absolute top-0 left-0 w-full h-full flex justify-center items-start">
        <video
          loop
          muted
          autoPlay
          playsInline
          preload="false"
          className="w-full h-auto object-cover opacity-80"
        >
          <source src="/assets/videos/encryption.webm" type="video/webm" />
        </video>
      </div>
    </div>
  );
};

export default Encryption;
