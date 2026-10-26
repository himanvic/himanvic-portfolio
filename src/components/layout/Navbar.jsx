// File Name: Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaGithub,
  FaTwitter,
  FaExternalLinkAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { SiHuggingface } from "react-icons/si";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { name: "About", href: "/#about" },
  { name: "Skills", href: "/#skills" },
  { name: "Projects", href: "/#projects" },
  { name: "Journey", href: "/#profile" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Detect scroll to adjust glass transparency
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#060713]/85 backdrop-blur-xl border-b border-purple-500/20 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.6)]"
          : "bg-transparent py-4 sm:py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between relative">
        {/* Left: Brand Identity */}
        <Link
          to="/"
          className="flex items-center gap-3 group cursor-pointer select-none"
        >
          <div className="relative">
            <img
              src="/favicon.svg"
              alt="Himanvic logo"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-purple-500/40 p-0.5 bg-purple-950/40 shadow-[0_0_15px_rgba(168,85,247,0.35)] group-hover:scale-105 group-hover:border-purple-400 transition-all"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-black" />
          </div>

          <div className="flex flex-col">
            <span className="text-white font-bold text-base sm:text-lg tracking-wide group-hover:text-purple-300 transition-colors">
              Himanvic
            </span>
            <span className="hidden md:inline-block text-[10px] font-mono text-cyan-300/80 -mt-1">
              C++ • Python
            </span>
          </div>
        </Link>

        {/* Center: Truly Centered Floating Frosted Glass Dock (Desktop/Tablet) */}
        <nav className="hidden md:flex items-center gap-1 bg-[#0f1126]/80 border border-purple-500/30 rounded-full px-3 py-1.5 backdrop-blur-xl shadow-[0_4px_25px_rgba(0,0,0,0.5)] absolute left-1/2 -translate-x-1/2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="px-3.5 py-1.5 rounded-full text-xs lg:text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              {link.name}
            </Link>
          ))}

          <div className="w-px h-4 bg-purple-500/30 mx-1" />

          <a
            href="https://github.com/himanvic/himanvic-portfolio"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-full text-xs lg:text-sm font-medium text-purple-300 hover:text-white hover:bg-purple-900/40 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Source</span>
            <FaExternalLinkAlt className="text-[10px] opacity-70" />
          </a>
        </nav>

        {/* Right: Glassmorphic Social Badges (Desktop) */}
        <div className="hidden sm:flex items-center gap-2">
          <a
            href="https://github.com/himanvic"
            target="_blank"
            rel="noreferrer"
            title="GitHub Profile"
            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-purple-400 hover:bg-purple-900/30 text-gray-300 hover:text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm"
          >
            <FaGithub className="text-base" />
          </a>
          <a
            href="https://x.com/Himanvic_dev"
            target="_blank"
            rel="noreferrer"
            title="Twitter / X"
            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-purple-400 hover:bg-purple-900/30 text-gray-300 hover:text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm"
          >
            <FaTwitter className="text-base" />
          </a>
          <a
            href="https://huggingface.co/himanvic"
            target="_blank"
            rel="noreferrer"
            title="Hugging Face"
            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-purple-400 hover:bg-purple-900/30 text-gray-300 hover:text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm"
          >
            <SiHuggingface className="text-base" />
          </a>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          className="md:hidden w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 hover:border-purple-400 transition-all cursor-pointer"
        >
          {isMobileMenuOpen ? (
            <FaTimes className="text-base text-purple-300" />
          ) : (
            <FaBars className="text-base text-gray-300" />
          )}
        </button>
      </div>

      {/* Mobile Animated Dropdown Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mt-3 mx-4 p-5 rounded-2xl bg-[#0a0c1e]/95 border border-purple-500/30 backdrop-blur-2xl shadow-2xl flex flex-col gap-4 select-none"
          >
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-200 hover:text-white hover:bg-purple-950/50 transition-colors flex items-center justify-between"
                >
                  <span>{link.name}</span>
                  <span className="text-purple-400 text-xs">→</span>
                </Link>
              ))}

              <a
                href="https://github.com/himanvic/himanvic-portfolio"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-purple-300 hover:bg-purple-950/50 transition-colors flex items-center justify-between"
              >
                <span>Portfolio Source</span>
                <FaExternalLinkAlt className="text-xs opacity-70" />
              </a>
            </div>

            {/* Mobile Socials Row */}
            <div className="pt-3 border-t border-purple-500/20 flex items-center justify-around">
              <a
                href="https://github.com/himanvic"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white"
              >
                <FaGithub /> GitHub
              </a>
              <a
                href="https://x.com/Himanvic_dev"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white"
              >
                <FaTwitter /> Twitter / X
              </a>
              <a
                href="https://huggingface.co/himanvic"
                target="_blank"
                rel="noreferrer"
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
