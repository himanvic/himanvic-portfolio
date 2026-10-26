import React from "react";
import { FaGithub, FaTwitter } from "react-icons/fa";
import { SiHuggingface } from "react-icons/si";

const Footer = () => {
  return (
    <footer className="w-full text-white py-12 px-4 sm:px-10 bg-transparent relative z-10">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row flex-wrap justify-center sm:justify-between gap-12 text-sm md:text-base text-gray-300">
        {/* Community & Profiles */}
        <div className="flex flex-col gap-3 min-w-[200px]">
          <h3 className="text-white font-semibold text-lg">Community &amp; Profiles</h3>
          <a
            href="https://github.com/himanvic"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <FaGithub /> GitHub
          </a>
          <a
            href="https://huggingface.co/himanvic"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <SiHuggingface /> Hugging Face
          </a>
          <a
            href="https://x.com/Himanvic_dev"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <FaTwitter /> Twitter / X
          </a>
        </div>

        {/* Featured Projects */}
        <div className="flex flex-col gap-3 min-w-[200px]">
          <h3 className="text-white font-semibold text-lg">Featured Projects</h3>
          <a
            href="https://mausam-india.pages.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Mausam India
          </a>
          <a
            href="https://naradnow.pages.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            NaradNow
          </a>
          <a
            href="https://rail-route-website.pages.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Rail &amp; Route
          </a>
        </div>

        {/* Navigation & Contact */}
        <div className="flex flex-col gap-3 min-w-[200px]">
          <h3 className="text-white font-semibold text-lg">Quick Links</h3>
          <a href="#about" className="hover:text-white transition-colors">
            About Himanvic
          </a>
          <a href="#projects" className="hover:text-white transition-colors">
            My Projects
          </a>
          <a
            href="https://github.com/himanvic/himanvic-portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Portfolio Source Code
          </a>
          <a
            href="https://x.com/Himanvic_dev"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Connect on X
          </a>
        </div>
      </div>

      {/* Divider + Copyright */}
      <div className="mt-12 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm">
        © Himanvic 2026. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
