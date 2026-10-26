// File Name: Footer.jsx
import React from "react";
import { FaGithub, FaTwitter, FaArrowUp, FaExternalLinkAlt } from "react-icons/fa";
import { SiHuggingface } from "react-icons/si";
import { Link } from "react-router-dom";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="w-full text-white bg-[#060714]/90 backdrop-blur-2xl relative z-10 overflow-hidden">
      {/* Top cosmic glowing divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

      {/* Atmospheric ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[650px] h-[300px] bg-purple-700/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-purple-500/15">
          {/* Column 1 & 2: Brand Identity & Philosophy (Spans 2 cols on lg) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/favicon.svg"
                alt="Himanvic logo"
                className="w-9 h-9 rounded-xl border border-purple-500/40 p-0.5 bg-purple-950/40 shadow-[0_0_15px_rgba(168,85,247,0.35)]"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-300 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                Himanvic
              </span>
            </div>

            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Student developer exploring systems, algorithms, and real-time interactive simulations. Building foundational programming depth with C++ and Python.
            </p>

            <div className="flex items-center gap-2 mt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Always learning &amp; building</span>
              </div>
            </div>
          </div>

          {/* Column 3: Featured Creations */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase text-purple-300/90 font-mono">
              Live Projects
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm text-gray-400">
              <li>
                <a
                  href="https://mausam-india.pages.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                >
                  <span>Mausam India</span>
                  <span className="text-[10px] text-gray-500">AQI</span>
                </a>
              </li>
              <li>
                <a
                  href="https://naradnow.pages.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 transition-colors flex items-center gap-1.5"
                >
                  <span>NaradNow</span>
                  <span className="text-[10px] text-gray-500">News</span>
                </a>
              </li>
              <li>
                <a
                  href="https://rail-route-website.pages.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                >
                  <span>Rail &amp; Route</span>
                  <span className="text-[10px] text-gray-500">Railways</span>
                </a>
              </li>
              <li className="pt-1">
                <Link
                  to="/projects"
                  className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                >
                  View All Projects →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Quick Navigation */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase text-purple-300/90 font-mono">
              Navigation
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm text-gray-400">
              <li>
                <a href="/#about" className="hover:text-white transition-colors">
                  About Himanvic
                </a>
              </li>
              <li>
                <a href="/#skills" className="hover:text-white transition-colors">
                  Technical Skills
                </a>
              </li>
              <li>
                <a href="/#projects" className="hover:text-white transition-colors">
                  Featured Projects
                </a>
              </li>
              <li>
                <a href="/#profile" className="hover:text-white transition-colors">
                  Profile &amp; Dynamics
                </a>
              </li>
            </ul>
          </div>

          {/* Column 5: Connect & Socials */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase text-purple-300/90 font-mono">
              Connect
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm text-gray-400">
              <li>
                <a
                  href="https://github.com/himanvic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <FaGithub className="text-sm" />
                  <span>GitHub</span>
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/Himanvic_dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <FaTwitter className="text-sm" />
                  <span>Twitter / X</span>
                </a>
              </li>
              <li>
                <a
                  href="https://huggingface.co/himanvic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <SiHuggingface className="text-sm" />
                  <span>Hugging Face</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/himanvic/himanvic-portfolio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-purple-300 transition-colors flex items-center gap-1.5"
                >
                  <span>Source Code</span>
                  <FaExternalLinkAlt className="text-[10px] opacity-70" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} Himanvic. Crafted with React &amp; Vite.</p>

          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-purple-400 hover:bg-purple-950/40 text-gray-300 hover:text-white transition-all cursor-pointer shadow-sm group"
          >
            <span>Back to top</span>
            <FaArrowUp className="text-[10px] group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
