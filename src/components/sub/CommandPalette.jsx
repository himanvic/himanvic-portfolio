// File Name: CommandPalette.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaTerminal, FaTimes, FaRocket, FaCode, FaGlobeAmericas } from "react-icons/fa";
import { playCyberBlip } from "@/utils/audio";

const triggerHyperspaceWarp = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("hyperspace-warp"));
  }
};

const HELP_COMMANDS = [
  { cmd: "earth", desc: "Warp to real-time 3D Earth (NASA Day/Night)" },
  { cmd: "algo", desc: "Open interactive live algorithm visualizer" },
  { cmd: "warp", desc: "Engage Three.js hyperspace warp speed" },
  { cmd: "c++", desc: "Display C++ systems architecture profile" },
  { cmd: "python", desc: "Display Python algorithmic explorations" },
  { cmd: "projects", desc: "Navigate to full project archive (/projects)" },
  { cmd: "skills", desc: "Scroll to skills wormhole" },
  { cmd: "journey", desc: "Scroll to engineering journey" },
  { cmd: "github", desc: "Open GitHub profile" },
  { cmd: "clear", desc: "Clear terminal history" },
];

export const CommandPalette = ({ onOpenVisualizer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [logs, setLogs] = useState([
    { type: "system", text: "Himanvic OS Shell [Version 2.4.0]" },
    { type: "system", text: "Type 'help' or click quick pills below to execute commands." },
  ]);
  const inputRef = useRef(null);
  const terminalEndRef = useRef(null);
  const navigate = useNavigate();

  // Keyboard shortcut listener: Ctrl+K / Cmd+K and Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  // Scroll to bottom of terminal output
  useEffect(() => {
    if (isOpen) {
      terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, isOpen]);

  const executeCommand = (rawCmd) => {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    playCyberBlip(780, 0.035);

    const userEntry = { type: "user", text: `> ${rawCmd}` };
    const newLogs = [...logs, userEntry];

    switch (cmd) {
      case "help":
        newLogs.push({
          type: "output",
          text: HELP_COMMANDS.map((c) => `  ${c.cmd.padEnd(10)} - ${c.desc}`).join("\n"),
        });
        break;

      case "earth":
      case "globe":
      case "world":
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("open-earth-modal"));
        }
        setIsOpen(false);
        newLogs.push({
          type: "success",
          text: "🌍 Warping to real-time 3D Earth with NASA day/night terminator...",
        });
        break;

      case "warp":
      case "lightspeed":
        triggerHyperspaceWarp();
        newLogs.push({
          type: "success",
          text: "🚀 Hyperspace warp field engaged! Three.js starfield accelerating to 3.5c...",
        });
        break;

      case "algo":
      case "visualize":
      case "sort":
        onOpenVisualizer();
        setIsOpen(false);
        newLogs.push({
          type: "success",
          text: "⚡ Opening Interactive Algorithmic Workbench...",
        });
        break;

      case "c++":
      case "cpp":
      case "cat profile.cpp":
        newLogs.push({
          type: "cyan",
          text: `struct Developer {
    std::string name = "Himanvic";
    std::string role = "Systems & Low-Level Programmer";
    std::vector<std::string> stack = {"C++20", "Memory Layouts", "Pointers", "Algorithms"};
    void mission() { std::cout << "Pushing performance boundaries." << std::endl; }
};`,
        });
        break;

      case "python":
      case "py":
      case "python algo.py":
        newLogs.push({
          type: "amber",
          text: `class Himanvic:
    skills = ["Python 3.12", "Data Structures", "Scientific Logic", "Automation"]
    focus = "Algorithmic purity, math modeling, and clean architectures."`,
        });
        break;

      case "projects":
        navigate("/projects");
        setIsOpen(false);
        newLogs.push({ type: "success", text: "Navigating to /projects..." });
        break;

      case "skills":
        window.location.hash = "#skills";
        setIsOpen(false);
        break;

      case "journey":
        window.location.hash = "#profile";
        setIsOpen(false);
        break;

      case "github":
        window.open("https://github.com/himanvic", "_blank");
        newLogs.push({ type: "success", text: "Opening https://github.com/himanvic..." });
        break;

      case "clear":
        setLogs([]);
        setInput("");
        return;

      case "exit":
      case "close":
      case "quit":
        setIsOpen(false);
        setInput("");
        return;

      default:
        newLogs.push({
          type: "error",
          text: `Command not found: '${rawCmd}'. Type 'help' for available commands.`,
        });
    }

    setLogs(newLogs);
    setInput("");
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    executeCommand(input);
  };

  return (
    <>
      {/* Floating HUD Trigger Pill (Bottom Right Corner) */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 px-3.5 py-2 rounded-full bg-[#080d1e]/90 hover:bg-cyan-950/80 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white text-xs font-mono flex items-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.35)] backdrop-blur-xl transition-all hover:scale-105 cursor-pointer group"
        title="Open Terminal (Ctrl + K)"
      >
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <FaTerminal className="text-xs group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline font-bold">Terminal</span>
        <kbd className="hidden sm:inline px-1.5 py-0.5 rounded bg-black/60 border border-white/10 text-[10px] text-gray-400">
          Ctrl K
        </kbd>
      </button>

      {/* Terminal Modal Dialog */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-[#060a17]/98 border border-cyan-500/40 rounded-3xl shadow-[0_0_80px_rgba(6,182,212,0.3)] overflow-hidden flex flex-col max-h-[85vh] cursor-default"
          >
            {/* Terminal Window Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-cyan-500/20 bg-black/50 select-none">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="font-mono text-xs text-cyan-300 font-bold ml-2">
                  himanvic.sys | cyber_terminal v2.4
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-gray-500 hidden sm:inline">ESC to close</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <FaTimes className="text-xs" />
                </button>
              </div>
            </div>

            {/* Quick Action Pills for One-Click Execution (Mobile & Desktop Friendly) */}
            <div className="flex items-center gap-1.5 p-3 bg-black/30 border-b border-white/5 overflow-x-auto scrollbar-none text-[11px] font-mono">
              <span className="text-gray-500 mr-1 hidden sm:inline">Quick:</span>
              <button
                onClick={() => executeCommand("earth")}
                className="px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/30 text-emerald-300 flex items-center gap-1 cursor-pointer transition-colors whitespace-nowrap"
              >
                <FaGlobeAmericas className="text-[9px]" />
                <span>earth</span>
              </button>
              <button
                onClick={() => executeCommand("warp")}
                className="px-2.5 py-1 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/30 text-cyan-300 flex items-center gap-1 cursor-pointer transition-colors whitespace-nowrap"
              >
                <FaRocket className="text-[9px]" />
                <span>warp</span>
              </button>
              <button
                onClick={() => executeCommand("algo")}
                className="px-2.5 py-1 rounded-lg bg-amber-950/60 hover:bg-amber-900/80 border border-amber-500/30 text-amber-300 flex items-center gap-1 cursor-pointer transition-colors whitespace-nowrap"
              >
                <FaCode className="text-[9px]" />
                <span>algo</span>
              </button>
              <button
                onClick={() => executeCommand("c++")}
                className="px-2.5 py-1 rounded-lg bg-sky-950/60 hover:bg-sky-900/80 border border-sky-500/30 text-sky-300 cursor-pointer transition-colors whitespace-nowrap"
              >
                c++
              </button>
              <button
                onClick={() => executeCommand("python")}
                className="px-2.5 py-1 rounded-lg bg-yellow-950/60 hover:bg-yellow-900/80 border border-yellow-500/30 text-yellow-300 cursor-pointer transition-colors whitespace-nowrap"
              >
                python
              </button>
              <button
                onClick={() => executeCommand("projects")}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 cursor-pointer transition-colors whitespace-nowrap"
              >
                projects
              </button>
              <button
                onClick={() => executeCommand("help")}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 cursor-pointer transition-colors whitespace-nowrap"
              >
                help
              </button>
            </div>

            {/* Terminal Console Logs */}
            <div className="flex-1 p-5 overflow-y-auto font-mono text-xs space-y-2 bg-[#040813] select-text">
              {logs.map((log, i) => (
                <div key={i} className="leading-relaxed">
                  {log.type === "user" && <span className="text-amber-400 font-bold">{log.text}</span>}
                  {log.type === "system" && <span className="text-gray-400">{log.text}</span>}
                  {log.type === "output" && (
                    <pre className="text-cyan-200 whitespace-pre-wrap">{log.text}</pre>
                  )}
                  {log.type === "cyan" && (
                    <pre className="text-sky-300 whitespace-pre-wrap bg-sky-950/30 p-2.5 rounded-xl border border-sky-500/20">
                      {log.text}
                    </pre>
                  )}
                  {log.type === "amber" && (
                    <pre className="text-amber-300 whitespace-pre-wrap bg-yellow-950/30 p-2.5 rounded-xl border border-yellow-500/20">
                      {log.text}
                    </pre>
                  )}
                  {log.type === "success" && <span className="text-emerald-400">{log.text}</span>}
                  {log.type === "error" && <span className="text-rose-400">{log.text}</span>}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            {/* Command Input Prompt */}
            <form
              onSubmit={handleFormSubmit}
              className="flex items-center gap-2 px-5 py-3 border-t border-cyan-500/20 bg-black/60"
            >
              <span className="font-mono text-cyan-400 font-bold select-none">&gt;</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="type a command... ('algo', 'warp', 'c++', 'help')"
                className="flex-1 bg-transparent border-none outline-none font-mono text-xs text-white placeholder-gray-500"
              />
              <button
                type="submit"
                className="px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold transition-all cursor-pointer"
              >
                RUN
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CommandPalette;
