// File Name: Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaGithub,
  FaTwitter,
  FaExternalLinkAlt,
  FaBars,
  FaTimes,
  FaVolumeMute,
  FaVolumeUp,
  FaSearch,
} from "react-icons/fa";
import { SiHuggingface } from "react-icons/si";
import { motion, AnimatePresence } from "framer-motion";
import { toggleAudioMute, getIsAudioMuted } from "@/utils/audio";

const NAV_LINKS = [
  { name: "About", href: "/#about", id: "about" },
  { name: "Skills", href: "/#skills", id: "skills" },
  { name: "Projects", href: "/#projects", id: "projects" },
  { name: "Journey", href: "/#profile", id: "profile" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(getIsAudioMuted());
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleSectionClick = (e, id) => {
    setIsMobileMenuOpen(false);
    if (location.pathname === "/") {
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
        window.history.replaceState(null, "", `/#${id}`);
      }
    }
  };

  const handleBrandClick = (e) => {
    setIsMobileMenuOpen(false);
    if (location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (location.hash) {
        window.history.replaceState(null, "", "/");
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#030712]/90 backdrop-blur-xl border-b border-cyan-500/20 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.7)]"
          : "bg-transparent py-4 sm:py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between relative">
        {/* Left: Brand Identity */}
        <Link
          to="/"
          onClick={handleBrandClick}
          className="flex items-center gap-3 group cursor-pointer select-none"
        >
          <div className="relative">
            <img
              src="/favicon.svg"
              alt="Himanvic logo"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-cyan-500/40 p-0.5 bg-cyan-950/40 shadow-[0_0_15px_rgba(6,182,212,0.35)] group-hover:scale-105 group-hover:border-cyan-400 transition-all"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-black" />
          </div>

          <div className="flex flex-col">
            <span className="text-white font-bold text-base sm:text-lg tracking-wide group-hover:text-cyan-300 transition-colors">
              Himanvic
            </span>
            <span className="hidden md:inline-block text-[10px] font-mono text-cyan-400/90 -mt-1 font-semibold">
              C++ • Python
            </span>
          </div>
        </Link>

        {/* Center: Floating Frosted Glass Dock (Desktop/Tablet) */}
        <nav className="hidden md:flex items-center gap-1 bg-[#090d1f]/85 border border-cyan-500/25 rounded-full px-3 py-1.5 backdrop-blur-xl shadow-[0_4px_25px_rgba(0,0,0,0.5)] absolute left-1/2 -translate-x-1/2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              onClick={(e) => handleSectionClick(e, link.id)}
              className="px-3.5 py-1.5 rounded-full text-xs lg:text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              {link.name}
            </Link>
          ))}

          <div className="w-px h-4 bg-cyan-500/30 mx-1" />

          <a
            href="https://github.com/himanvic/himanvic-portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-full text-xs lg:text-sm font-medium text-cyan-300 hover:text-white hover:bg-cyan-900/40 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Source</span>
            <FaExternalLinkAlt className="text-[10px] opacity-70" />
          </a>
        </nav>

        {/* Right: Dark Glassmorphic Capsule for Clear Contrast Over Bright Backdrop */}
        <div className="hidden md:flex items-center gap-1.5 bg-[#090d1f]/80 border border-cyan-500/25 rounded-full px-2.5 py-1 backdrop-blur-xl shadow-[0_4px_25px_rgba(0,0,0,0.5)]">
          <button
            onClick={() => {
              const muted = toggleAudioMute();
              setIsMuted(muted);
            }}
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:border-cyan-400 hover:bg-cyan-900/30 text-gray-300 hover:text-white flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
            title={isMuted ? "Unmute Audio Effects" : "Mute Audio Effects"}
          >
            {isMuted ? (
              <FaVolumeMute className="text-xs text-gray-400" />
            ) : (
              <FaVolumeUp className="text-xs text-cyan-300 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/60 hover:bg-cyan-900/70 border border-cyan-500/35 hover:border-cyan-400 text-cyan-300 hover:text-white text-xs font-mono transition-all hover:scale-105 cursor-pointer"
            title="Command Palette (Ctrl + K)"
          >
            <FaSearch className="text-[10px] text-cyan-400" />
            <span className="font-bold">Ctrl K</span>
          </button>

          <a
            href="https://github.com/himanvic"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub Profile"
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:border-cyan-400 hover:bg-cyan-900/30 text-gray-300 hover:text-white flex items-center justify-center transition-all hover:scale-105"
          >
            <FaGithub className="text-sm" />
          </a>
          <a
            href="https://x.com/Himanvic_dev"
            target="_blank"
            rel="noopener noreferrer"
            title="Twitter / X"
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:border-cyan-400 hover:bg-cyan-900/30 text-gray-300 hover:text-white flex items-center justify-center transition-all hover:scale-105"
          >
            <FaTwitter className="text-sm" />
          </a>
          <a
            href="https://huggingface.co/himanvic"
            target="_blank"
            rel="noopener noreferrer"
            title="Hugging Face"
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:border-amber-400 hover:bg-amber-900/30 text-gray-300 hover:text-white flex items-center justify-center transition-all hover:scale-105"
          >
            <SiHuggingface className="text-sm" />
          </a>
        </div>

        {/* Mobile Controls (Audio + Hamburger) */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => {
              const muted = toggleAudioMute();
              setIsMuted(muted);
            }}
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            className="w-9 h-9 rounded-xl bg-[#090d1f]/80 border border-white/10 text-gray-300 flex items-center justify-center hover:border-cyan-400 transition-all cursor-pointer backdrop-blur-md"
          >
            {isMuted ? (
              <FaVolumeMute className="text-sm text-gray-400" />
            ) : (
              <FaVolumeUp className="text-sm text-cyan-300 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            className="w-9 h-9 rounded-xl bg-[#090d1f]/80 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 hover:border-cyan-400 transition-all cursor-pointer backdrop-blur-md"
          >
            {isMobileMenuOpen ? (
              <FaTimes className="text-base text-cyan-300" />
            ) : (
              <FaBars className="text-base text-gray-300" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Animated Dropdown Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mt-3 mx-4 p-5 rounded-2xl bg-[#080d1e]/95 border border-cyan-500/30 backdrop-blur-2xl shadow-2xl flex flex-col gap-4 select-none"
          >
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={(e) => handleSectionClick(e, link.id)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-200 hover:text-white hover:bg-cyan-950/50 transition-colors flex items-center justify-between"
                >
                  <span>{link.name}</span>
                  <span className="text-cyan-400 text-xs">→</span>
                </Link>
              ))}

              <a
                href="https://github.com/himanvic/himanvic-portfolio"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-cyan-300 hover:bg-cyan-950/50 transition-colors flex items-center justify-between"
              >
                <span>Portfolio Source</span>
                <FaExternalLinkAlt className="text-xs opacity-70" />
              </a>
            </div>

            <div className="pt-3 border-t border-cyan-500/20 flex items-center justify-around">
              <a
                href="https://github.com/himanvic"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white"
              >
                <FaGithub /> GitHub
              </a>
              <a
                href="https://x.com/Himanvic_dev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white"
              >
                <FaTwitter /> Twitter / X
              </a>
              <a
                href="https://huggingface.co/himanvic"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white"
              >
                <SiHuggingface /> HuggingFace
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
