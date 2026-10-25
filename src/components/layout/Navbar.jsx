// File Name: Navbar.jsx
import { FaGithub, FaTwitter, FaCode } from "react-icons/fa";
import { SiHuggingface } from "react-icons/si";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/30 backdrop-blur-sm py-4 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
        {/* Left: Logo + Name */}
        <div className="flex items-center gap-2.5">
          <img src="/favicon.svg" alt="Himanvic logo" className="w-8 h-8 rounded-lg shadow-md hover:scale-105 transition-transform" />
          <span className="text-white font-semibold text-lg tracking-wide">Himanvic</span>
        </div>

        {/* Center: Menu Links */}
        <nav className="bg-gradient-to-r from-purple-900 via-purple-600 to-purple-900 rounded-full px-6 py-2 flex flex-wrap justify-center gap-4 text-white font-medium text-sm backdrop-blur-sm shadow-md lg:transform lg:-translate-x-10">
          <Link to="/#about" className="cursor-pointer hover:text-purple-300 transition-colors">
            About me
          </Link>
          <Link to="/#skills" className="cursor-pointer hover:text-purple-300 transition-colors">
            Skills
          </Link>
          <Link to="/#projects" className="cursor-pointer hover:text-purple-300 transition-colors">
            Projects
          </Link>
          <a
            href="https://github.com/himanvic"
            target="_blank"
            rel="noreferrer"
            className="hover:text-purple-300 transition-colors"
          >
            GitHub
          </a>
        </nav>

        {/* Right: Socials */}
        <div className="flex gap-4 text-white text-lg">
          <a
            href="https://github.com/himanvic"
            target="_blank"
            rel="noreferrer"
            title="GitHub"
            className="hover:text-purple-400 transition-colors"
          >
            <FaGithub />
          </a>
          <a
            href="https://x.com/Himanvic_dev"
            target="_blank"
            rel="noreferrer"
            title="Twitter / X"
            className="hover:text-purple-400 transition-colors"
          >
            <FaTwitter />
          </a>
          <a
            href="https://huggingface.co/himanvic"
            target="_blank"
            rel="noreferrer"
            title="Hugging Face"
            className="hover:text-purple-400 transition-colors"
          >
            <SiHuggingface />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
