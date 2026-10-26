// File Name: ProjectGalleryCard.jsx
import React, { useState } from "react";
import { SiCplusplus, SiPython } from "react-icons/si";
import { FaGithub, FaStar, FaExternalLinkAlt } from "react-icons/fa";

const ProjectGalleryCard = ({ name, description, link, tech, image, stars }) => {
  const [imgError, setImgError] = useState(!image);
  const isGithub = link && link.includes("github.com");

  const hasCpp = tech?.some((t) => t.toLowerCase().includes("c++") || t.toLowerCase() === "cpp");
  const hasPython = tech?.some((t) => t.toLowerCase().includes("python"));

  return (
    <div className="bg-[#090d1f]/90 rounded-2xl shadow-xl overflow-hidden w-[300px] sm:w-[340px] hover:scale-[1.03] transition-all duration-300 border border-cyan-500/25 hover:border-cyan-400/50 flex flex-col justify-between backdrop-blur-xl group">
      <div>
        {/* Header Visual: Image or Cyber Language Holographic Fallback */}
        <div className="relative w-full h-48 overflow-hidden bg-[#060914] flex items-center justify-center">
          {!imgError ? (
            <img
              src={image}
              alt={name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="relative w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#0c1329] via-[#070b1a] to-[#02050f] border-b border-cyan-500/20 select-none">
              {/* Concentric subtle background cyber rings */}
              <div className="absolute w-32 h-32 rounded-full border border-cyan-500/15 pointer-events-none" />
              <div className="absolute w-20 h-20 rounded-full border border-amber-400/10 pointer-events-none" />

              {/* Glowing Language Icon */}
              <div className="relative z-10 mb-2 p-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-lg">
                {hasCpp ? (
                  <SiCplusplus className="text-4xl text-sky-400 drop-shadow-[0_0_12px_rgba(56,189,248,0.6)]" />
                ) : hasPython ? (
                  <SiPython className="text-4xl text-amber-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.6)]" />
                ) : (
                  <FaGithub className="text-4xl text-cyan-300 drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]" />
                )}
              </div>

              {/* Repo Name Pill */}
              <span className="relative z-10 text-xs font-mono font-semibold text-gray-200 tracking-wider">
                {name}
              </span>
            </div>
          )}

          {/* Stars badge if > 0 */}
          {stars > 0 && (
            <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-amber-400/30 text-amber-300 text-[10px] font-mono flex items-center gap-1 shadow-md">
              <FaStar className="text-[9px]" />
              <span>{stars}</span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-5">
          <h3 className="text-lg font-bold mb-2 text-white group-hover:text-cyan-300 transition-colors">
            {name}
          </h3>
          <p className="text-sm text-gray-300 mb-4 leading-relaxed font-light line-clamp-3">
            {description}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {tech?.map((item, i) => (
              <span
                key={i}
                className="text-[11px] bg-cyan-500/15 px-2.5 py-0.5 rounded-full text-cyan-300 border border-cyan-500/30 font-mono"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action CTA Button */}
      {link && (
        <div className="px-5 pb-5">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
              isGithub
                ? "bg-slate-800/80 hover:bg-slate-700/90 text-gray-200 border border-cyan-500/30 hover:border-cyan-400"
                : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-[1.02]"
            }`}
          >
            {isGithub ? (
              <>
                <FaGithub className="text-sm" />
                <span>View Code (GitHub)</span>
              </>
            ) : (
              <>
                <span>View Live App</span>
                <FaExternalLinkAlt className="text-[10px]" />
              </>
            )}
          </a>
        </div>
      )}
    </div>
  );
};

export default ProjectGalleryCard;
